import { AtomicSwap } from "./components/AtomicSwap";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/troninchlogo.jpg"
              alt="TronInch Logo"
              className="w-60 h-16 rounded-lg object-cover"
            />
          </div>
        </div>
        <AtomicSwap />
      </div>
    </div>
  );
}
