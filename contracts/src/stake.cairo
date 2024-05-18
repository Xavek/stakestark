use starknet::ContractAddress;
#[starknet::interface]
pub trait IStake<TContractState> {
    fn stake_token(ref self: TContractState, amount: u256) -> bool;
}

#[starknet::interface]
pub trait IERC20<TContractState> {
    fn balanceOf(self: @TContractState, account: ContractAddress) -> u256;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn transferFrom(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
}


#[starknet::contract]
pub mod Stake {
    use super::{IStake, ContractAddress, IERC20Dispatcher, IERC20DispatcherTrait};

    #[storage]
    struct Storage {
        stake_token_address: ContractAddress
    }

    #[constructor]
    fn constructor(ref self: ContractState, stake_token_stark_addrs: ContractAddress) {
        self.stake_token_address.write(stake_token_stark_addrs)
    }

    #[abi(embed_v0)]
    impl StakeImpl of IStake<ContractState> {
        fn stake_token(ref self: ContractState, amount: u256) -> bool {
            true
        }
    }
}
