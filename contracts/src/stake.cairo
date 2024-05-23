use starknet::ContractAddress;
#[starknet::interface]
pub trait IStake<TContractState> {
    fn stake_token(ref self: TContractState, amount: u256);
    fn withdraw_token(ref self: TContractState, amount: u256);
    fn stake_balanceOf(self: @TContractState, address: ContractAddress) -> u256;
}

#[starknet::interface]
pub trait IERC20<TContractState> {
    fn balanceOf(self: @TContractState, account: ContractAddress) -> u256;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn transferFrom(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
}

#[starknet::contract]
pub mod Stake {
    use core::starknet::event::EventEmitter;
    use super::{IStake, ContractAddress, IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::{
        get_contract_address, get_caller_address, get_block_timestamp,
        storage_access::StorageBaseAddress
    };

    #[storage]
    struct Storage {
        stake_token_address: ContractAddress,
        stake_info: LegacyMap::<ContractAddress, StakeInfo>,
        stake_time_in_hrs: u64
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct StakeInfo {
        amount: u256,
        entry_time: u64,
        is_stake: bool,
        withdraw_amount: u256,
        expiration_time: u64
    }

    #[derive(starknet::Event, Drop)]
    pub struct Staked {
        staker: ContractAddress,
        staked_amount: u256
    }

    #[derive(starknet::Event, Drop)]
    pub struct WithdrawStaked {
        staker: ContractAddress,
        withdraw_amount: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Staked: Staked,
        WithdrawStaked: WithdrawStaked
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, stake_token_stark_addrs: ContractAddress, stake_cliff_in_hrs: u64
    ) {
        self.stake_token_address.write(stake_token_stark_addrs);
        self.stake_time_in_hrs.write(stake_cliff_in_hrs)
    }

    #[abi(embed_v0)]
    impl StakeImpl of IStake<ContractState> {
        fn stake_token(ref self: ContractState, amount: u256) {
            let current_amount = self
                ._check_stark_balance(self.stake_token_address.read(), get_caller_address());
            assert(current_amount > amount, 'ERROR_INSUFFICIENT_FUNDS');
            self
                ._stark_transfer(
                    self.stake_token_address.read(),
                    get_caller_address(),
                    get_contract_address(),
                    amount,
                    false
                );

            let timestamp: u64 = get_block_timestamp();
            let expiration_time: u64 = self.calculate_time_cliff(timestamp);
            self
                .stake_info
                .write(
                    get_caller_address(),
                    StakeInfo {
                        amount: amount,
                        entry_time: timestamp,
                        is_stake: true,
                        withdraw_amount: amount,
                        expiration_time: expiration_time
                    }
                );
            self.emit(Staked { staker: get_caller_address(), staked_amount: amount });
        }

        fn withdraw_token(ref self: ContractState, amount: u256) {
            let stake_details: StakeInfo = self.stake_info.read(get_caller_address());
            assert(stake_details.is_stake, 'ERROR_NOT_STAKED');
            assert(get_block_timestamp() > stake_details.expiration_time, 'ERROR_EARLY');
            assert(stake_details.withdraw_amount >= amount, 'ERROR_INVALID_WITHDRAW_AMOUNT');
            self._handle_withdraw(stake_details, get_caller_address(), amount);
        }

        fn stake_balanceOf(self: @ContractState, address: ContractAddress) -> u256 {
            let stake_details: StakeInfo = self.stake_info.read(address);
            assert(stake_details.is_stake, 'ERROR_NOT_STAKED');
            stake_details.withdraw_amount
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _check_stark_balance(
            ref self: ContractState,
            stark_contract_address: ContractAddress,
            user_address: ContractAddress
        ) -> u256 {
            let balance: u256 = IERC20Dispatcher { contract_address: stark_contract_address }
                .balanceOf(user_address);
            balance
        }

        fn _stark_transfer(
            ref self: ContractState,
            stark_contract_address: ContractAddress,
            from: ContractAddress,
            to: ContractAddress,
            amount: u256,
            is_withdraw: bool
        ) {
            if (is_withdraw) {
                let amount_u256: u256 = amount.into();
                let transfer_flag = IERC20Dispatcher { contract_address: stark_contract_address }
                    .transfer(to, amount_u256);
                assert(transfer_flag, 'STARK_TO_TRANSFER_FAIL');
            } else {
                let amount_u256: u256 = amount.into();
                let transfer_return_flag = IERC20Dispatcher {
                    contract_address: stark_contract_address
                }
                    .transferFrom(from, to, amount_u256);
                assert(transfer_return_flag, 'STARK_TRANSFER_FAIL');
            }
        }

        fn calculate_time_cliff(ref self: ContractState, entry_timestamp: u64) -> u64 {
            let expirationTime: u64 = self.stake_time_in_hrs.read() * 3600;
            expirationTime + entry_timestamp
        }

        fn _handle_withdraw(
            ref self: ContractState,
            stake_details: StakeInfo,
            user_address: ContractAddress,
            amount: u256
        ) {
            let mut amount_u256: u256 = 0;
            if (amount == stake_details.withdraw_amount) {
                self
                    .stake_info
                    .write(
                        user_address,
                        StakeInfo {
                            amount: 0,
                            entry_time: 0,
                            is_stake: false,
                            withdraw_amount: 0,
                            expiration_time: 0
                        }
                    );
                amount_u256 = stake_details.withdraw_amount;
            } else {
                self
                    .stake_info
                    .write(
                        user_address,
                        StakeInfo {
                            amount: stake_details.amount,
                            entry_time: stake_details.entry_time,
                            is_stake: true,
                            withdraw_amount: stake_details.withdraw_amount - amount,
                            expiration_time: self.calculate_time_cliff(get_block_timestamp())
                        }
                    );
                amount_u256 = stake_details.withdraw_amount - amount;
            }

            self
                ._stark_transfer(
                    self.stake_token_address.read(),
                    get_contract_address(),
                    user_address,
                    amount_u256,
                    true
                );
            self.emit(WithdrawStaked { staker: user_address, withdraw_amount: amount_u256 });
        }
    }
}
