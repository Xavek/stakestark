// Constant
// free rpc from nethermind no api key needed
export const NODE_URL_API = "https://free-rpc.nethermind.io/sepolia-juno";

export const DEPLOYED_CONTRACT_ADDRESS =
  "0x04d0764423f662fd912b48f5d70d808904fb1da137418d615a978deb3505fdf2";
export const STRK_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

// utils
export const sliceAddressForView = (addrs) => {
  return `${addrs.slice(0, 6)}...${addrs.slice(-6)}`;
};
