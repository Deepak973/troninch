"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { sepolia } from "@reown/appkit/networks";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  chainId: number;
}

const TOKENS = {
  sepolia: {
    USDC: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
      decimals: 6,
      logoURI:
        "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png",
      chainId: 11155111, // Sepolia
    },
  },
  tron: {
    USDT: {
      symbol: "USDT",
      name: "Tether USD",
      address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", // Tron USDT
      decimals: 6,
      logoURI: "https://assets.coingecko.com/coins/images/325/thumb/Tether.png",
      chainId: 728126428, // Tron Mainnet
    },
  },
};

export const AtomicSwap = () => {
  const { address, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, isPending } = useWriteContract();

  // State management
  const [fromToken, setFromToken] = useState<Token>(TOKENS.sepolia.USDC);
  const [toToken, setToToken] = useState<Token>(TOKENS.tron.USDT);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<"from" | "to">("from"); // Track which input is active
  const [error, setError] = useState<string>("");

  // Get balance for the selected token
  const { data: balance } = useBalance({
    address,
    token: fromToken.address as `0x${string}`,
    chainId: fromToken.chainId,
  });

  // Calculate swap rate (mock calculation - in real implementation, this would come from DEX aggregator)
  useEffect(() => {
    if (inputMode === "from" && fromAmount && parseFloat(fromAmount) > 0) {
      // Mock 1:1 rate for demo purposes
      const calculatedAmount = parseFloat(fromAmount) * 1;
      setToAmount(calculatedAmount.toFixed(6));
      setError("");
    } else if (inputMode === "to" && toAmount && parseFloat(toAmount) > 0) {
      // Calculate reverse rate
      const calculatedAmount = parseFloat(toAmount) * 1;
      setFromAmount(calculatedAmount.toFixed(6));
      setError("");
    } else {
      if (inputMode === "from") {
        setToAmount("");
      } else {
        setFromAmount("");
      }
    }
  }, [fromAmount, toAmount, inputMode]);

  // Validate amounts
  useEffect(() => {
    if (fromAmount && balance) {
      const inputAmount = parseFloat(fromAmount);
      const balanceAmount = parseFloat(balance.formatted);

      if (inputAmount > balanceAmount) {
        setError(
          `Insufficient balance. You have ${balanceAmount.toFixed(4)} ${
            fromToken.symbol
          }`
        );
      } else if (inputAmount <= 0) {
        setError("Amount must be greater than 0");
      } else {
        setError("");
      }
    }
  }, [fromAmount, balance, fromToken.symbol]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
    setToAmount("");
    setError("");
  };

  const handleMaxAmount = () => {
    if (balance) {
      const maxAmount = parseFloat(balance.formatted) * 0.99; // Leave some for gas
      setFromAmount(maxAmount.toFixed(6));
      setInputMode("from");
    }
  };

  const handleQuickAmount = (percentage: number) => {
    if (balance) {
      const amount = (parseFloat(balance.formatted) * percentage) / 100;
      setFromAmount(amount.toFixed(6));
      setInputMode("from");
    }
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setInputMode("from");
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    setInputMode("to");
  };

  const handleSwap = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (error) {
      alert(error);
      return;
    }

    setIsLoading(true);

    try {
      // Check if user is on the correct network
      if (fromToken.chainId === 11155111) {
        // Sepolia
        await switchChain({ chainId: 11155111 });
      }

      // Mock swap transaction - in real implementation, this would interact with actual DEX contracts
      console.log("Initiating swap:", {
        from: fromToken,
        to: toToken,
        amount: fromAmount,
        slippage,
      });

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Swap initiated! (This is a demo - no actual swap will occur)");

      // Reset form
      setFromAmount("");
      setToAmount("");
      setError("");
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (balance: any) => {
    if (!balance) return "0.00";
    return parseFloat(balance.formatted).toFixed(4);
  };

  return (
    <div className="">
      <div className="max-w-md mx-auto">
        {/* Header */}

        {/* Main Swap Card */}
        <div className=" rounded-2xl p-6 border border-white/20 shadow-2xl">
          {/* From Token */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm">From</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">
                  Balance: {formatBalance(balance)} {fromToken.symbol}
                </span>
                <button
                  onClick={handleMaxAmount}
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  placeholder="0.0"
                  className={`w-full bg-transparent text-2xl font-bold text-white placeholder-gray-500 outline-none ${
                    inputMode === "from" ? "ring-2 ring-blue-500" : ""
                  }`}
                />
              </div>

              <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg px-3 py-2">
                <img
                  src={fromToken.logoURI}
                  alt={fromToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-white font-medium">
                  {fromToken.symbol}
                </span>
                <span className="text-gray-400 text-xs">
                  ({fromToken.chainId === 11155111 ? "Sepolia" : "Tron"})
                </span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex space-x-2 mt-3">
              {[25, 50, 75, 100].map((percentage) => (
                <button
                  key={percentage}
                  onClick={() => handleQuickAmount(percentage)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-gray-300 hover:text-white transition-colors"
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleSwapTokens}
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm">To</span>
              <span className="text-gray-400 text-sm">
                Rate: 1 {fromToken.symbol} = 1 {toToken.symbol}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={toAmount}
                  onChange={(e) => handleToAmountChange(e.target.value)}
                  placeholder="0.0"
                  className={`w-full bg-transparent text-2xl font-bold text-white placeholder-gray-500 outline-none ${
                    inputMode === "to" ? "ring-2 ring-blue-500" : ""
                  }`}
                />
              </div>

              <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg px-3 py-2">
                <img
                  src={toToken.logoURI}
                  alt={toToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-white font-medium">{toToken.symbol}</span>
                <span className="text-gray-400 text-xs">
                  ({toToken.chainId === 11155111 ? "Sepolia" : "Tron"})
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Slippage Settings */}
          <div className="bg-gray-800/30 rounded-lg p-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Slippage Tolerance</span>
              <div className="flex space-x-1">
                {[0.5, 1, 2].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      slippage === value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={
              !isConnected ||
              isLoading ||
              !fromAmount ||
              parseFloat(fromAmount) <= 0 ||
              !!error
            }
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              !isConnected ||
              isLoading ||
              !fromAmount ||
              parseFloat(fromAmount) <= 0 ||
              !!error
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            }`}
          >
            {!isConnected ? (
              "Connect Wallet"
            ) : isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Swapping...</span>
              </div>
            ) : (
              `Swap ${fromToken.symbol} for ${toToken.symbol}`
            )}
          </button>

          {/* Network Info */}
          <div className="mt-4 text-center">
            <div className="text-gray-400 text-sm">
              <p>
                From:{" "}
                {fromToken.chainId === 11155111
                  ? "Ethereum Sepolia"
                  : "Tron Mainnet"}
              </p>
              <p>
                To:{" "}
                {toToken.chainId === 11155111
                  ? "Ethereum Sepolia"
                  : "Tron Mainnet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
