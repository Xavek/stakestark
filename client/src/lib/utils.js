// Constant
// free rpc from nethermind no api key needed
export const NODE_URL_API = "https://free-rpc.nethermind.io/sepolia-juno";

export const DEPLOYED_CONTRACT_ADDRESS =
  "0x05ce9ccbbfdd7811d7c5e4b88e420f7a13c53774e244052dc5256df4b73b2502";
export const STRK_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

// utils
export const sliceAddressForView = (addrs) => {
  return `${addrs.slice(0, 6)}...${addrs.slice(-6)}`;
};
