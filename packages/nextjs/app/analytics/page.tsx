import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Debug: NextPage = () => {
  return (
    <>
      <div className="flex flex-grow w-4/5 pt-8 mx-auto">
        <div className="w-1/2"> {/* First div (50% width) */}</div>
        <div className="w-1/2"> {/* Second div (50% width) */}</div>
      </div>
    </>
  );
};

export default Debug;
