"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Parser } from "json2csv"; // Import json2csv to handle CSV generation

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>(""); // For storing entered wallet address
  const [transactions, setTransactions] = useState<any[]>([]); // To store fetched transactions
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Etherscan API key (replace with your own key)
  const etherscanApiKey = "YOUR_ETHERSCAN_API_KEY";
  const etherscanUrl = "https://api.etherscan.io/api";

  // Function to handle search and fetch transactions for entered address
  const handleSearch = async () => {
    if (!address || !isValidAddress(address)) {
      setError("Please enter a valid Ethereum address.");
      return; // Don't search if the address is empty or invalid
    }

    setIsLoading(true);
    setError(null);
    setTransactions([]);

    try {
      const response = await fetch(
        `${etherscanUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`
      );
      const data = await response.json();

      console.log("Etherscan API Response:", data); // Debugging: Check the API response

      if (data.status === "1") {
        setTransactions(data.result); // Set the transaction data
      } else {
        setError(data.message || "No transactions found or an error occurred.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err); // Debugging: Log any errors
      setError("Error fetching transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate Ethereum address format
  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  // Function to generate CSV from transactions
  const generateCSV = () => {
    if (transactions.length > 0) {
      const parser = new Parser();
      const csv = parser.parse(transactions); // Convert JSON to CSV

      // Create a blob with CSV data
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      // Create a link to download the CSV file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `transactions_${address}.csv`;
      link.click();
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Decaf</span>
          </h1>
          
          {/* Search Bar */}
          <div className="my-4 flex justify-center items-center">
            <input
              type="text"
              className="input input-bordered w-full sm:w-96"
              placeholder="Enter wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              className="btn ml-4"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Search"}
            </button>
          </div>

          {/* Display Transactions if there are any */}
          {address && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-center">Recent Transactions for {address}</h2>

              {isLoading ? (
                <p className="text-center">Loading transactions...</p>
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : transactions.length === 0 ? (
                <p className="text-center">No transactions found for this address.</p>
              ) : (
                <div className="mt-4">
                  {transactions.map((tx: any) => (
                    <div key={tx.hash} className="border-b py-2">
                      <p className="font-semibold">Tx Hash: 
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          className="text-blue-600"
                          rel="noopener noreferrer"
                        >
                          {tx.hash}
                        </a>
                      </p>
                      <p>Block: {tx.blockNumber}</p>
                      <p>From: {tx.from}</p>
                      <p>To: {tx.to}</p>
                      <p>Value: {tx.value} Wei</p>
                      <p>Date: {new Date(tx.timeStamp * 1000).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Button to generate CSV */}
              <div className="text-center mt-4">
                <button
                  onClick={generateCSV}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md"
                  disabled={transactions.length === 0}
                >
                  Download Transactions as CSV
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
