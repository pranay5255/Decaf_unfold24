"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { getTokenBalanceOfAdress } from "./getTokenBalanceOfAdress";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [useraddress, setAddress] = useState<string>("");
  const [showAddress, setShowAddress] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedTokens, setFetchedTokens] = useState<any[]>([]);
  const [topTokens, setTopTokens] = useState<[string, any][]>([]);
  const [userOptions, setUserOptions] = useState<any[]>([
    { label: "Smart Contract Platform", isSelected: false },
    { label: "Layer1", isSelected: false },
    { label: "PoW", isSelected: false },
    { label: "PoS", isSelected: false },
    { label: "Stablecoins", isSelected: false },
  ]);

  const tokenMetadata = {
    // Existing tokens
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
    // New tokens
    "$ USDCXMAS.com": ["Stablecoins"],
    "$ ETHGiftX.com": ["Smart Contract Platform"],
    "tetris": ["Layer1"],
    "MON": ["Layer1"],
    "USD Coin": ["Stablecoins"],
    "Metis Token": ["Layer1", "Smart Contract Platform"],
    "# UrgentDT.com": ["Smart Contract Platform"],
    "Wrapped TAO": ["Layer1"],
    "SY Kelp rsETH": ["Smart Contract Platform", "PoS"],
    "# liquid-eth.net": ["Smart Contract Platform"],
    "Wrapped Ethereum DYDX": ["Smart Contract Platform", "Layer1"],
    "SY Zircuit Staking rsETH": ["Smart Contract Platform", "PoS"],
    "Quil QAT": ["Layer1"],
    "YT Kelp rsETH 27JUN2024": ["Smart Contract Platform", "PoS"]
  };

  const getTopHoldings = (tokens: any) => {
    if (!tokens || !tokens[0]) return [];
    
    const holdings = Object.entries(tokens[0]);
    const sortedHoldings = holdings
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .slice(0, 3);
    
    setTopTokens(sortedHoldings);
    return sortedHoldings;
  };

  const handleSearch = async (address: any) => {
    if (!useraddress || !isValidAddress(useraddress)) {
      setError("Please enter a valid Ethereum address.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const data = await getTokenBalanceOfAdress(address, console.error, addr => /^0x[a-fA-F0-9]{40}$/.test(addr));
      setFetchedTokens(data);
      getTopHoldings(data);
      localStorage.setItem('walletData', JSON.stringify({
        tokens: data[0],
        metadata: tokenMetadata
      }));
      getLabels(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Error fetching transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  const getLabels = (tokens: any) => {
    tokens = Object.values(tokens);
    const metadata_list = Object.keys(tokenMetadata);
    const list = userOptions;
    let filteredList: any[] = [];
    metadata_list.forEach((token: any) => {
      if (tokens[0].indexOf(token) !== -1) {
        filteredList = filteredList.concat(tokenMetadata[token]);
      }
    });
    list.forEach(item => {
      if (filteredList.indexOf(item.label) !== -1) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });
    setUserOptions([...list]);
  };

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

  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  function goToAnalytics(): void {
    if (fetchedTokens.length > 0) {
      const storedData = {
        tokens: fetchedTokens[0],
        metadata: tokenMetadata
      };
      localStorage.setItem('walletData', JSON.stringify(storedData));
      console.log("Navigation data:", storedData);
    }
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

          {showAddress && (
            <div className="my-4 flex justify-left items-left">
              <input
                type="text"
                className="input input-bordered w-full sm:w-96"
                placeholder="Enter wallet address"
                value={useraddress}
                onChange={e => setAddress(e.target.value)}
              />
              <button 
                className="btn ml-4" 
                onClick={() => handleSearch(useraddress)} 
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Search"}
              </button>
            </div>
          )}

          {userOptions.map((option: any, index) => (
            <button
              key={option.label}
              style={index === 0 ? { marginLeft: 0 } : {}}
              className={`btn ml-4 optionButton ${option.isSelected ? "selected" : ""}`}
              onClick={() => selectOption(option)}
              disabled={isLoading}
            >
              #{option.label}
            </button>
          ))}

          {topTokens.length > 0 && (
            <div className="mt-8 mb-6">
              <h3 className="text-2xl font-bold mb-4">Top 3 Holdings</h3>
              <div className="grid grid-cols-3 gap-6">
                {topTokens.map(([token, balance], index) => (
                  <div 
                    key={token} 
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-purple-600">#{index + 1}</span>
                      <div className="px-3 py-1 bg-purple-100 rounded-full">
                        <span className="text-sm text-purple-800">
                          {tokenMetadata[token]?.join(", ")}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{token}</h4>
                    <p className="text-gray-600">
                      Balance: <span className="font-medium">{balance}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", marginBottom: "1rem" }}>
            <button
              style={{ width: "300px", background: "#4848d4", color: "#ffffff" }}
              className={`btn ${userOptions.filter(option => option.isSelected).length === 0 ? "hide" : ""}`}
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