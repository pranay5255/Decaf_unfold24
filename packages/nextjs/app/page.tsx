"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { getTokenBalanceOfAdress } from "./getTokenBalanceOfAdress";





//impose base.json file




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
      label: "Smart Contract Platform",
      isSelected: false,
    },
    {
      label: "Layer1",
      isSelected: false,
    },
    {
      label: "PoW",
      isSelected: false,
    },
    {
      label: "PoS",
      isSelected: false,
    },
    {
      label: "Stablecoins",
      isSelected: false,
    },
  ]);

  const tokenMetadata = {
    "Ryoshi": ["Smart Contract Platform", "Layer1", "PoS"],
    "Pepe 2.0": ["Smart Contract Platform", "Layer1"],
    "Cardano (ADA)": ["Smart Contract Platform", "PoS"],
    "Avalanche (AVAX)": ["Smart Contract Platform", "PoS"],
    "Tezos (XTZ)": ["Smart Contract Platform"],
    "Bitcoin (BTC)": ["Layer1", "PoW"],
    "Binance Coin (BNB)": ["Layer1"],
    "Polkadot (DOT)": ["Layer1", "PoS"],
    "Litecoin (LTC)": ["PoW"],
    "Monero (XMR)": ["PoW"],
    "Ethereum Classic (ETC)": ["PoW"],
    "Zcash (ZEC)": ["PoW"],
    "Ethereum 2.0 (ETH2)": ["PoS"],
    "Algorand (ALGO)": ["PoS"],
    "Tether (USDT)": ["Stablecoins"],
    "USD Coin (USDC)": ["Stablecoins"],
    "Binance USD (BUSD)": ["Stablecoins"],
    "Dai (DAI)": ["Stablecoins"],
    "Pax Dollar (USDP)": ["Stablecoins"],
  };


  console.log(error);
  console.log(transactions);
  console.log(address, isConnected);

  // Etherscan API key (replace with your own key)
  const etherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  const etherscanUrl = "https://api.etherscan.io/api";

  // Function to handle search and fetch transactions for entered address
  const handleSearch = async (address:any) => {
    if (!useraddress || !isValidAddress(useraddress)) {
      setError("Please enter a valid Ethereum address.");
      return; // Don't search if the address is empty or invalid
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getTokenBalanceOfAdress(address, console.error, addr => /^0x[a-fA-F0-9]{40}$/.test(addr));
      getLabels(data)
      
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Error fetching transactions.");
    } finally {
      setIsLoading(false);
    }
  };


  //In your Home component:
  useEffect(() => {
    const loadTransactions = async () => { // Define the function inside the effect
    try {
      const data = await getTokenBalanceOfAdress(address, console.error, addr => /^0x[a-fA-F0-9]{40}$/.test(addr));
      getLabels(data)
      
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Error fetching transactions.");
    } finally {
      setIsLoading(false);
    }
  };
    loadTransactions(); // Call the function inside useEffect

  }, [address]);

  const getLabels =(tokens:any)=>{
    tokens = Object.values(tokens);
    console.log(Object.values(tokens)) //get unique value values
    const metadata_list = Object.keys(tokenMetadata);
    const list = userOptions;
    let filteredList:any[] = [];
    metadata_list.forEach((token:any) => {
      if (tokens[0].indexOf(token)!=-1) {
        filteredList = filteredList.concat(tokenMetadata[token]);
      }
    });
    list.forEach(item => {
      if (filteredList.indexOf(item.label)!=-1) {
        item.isSelected = true;
      }else{
        item.isSelected = false;
      }
    });
    setUserOptions(list);
  }

  

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
              <button className="btn ml-4" onClick={()=>handleSearch(useraddress)} disabled={isLoading}>
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
        </div>
      </div>
    </>
  );
};

export default Home;
