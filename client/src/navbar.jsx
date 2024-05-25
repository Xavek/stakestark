import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useState } from "react";
import { sliceAddressForView } from "./lib/utils";
import { getStakedStarkAmount } from "./lib/stakeApi";
import { stakeManagerInstance } from "./lib/stakeManager";
import { ethers } from "ethers";

const Navbar = () => {
  const { connect, connectors } = useConnect();
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();
  const [balance, setBalance] = useState("0");

  async function fetchStakeBalance() {
    if (status === "connected") {
      try {
        const stakeBalance = await getStakedStarkAmount(
          stakeManagerInstance,
          address,
        );
        setBalance(ethers.formatEther(stakeBalance));
      } catch (error) {
        setBalance("0");
        console.log(error);
      }
    } else {
      setBalance("0");
    }
  }
  return (
    <>
      <nav className="bg-black p-4 flex justify-between">
        <div className="flex items-center">
          <span className="text-white text-xl font-bold">StakeStark</span>
        </div>
        <div className="flex items-center ">
          <button
            className="bg-white text-black px-6 py-2 mx-2 rounded-md"
            onClick={fetchStakeBalance}
          >
            Balance: {balance}
          </button>
          <ul className="flex items-start">
            {status === "disconnected" &&
              connectors.map((connector) => (
                <li key={connector.id}>
                  <button
                    onClick={() => connect({ connector })}
                    className="bg-white text-black px-6 py-2 mx-2 rounded-md"
                  >
                    Connect To {connector.id}
                  </button>
                </li>
              ))}

            {status === "connected" && (
              <button
                className="bg-white text-black px-6 py-2 mx-2 rounded-md"
                onClick={() => disconnect()}
              >
                {sliceAddressForView(address)}
              </button>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
