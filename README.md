Here’s a clean and properly formatted `README.md` based on your instructions:

---

````markdown
# Cross-Chain Escrow Deployment

This project implements a cross-chain escrow system using Ethereum (Sepolia testnet) and Tron (Nile testnet), allowing secure token transfers between chains.

---

## 🟩 Deploy on Ethereum (Sepolia)

### Contracts Deployed:

- ✅ Resolver
- ✅ Escrow Factory
- ✅ USDC Token (ERC20)

### Deployment Commands:

**Deploy Resolver and Escrow Factory:**

```bash
forge script script/deploy/Deploy.s.sol --rpc-url sepolia --broadcast --verify -vvvv
```
````

**Deploy USDC Token:**

```bash
forge script script/deploy/DeployUSDC.s.sol --rpc-url sepolia --broadcast -vvvv
```

### Deployed Addresses:

- **Resolver**: `0x8F20f5F792825d72c7Ca29853e43A54c66c05F42`
- **Escrow Factory**: `0x1493b1980F747deEa61c30C2C54730931c90FB47`
- **USDC Token**: `0xaA329d7B6B8016C7e94642FD46EeF999C5DB3CAd`

---

## 🟥 Deploy on Tron (Nile Testnet)

### Contracts Deployed:

- ✅ Resolver
- ✅ Escrow Factory
- ✅ USDT Token (TRC20)

### Deployment Command:

```bash
source .env && tronbox migrate --network nile
```

### Deployed Addresses:

- **Resolver**: `TAEM6EmHnNjncRNdKbdPBAnqT2yPNre18D`
- **Escrow Factory**: `TLpKWuX44hCXcRZtPzj6VYKp4hpo9XBjHT`
- **USDT Token**: `TM5ozNYWF9mPg4VFG3WbSxaML1ZCRPDk4w`

---

## ✅ Notes

- Make sure to fund testnet wallets with ETH on Sepolia and TRX on Nile.
- Token contracts allow minting. On Sepolia, `USDC` is mintable. On Nile, `USDT` is mintable.
- This setup is meant for **bi-directional cross-chain swaps** using hashlocks and time-based conditions.

```

---

Let me know if you want to add badges (e.g., Etherscan links), usage instructions, or architecture overview.
```
