import { useState, ChangeEvent } from "react";
import { CardanoWallet } from "@meshsdk/react";
import { Transaction } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";

interface TxParam {
  address: string;
  amount: string;
}

export default function Home() {
  const { connected, wallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [txParam, setTxParam] = useState<TxParam>({
    address: "",
    amount: "",
  });

  const resetTxParam = () => {
    setTxParam((prevTxParam) => ({
      ...prevTxParam,
      address: "",
      amount: "",
    }));
  };

  const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setTxParam((prevTxParam) => ({
      ...prevTxParam,
      address: address,
    }));
  };

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setTxParam((prevTxPram) => ({ ...prevTxPram, amount: amount }));
  };

  const handleSend = async () => {
    setLoading(true);
    const lovelaceAmount = (parseInt(txParam.amount) * 1000000).toString();

    const tx = new Transaction({ initiator: wallet }).sendLovelace(
      txParam.address,
      lovelaceAmount
    );

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

    console.log(`Your transaction was successfull with Tx-ID: ${txHash}`);
    resetTxParam();
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="text-center flex justify-between items-center border-b border-white p-4 mb-8">
        <h1 className="text-4xl font-bold">Send ADA to Some Address</h1>
        <div>
          <CardanoWallet isDark={true} />
        </div>
      </div>

      {!connected && (
        <h1 className="text-center text-xl text-red-500 mb-8">
          Please connect your wallet
        </h1>
      )}

      {connected && (
        <>
          <h1 className="text-center text-xl text-green-500 mb-8">
            Your wallet is connected
          </h1>

          <div className="flex justify-center items-center">
            <div className="border border-white p-6 rounded-2xl">
              <div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={txParam.address}
                  placeholder="Your Wallet Address"
                  className="border border-white bg-slate-800 px-3 py-2 w-64 rounded-xl mb-4"
                  onChange={handleChangeAddress}
                />
              </div>

              <div>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  value={txParam.amount}
                  placeholder="ADA Amount"
                  className="border border-white bg-slate-800 px-3 py-2 w-64 rounded-xl mb-4"
                  onChange={handleChangeAmount}
                />
              </div>

              <button
                className="border border-white bg-slate-500 hover:bg-slate-600 hover:font-semibold px-2 py-2 w-64 rounded-xl"
                disabled={loading}
                onClick={handleSend}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
