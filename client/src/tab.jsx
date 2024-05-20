import React, { useState } from "react";

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState("deposit");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="bg-slate-200 px-32 py-8 rounded-lg">
        <div className="flex justify-center px-8 mb-4">
          <button
            onClick={() => handleTabChange("deposit")}
            className="mr-2 px-8 py-2 bg-slate-500 text-white rounded"
          >
            Deposit
          </button>
          <button
            onClick={() => handleTabChange("withdraw")}
            className="px-8 py-2 bg-slate-500 text-white rounded"
          >
            Withdraw
          </button>
        </div>
        {activeTab === "deposit" && (
          <div>
            <h2>Deposit Amount</h2>
            <input
              type="text"
              placeholder="Enter deposit amount"
              className="border border-gray-400 p-2 rounded w-full"
            />
            <button className="bg-slate-500 text-white rounded px-4 py-2 mt-2">
              Deposit
            </button>
          </div>
        )}
        {activeTab === "withdraw" && (
          <div>
            <h2>Withdraw Amount</h2>
            <input
              type="text"
              placeholder="Enter withdrawal amount"
              className="border border-gray-400 p-2 rounded w-full"
            />
            <button className="bg-slate-500 text-white rounded px-4 py-2 mt-2">
              Withdraw
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
