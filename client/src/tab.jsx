import React, { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { withdrawAmount, stakeAmount, doERC20Approve } from "./lib/stakeApi";
import { stakeManagerInstance } from "./lib/stakeManager";
import { ethers } from "ethers";
import { DEPLOYED_CONTRACT_ADDRESS, STRK_ADDRESS } from "./lib/utils";

const TabComponent = () => {
  const { account, status } = useAccount();
  const [activeTab, setActiveTab] = useState("stake");
  const [inputs, setInputs] = useState({
    stake: "",
    withdraw: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleWithdraw = async () => {
    if (status === "disconnected") {
      alert(`Wallet Not Connected. Connect First`);
      throw Error("Wallet Not Connected");
    }

    await withdrawAmount(
      stakeManagerInstance,
      account,
      ethers.parseEther(inputs.withdraw),
    );
    setInputs({ withdraw: "" });
  };

  const handleStake = async () => {
    if (status === "disconnected") {
      alert(`Wallet Not Connected. Connect First`);
      throw Error("Wallet Not Connected");
    }

    await doERC20Approve(
      stakeManagerInstance,
      account,
      ethers.parseEther(inputs.stake),
      STRK_ADDRESS,
      DEPLOYED_CONTRACT_ADDRESS,
    );
    await stakeAmount(
      stakeManagerInstance,
      account,
      ethers.parseEther(inputs.stake),
    );
    setInputs({ stake: "" });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="px-32 py-8 rounded-lg">
        <div className="flex justify-center px-8 mb-4">
          <button
            onClick={() => handleTabChange("stake")}
            className="mr-2 px-8 py-2 bg-black text-white rounded"
          >
            Stake
          </button>
          <button
            onClick={() => handleTabChange("withdraw")}
            className="ml-2 px-8 py-2 bg-black text-white rounded"
          >
            Withdraw
          </button>
        </div>
        {activeTab === "stake" && (
          <div>
            <h2>Stake Amount</h2>
            <input
              type="text"
              id="stake"
              name="stake"
              placeholder="Enter stake amount"
              onChange={handleInputChange}
              value={inputs.stake}
              className="border border-gray-400 p-2 rounded w-full"
            />
            <button
              className="bg-slate-500 text-white rounded w-full px-4 py-2 mt-2"
              onClick={handleStake}
            >
              Stake
            </button>
          </div>
        )}
        {activeTab === "withdraw" && (
          <div>
            <h2>Withdraw Amount</h2>
            <input
              type="text"
              id="withdraw"
              name="withdraw"
              placeholder="Enter withdraw amount"
              onChange={handleInputChange}
              value={inputs.withdraw}
              className="border border-gray-400 p-2 rounded w-full"
            />
            <button
              className="bg-slate-500 text-white rounded w-full px-4 py-2 mt-2"
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
