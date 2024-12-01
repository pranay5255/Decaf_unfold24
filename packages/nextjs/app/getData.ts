import { getTokenBalanceOfAdress } from "./getTokenBalanceOfAdress";
import fs from "fs";

interface MonthlyData {
  month: string;
  value: number;
}

interface ChainMetrics {
  monthlyTVL: MonthlyData[];
  monthlyFees: MonthlyData[];
  monthlyVolume?: MonthlyData[];
}

interface ChainDataResponse {
  [chainName: string]: ChainMetrics;
}

interface WalletTokensResponse {
  walletTokens: string[];
  defiLlamaData: ChainDataResponse;
}

interface TokenBalanceResponse {
  tokens: string[];
}

const DEFAULT_CHAINS = ["ethereum", "polygon", "arbitrum", "optimism"];

export const getChainMetrics = async (chains: string[]): Promise<ChainDataResponse> => {
  const chainsToFetch = chains.length > 0 ? chains : DEFAULT_CHAINS;
  const data: ChainDataResponse = {};

  // Generate monthly timestamps for 2024
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return {
      start: Math.floor(date.getTime() / 1000),
      end: Math.floor(new Date(2024, i + 1, 0).getTime() / 1000),
      name: date.toLocaleString("default", { month: "short" }),
    };
  });

  for (const chain of chainsToFetch) {
    const slug = chain.toLowerCase();
    data[chain] = {
      monthlyTVL: [],
      monthlyFees: [],
      monthlyVolume: [],
    };

    try {
      await Promise.all(
        months.map(async month => {
          // Fetch TVL data
          const tvlUrl = `https://api.llama.fi/v2/historicalChainTvl/${slug}?start=${month.start}&end=${month.end}`;
          const tvlResponse = await fetch(tvlUrl);
          if (tvlResponse.ok) {
            const tvlData = await tvlResponse.json();
            const avgTVL = tvlData.reduce((sum: number, day: any) => sum + (day.tvl || 0), 0) / tvlData.length;
            data[chain].monthlyTVL.push({
              month: month.name,
              value: Math.round(avgTVL),
            });
          }

          // Fetch fees data using the correct endpoint
          const feesUrl = `https://api.llama.fi/summary/fees/${slug}?start=${month.start}&end=${month.end}`;
          const feesResponse = await fetch(feesUrl);
          if (feesResponse.ok) {
            const feesData = await feesResponse.json();
            const totalFees = feesData.total24h || 0; // Use total24h instead of totalFees
            data[chain].monthlyFees.push({
              month: month.name,
              value: Math.round(totalFees),
            });
          }
        }),
      );
    } catch (error) {
      console.error(`Error fetching data for ${chain}:`, error);
    }
  }

  // If no data was fetched, retry with default chains
  const hasData = Object.values(data).some(
    chainData => chainData.monthlyTVL.length > 0 || chainData.monthlyFees.length > 0,
  );

  if (!hasData && chains.length > 0) {
    return getChainMetrics(DEFAULT_CHAINS);
  }

  return data;
};

export const getWalletTokensData = async (
  ethWalletAddress: string,
  setError: (error: string) => void,
  isValidAddress: (addr: string) => boolean,
): Promise<WalletTokensResponse | null> => {
  try {
    // Get tokens from wallet
    const walletTokens = (await getTokenBalanceOfAdress(
      ethWalletAddress,
      setError,
      isValidAddress,
    )) as TokenBalanceResponse;

    // Get chain metrics data
    const chainData = await getChainMetrics(walletTokens?.tokens || []);

    return {
      walletTokens: walletTokens?.tokens || [],
      defiLlamaData: chainData,
    };
  } catch (error) {
    console.error("Error in getWalletTokensData:", error);
    setError("Failed to fetch wallet and chain data");
    return null;
  }
};

// Call functions and save data
const testAddress = "0x84EF8207d6F6F87eEf140eca31ca809c78b20Bf8";

const saveDataToJson = async () => {
  try {
    // Get wallet data
    const walletData = await getWalletTokensData(
      testAddress,
      (error: string) => console.error("Error:", error),
      (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr),
    );

    // Save wallet data
    if (walletData) {
      fs.writeFileSync("wallet-data.json", JSON.stringify(walletData, null, 2));
      console.log("Wallet data saved to wallet-data.json");
    }

    // Get and save default chains data
    const chainData = await getChainMetrics(DEFAULT_CHAINS);
    fs.writeFileSync("chain-metrics.json", JSON.stringify(chainData, null, 2));
    console.log("Chain metrics saved to chain-metrics.json");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

saveDataToJson();
