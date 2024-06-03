# StakeStark

Simple stake contracts that take STRK tokens can be withdrawn after hours, all at once or partially. This repo consists of UI part and `contracts` written in `Cairo` to be deployed on `starknet`

# Repo Navigation

## Contracts

Requires [Scarb](https://docs.swmansion.com/scarb/download.html) on machine.

- Clone the repo
- `cd stakestark`
- `cd contracts`
  - Inside `src` folder there is `stake.cairo` and `lib.cairo`
  - Optional: Edit, change few things, try to add new methods
- `scarb build` to test the build

## Client

Requires [pnpm](https://pnpm.io/installation) on machine.

- `cd stakestark`
- `cd client`
- `pnpm install`
- `pnpm dev` and visit the relevant local host for interaction
  - Edit the `utils.js` with your deployed address to interact with your contract

Contract Address(Sepolia): 0x05ce9ccbbfdd7811d7c5e4b88e420f7a13c53774e244052dc5256df4b73b2502 or [Contract](https://sepolia.starkscan.co/contract/0x05ce9ccbbfdd7811d7c5e4b88e420f7a13c53774e244052dc5256df4b73b2502#overview)
