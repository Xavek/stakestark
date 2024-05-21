import { RpcProvider, Contract } from "starknet";
import { DEPLOYED_CONTRACT_ADDRESS, NODE_URL_API } from "./utils";

class StakeManager {
  constructor(nodeUrl, deployedAddress) {
    (this.nodeUrl = nodeUrl), (this.deployedAddress = deployedAddress);
  }

  getProviderInstance() {
    return new RpcProvider({ nodeUrl: this.nodeUrl });
  }

  async getContractAbi() {
    const abi = await this.getProviderInstance().getClassAt(
      this.deployedAddress,
    );
    if (abi === undefined) {
      throw new Error("no abi");
    }

    return abi.abi;
  }

  async getContractWriteInstance(account) {
    const contractInstance = new Contract(
      await this.getContractAbi(),
      this.deployedAddress,
      this.getProviderInstance(),
    );
    contractInstance.connect(account);
    return contractInstance;
  }

  async getContractReadInstance() {
    const contractReadInstance = new Contract(
      await this.getContractAbi(),
      this.deployedAddress,
      this.getProviderInstance(),
    );
    return contractReadInstance;
  }

  async invokeContractFunction(account, functionName, contractCallData) {
    const contractWriteInstance = this.getContractWriteInstance(account);
    const response = (await contractWriteInstance).invoke(
      functionName,
      contractCallData,
    );
    await this.getProviderInstance().waitForTransaction(
      (await response).transaction_hash,
    );
    return (await response).transaction_hash;
  }

  async readContractFunction(functionName, contractCallData) {
    const contractReadInstance = this.getContractReadInstance();
    return (await contractReadInstance).call(functionName, contractCallData, {
      parseResponse: true,
    });
  }
}

export const stakeManagerInstance = new StakeManager(
  NODE_URL_API,
  DEPLOYED_CONTRACT_ADDRESS,
);
