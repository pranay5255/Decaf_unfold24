export const getTokenBalanceOfAdress = async (
  ethWalletAddress: string,
  setError: (error: string) => void,
  isValidAddress: (addr: string) => boolean,
) => {
  if (!ethWalletAddress || !isValidAddress(ethWalletAddress)) {
    setError("Please enter a valid Ethereum address.");
    return;
  }

  const moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;

  try {
    const response = await fetch(`https://deep-index.moralis.io/api/v2/${ethWalletAddress}/erc20`, {
      headers: {
        "X-API-Key": moralisApiKey || "",
      },
    });
    const data = await response.json();

    if (response.ok) {
      // Extract unique token names and format as JSON
      const uniqueTokenNames = [...new Set(data.map((token: any) => token.name))];
      const formattedResponse = { tokens: uniqueTokenNames };

      console.log("Token Names:", formattedResponse);
      return formattedResponse;
    } else {
      setError(data.message || "No token balances found or an error occurred.");
      return { tokens: [] };
    }
  } catch (err) {
    console.error("Error fetching token balances:", err);
    setError("Error fetching token balances.");
    return { tokens: [] };
  }
};

// Call the function at the end
// handleSearch("0x6FEB9b158262aAc3e01549692fd3723A7d29c93E", console.error, addr => /^0x[a-fA-F0-9]{40}$/.test(addr));
