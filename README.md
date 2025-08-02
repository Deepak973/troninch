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
forge script script/deploy/deploy.s.sol --rpc-url sepolia --broadcast --verify -vvvv
```
````

**Deploy USDC Token:**

```bash
forge script script/deploy/DeployUSDC.s.sol --rpc-url sepolia --broadcast -vvvv
```

### Deployed Addresses:

- **Resolver**: `0x5E69CdDD16F334EB662601e2020501776cbb0589`
- **Escrow Factory**: `0xAaF4a298fa52649DeFdbe4e8f8a0f5eAB8e2985E`
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

- **Resolver**: `TZBq34odoSm8PyCYi8rNB45o1w9gfGADaA`
- **Escrow Factory**: `TUZTGLzD7XqiNet7JpMsivcegkz71a8Wfy`
- **USDT Token**: `TV5o5VX8CAGP18CwHpbbEd7VcjpRWSKFiK`

---

## ✅ Notes

- Make sure to fund testnet wallets with ETH on Sepolia and TRX on Nile.
- Token contracts allow minting. On Sepolia, `USDC` is mintable. On Nile, `USDT` is mintable.
- This setup is meant for **bi-directional cross-chain swaps** using hashlocks and time-based conditions.

```

```
