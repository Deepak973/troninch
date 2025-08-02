Here's an updated version of your **Tron README** tailored specifically to your current project, which includes deploying the **Resolver**, **EscrowFactory**, and **USDT token contract** to the **Nile testnet**.

---

# 🔁 Cross-Chain Swap – Tron Contracts

This project contains smart contracts deployed on the **Tron Nile Testnet** that enable a cross-chain escrow mechanism between Ethereum Sepolia and Tron Nile. Contracts include:

- `EscrowFactory`
- `Resolver`
- `USDT Token (Mock)`

---

## 🧩 Contracts Deployed (Nile Testnet)

| Contract      | Address                              |
| ------------- | ------------------------------------ |
| Resolver      | `TAEM6EmHnNjncRNdKbdPBAnqT2yPNre18D` |
| EscrowFactory | `TLpKWuX44hCXcRZtPzj6VYKp4hpo9XBjHT` |
| USDT Token    | `TM5ozNYWF9mPg4VFG3WbSxaML1ZCRPDk4w` |

---

## ⚙️ Setup & Configuration

Update your private keys and endpoints in `.env`:

```bash
PRIVATE_KEY_NILE=your_private_key_here
```

Update `tronbox-config.js`:

```js
nile: {
  privateKey: process.env.PRIVATE_KEY_NILE,
  userFeePercentage: 100,
  feeLimit: 1000000000,
  fullHost: 'https://nile.trongrid.io',
  network_id: '3',
}
```

---

## 📦 Compile Contracts

```bash
tronbox compile
```

---

## 🚀 Deploy Contracts to Nile

To deploy the contracts on **Nile**, run:

```bash
source .env && tronbox migrate --network nile
```

To run a specific deployment file only (e.g., `3_mint_token.js`):

```bash
source .env && tronbox migrate --f 3 --to 3 --network nile
```

---

## 🧪 Test Contracts

```bash
tronbox test --network nile
```

---

## 📝 Notes

- You can mint more USDT by calling the public `mint` function.
- The deployed `USDT` contract gives 10,000 tokens to `msg.sender` during deployment.

---

## 🌐 Related Resources

- [Tron Dev Portal](https://developers.tron.network)
- [Nile Faucet](https://nileex.io/join/getJoinPage)
- [TronBox Docs](https://tronbox.io)
