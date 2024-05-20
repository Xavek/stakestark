import React, { useState } from "react";

const TabComponent = () => {
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

  const handleWithdraw = () => {
    console.log(inputs);
    setInputs({ withdraw: "" });
  };

  const handleStake = () => {
    console.log(inputs);
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
