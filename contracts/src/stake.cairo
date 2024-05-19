use starknet::ContractAddress;
#[starknet::interface]
pub trait IStake<TContractState> {
    fn stake_token(ref self: TContractState, amount: u256);
    fn withdraw_token(ref self: TContractState, amount: u256);
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
    use starknet::{
        get_contract_address, get_caller_address, get_block_timestamp,
        storage_access::StorageBaseAddress
    };

    #[storage]
    struct Storage {
        stake_token_address: ContractAddress,
        stake_info: LegacyMap::<ContractAddress, StakeInfo>
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
    fn constructor(ref self: ContractState, stake_token_stark_addrs: ContractAddress) {
        self.stake_token_address.write(stake_token_stark_addrs)
    }

    #[abi(embed_v0)]
    impl StakeImpl of IStake<ContractState> {
        fn stake_token(ref self: ContractState, amount: u256) {
            let current_amount = self
                ._check_stark_balance(self.stake_token_address.read(), get_caller_address());
            assert(current_amount > amount, 'ERROR');
            self
                ._stark_transfer(
                    self.stake_token_address.read(),
                    get_caller_address(),
                    get_contract_address(),
                    amount
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
            assert(stake_details.is_stake, 'ERROR');
            assert(get_block_timestamp() > stake_details.expiration_time, 'ERROR');
            self._handle_withdraw(stake_details, get_caller_address());
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
            amount: u256
        ) {
            let amount_u256: u256 = amount.into();
            let transfer_return_flag = IERC20Dispatcher { contract_address: stark_contract_address }
                .transferFrom(from, to, amount_u256);
            assert(transfer_return_flag, 'STARK_TRANSFER_FAIL');
        }

        fn calculate_time_cliff(ref self: ContractState, entry_timestamp: u64) -> u64 {
            let expirationTime: u64 = 48 * 3600;
            expirationTime + entry_timestamp
        }

        fn _handle_withdraw(
            ref self: ContractState, stake_details: StakeInfo, user_address: ContractAddress
        ) {
            let amount_u256: u256 = stake_details.withdraw_amount.into();
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
            self
                ._stark_transfer(
                    self.stake_token_address.read(),
                    get_contract_address(),
                    user_address,
                    amount_u256
                );
            self.emit(WithdrawStaked { staker: user_address, withdraw_amount: amount_u256 })
        }

        // todo for gradual release
        fn calculate_withdraw_amount(withdraw_amount: u256, initial_amount: u256) -> u256 {
            0
        }

        fn calculate_fee(amount: u256) -> u256 {
            0
        }
    }
}
