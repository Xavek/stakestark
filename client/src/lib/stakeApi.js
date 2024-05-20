export const stakeAmount = async (StakeManagerInstance, account, amount) => {
  const contractInvokeData = [amount];
  const contractResponse = await StakeManagerInstance.invokeContractFunction(
    account,
    "stake_token",
    contractInvokeData,
  );
  console.log(contractResponse);
};

export const withdrawAmount = async (StakeManagerInstance, account, amount) => {
  const contractInvokeData = [amount];
  const contractResponse = await StakeManagerInstance.invokeContractFunction(
    account,
    "withdraw_token",
    contractInvokeData,
  );
  console.log(contractResponse);
};

export const getStakedStarkAmount = async (StakeManagerInstance, address) => {
  const contractQueryData = [address];
  const contractResponse = StakeManagerInstance.readContractFunction(
    "stake_balanceOf",
    contractQueryData,
  );
  return contractResponse;
};
