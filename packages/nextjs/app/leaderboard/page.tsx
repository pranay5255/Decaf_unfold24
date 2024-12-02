"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from "chart.js"; 

ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);// Register the scales

interface LeaderboardEntry {
  rank: number;
  name: string;
  address: string;
  activityScore: number;
}

const Debug: NextPage = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    // Fetch leaderboard data from an API or define it statically for now
    const fetchLeaderboardData = async () => {
      // Replace with your API call
      const data: LeaderboardEntry[] = [
        { rank: 1, name: "Pratik", address: "0x1e3...a5c", activityScore: 154 },
        { rank: 2, name: "Seetha", address: "0x232...d7f", activityScore: 142 },
        { rank: 3, name: "Pranay", address: "0xa6e...a52", activityScore: 135 },
        { rank: 4, name: "Arsh", address: "0xade...b23", activityScore: 122 },
        { rank: 5, name: "Ovi", address: "0xaze...e23", activityScore: 117 },
        { rank: 6, name: "Nidhi", address: "0x255...a42", activityScore: 114 },
      ];
      setEntries(data);
    };

    fetchLeaderboardData();
  }, []);

  const handleAddWallet = () => {
    if (walletAddress) {
      const newEntry: LeaderboardEntry = {
        rank: entries.length + 1,
        name: "New User",
        address: walletAddress,
        activityScore: Math.floor(Math.random() * 1000), // Dummy activity score
      };
      setEntries([...entries, newEntry]);
      setWalletAddress("");
    }
  };


  return (
    <div className="container mx-auto my-10 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="input input-bordered w-full sm:w-96"
          placeholder="Enter wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <button className="btn ml-4" onClick={handleAddWallet}>
          Add Wallet
        </button>
      </div>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Rank</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Wallet Address</th>
            <th className="px-4 py-2 border">Activity Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.rank} className="hover:bg-gray-100">
              <td className="border px-4 py-2 text-center">{entry.rank}</td>
              <td className="border px-4 py-2 text-center">{entry.name}</td>
              <td className="border px-4 py-2 text-center">{entry.address}</td>
              <td className="border px-4 py-2 text-center">{entry.activityScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Debug;
