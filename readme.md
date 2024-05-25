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

#### Deployed Address(Sepolia): 0x04d0764423f662fd912b48f5d70d808904fb1da137418d615a978deb3505fdf2
