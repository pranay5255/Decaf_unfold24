"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

// Import json2csv to handle CSV generation

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [useraddress, setAddress] = useState<string>(""); // For storing entered wallet address
  const [showAddress, setShowAddress] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]); // To store fetched transactions
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [userOptions, setUserOptions] = useState<any[]>([
    {
      label: "Smart contract platform",
      isSelected: false,
    },
    {
      label: "Layer 1",
      isSelected: false,
    },
    {
      label: "Proof of Work (PoW)",
      isSelected: false,
    },
    {
      label: "Proof of Stake (PoW)",
      isSelected: false,
    },
    {
      label: "Multicoin Capital portfolio (PoW)",
      isSelected: false,
    },
  ]);
  console.log(error);
  console.log(transactions);
  console.log(address, isConnected);

  // Etherscan API key (replace with your own key)
  const etherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  const etherscanUrl = "https://api.etherscan.io/api";

  // Function to handle search and fetch transactions for entered address
  const handleSearch = async () => {
    if (!useraddress || !isValidAddress(useraddress)) {
      setError("Please enter a valid Ethereum address.");
      return; // Don't search if the address is empty or invalid
    }

    setIsLoading(true);
    setError(null);
    setTransactions([]);

    try {
      const response = await fetch(
        `${etherscanUrl}?module=account&action=txlist&address=${useraddress}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`,
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

  const loadTransactions = async () => {
    try {
      const response = await fetch(
        `${etherscanUrl}?module=account&action=addresstokenbalance&address=0x983e3660c0bE01991785F80f266A84B911ab59b0&page=1&offset=100&apikey=${etherscanApiKey}`,
      );
      // `${etherscanUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`,

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

  loadTransactions();

  const selectOption = (option: any) => {
    const list = userOptions;
    list.forEach(item => {
      if (item.label === option.label) {
        item.isSelected = !item.isSelected;
      }
    });
    setUserOptions([...userOptions]);
  };

  const handleAddress = () => {
    setShowAddress(!showAddress);
  };

  // Helper function to validate Ethereum address format
  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  function goToAnalytics(): void {
    //navigate to the debug path
    router.push("/analytics");
  }

  // Function to generate CSV from transactions
  // const generateCSV = () => {
  //   if (transactions.length > 0) {
  //     const parser = new Parser();
  //     const csv = parser.parse(transactions); // Convert JSON to CSV

  //     // Create a blob with CSV data
  //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  //     // Create a link to download the CSV file
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `transactions_${address}.csv`;
  //     link.click();
  //   }
  // };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-left">
            <span className="block text-4xl font-bold">Select Interests</span>
          </h1>
          <div className="text-left">
            <input
              id="theme-toggle"
              type="checkbox"
              className="addressToggle toggle toggle-primary bg-primary hover:bg-primary border-primary"
              onChange={handleAddress}
              checked={showAddress}
            />
            <label className="addressToggleLabel" htmlFor="theme-toggle">
              Allow the user to enter the Eth address
            </label>
          </div>
          <br />

          {/* Search Bar */}
          {showAddress && (
            <div className="my-4 flex justify-left items-left">
              <input
                type="text"
                className="input input-bordered w-full sm:w-96"
                placeholder="Enter wallet address"
                value={useraddress}
                onChange={e => setAddress(e.target.value)}
              />
              <button className="btn ml-4" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Loading..." : "Search"}
              </button>
            </div>
          )}

          {userOptions.map((option: any, index) => (
            <button
              key={1}
              style={index === 0 ? { marginLeft: 0 } : {}}
              className={`btn ml-4 optionButton ${option.isSelected ? "selected" : ""}`}
              onClick={() => selectOption(option)}
              disabled={isLoading}
            >
              #{option.label}
            </button>
          ))}
          <br />

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", marginBottom: "1rem" }}>
            <button
              style={{ width: "300px", background: "#4848d4", color: "#ffffff" }} // Increased width
              className={`btn ${userOptions.filter(option => option.isSelected).length == 0 ? "hide" : ""}`}
              onClick={goToAnalytics}
              disabled={userOptions.filter(option => option.isSelected).length === 0}
            >
              {isLoading ? "Loading..." : "Show Analytics"}
            </button>
          </div>

          {/* Button to generate CSV */}
          {useraddress && (
            <div className="text-center mt-4">
              <button
                onClick={() => {}}
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
                disabled={userOptions.filter(option => option.isSelected).length == 0}
              >
                Download Transactions as CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
