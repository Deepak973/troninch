require("dotenv").config();
const { ethers } = require("ethers");
const { TronWeb } = require("tronweb");
const { keccak256, toUtf8Bytes } = ethers.utils;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Constants
const SECRET = "s3cr3t-key-to-swap";
const HASHLOCK = keccak256(toUtf8Bytes(SECRET));
const TIMELOCK = Math.floor(Date.now() / 1000) + 600; // 10 min from now
const SWAP_AMOUNT = ethers.utils.parseUnits("10", 18);

// ETH Addresses
const ETH_RESOLVER = "0x286c03fAcA258A1567CE0aE176abEcB2F7F7dD79";
const ETH_TOKEN = "0xaA329d7B6B8016C7e94642FD46EeF999C5DB3CAd";

// Tron Addresses
const TRON_RESOLVER = "TZBq34odoSm8PyCYi8rNB45o1w9gfGADaA";
const TRON_TOKEN = "TV5o5VX8CAGP18CwHpbbEd7VcjpRWSKFiK";

// ABIs
const resolverAbi = require("./abi/Resolver.json").abi;
const erc20Abi = require("./abi/USDC.json").abi;
const escrowSrcAbi = require("./abi/EscrowSrc.json").abi;
const escrowDstAbi = require("./abi/EscrowDst.json").abi;

// Ethereum setup
const ethProvider = new ethers.providers.JsonRpcProvider(
  process.env.ETH_RPC_URL
);
const ethWallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, ethProvider);
const ethResolver = new ethers.Contract(ETH_RESOLVER, resolverAbi, ethWallet);
const ethToken = new ethers.Contract(ETH_TOKEN, erc20Abi, ethWallet);

// Tron setup
const tronWeb = new TronWeb({
  fullHost: process.env.TRON_FULL_NODE,
  privateKey: process.env.TRON_PRIVATE_KEY,
});

async function runSwap() {
  console.log(" Starting cross-chain swap...");

  // 1. Approve and lock 10 USDC in EscrowSrc on Sepolia

  console.log(" Approved 10 USDC");

  console.log(" Deploying EscrowSrc on Ethereum...");
  const deployTx = await ethResolver.deploySrcEscrow(
    ethWallet.address,
    ethWallet.address,
    HASHLOCK,
    TIMELOCK,
    ETH_TOKEN
  );
  const receipt = await deployTx.wait();

  console.log(receipt);
  const escrowDeployedTopic = ethers.utils.id("EscrowSrcDeployed(address)"); // topic[0]

  const log = receipt.logs.find((log) => log.topics[0] === escrowDeployedTopic);

  if (!log) {
    throw new Error("EscrowSrcDeployed event not found");
  }

  // topic[1] is the indexed address (escrow)
  const escrowSrcAddress = ethers.utils.getAddress(
    "0x" + log.topics[1].slice(26) // last 40 hex chars = 20 bytes = address
  );

  console.log("EscrowSrc deployed at:", escrowSrcAddress);

  const escrowSrc = new ethers.Contract(
    escrowSrcAddress,
    escrowSrcAbi,
    ethWallet
  );

  console.log(" Approving token on Ethereum...");
  const approveTx = await ethToken.approve(ETH_RESOLVER, SWAP_AMOUNT);
  await approveTx.wait();

  console.log(" Locking 10 USDC in EscrowSrc...");
  const lockTx = await escrowSrc.lock(SWAP_AMOUNT);
  await lockTx.wait();
  console.log(" 10 USDC locked");

  // 2. Wait for withdrawal on Ethereum
  console.log(" Waiting for withdraw on Ethereum to reveal secret...");
  while (true) {
    const events = await escrowSrc.queryFilter("Withdraw");
    if (events.length > 0) {
      console.log(" Secret revealed. Proceeding to unlock Tron escrow.");
      break;
    }
    await delay(5000);
  }

  // 3. Deploy EscrowDst on Tron using same secret
  const tronResolver = await tronWeb.contract().at(TRON_RESOLVER);
  const maker = tronWeb.defaultAddress.base58;
  const taker = maker; // mock swap to self

  console.log("🚀 Deploying EscrowDst on Tron...");
  const tx = await tronResolver
    .deployDstEscrow(
      maker,
      taker,
      HASHLOCK,
      TIMELOCK,
      TRON_TOKEN,
      SWAP_AMOUNT.toString()
    )
    .send({ feeLimit: 1_000_000_000 });
  console.log(" EscrowDst deployed.", tx);

  // 4. Withdraw USDT from Tron escrow using revealed secret
  console.log(" Withdrawing from Tron escrow using revealed secret...");
  const escrowDstAddress = tx; // assumed tx returns the deployed address
  const escrowDst = await tronWeb.contract(escrowDstAbi, escrowDstAddress);
  const result = await escrowDst.withdraw(SECRET).send();

  console.log(" Swap complete. Tron TxID:", result);
}

runSwap().catch(console.error);
