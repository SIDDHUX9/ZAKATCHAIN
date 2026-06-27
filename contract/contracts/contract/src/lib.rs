#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
pub enum DataKey {
    DonorTotal(Address),
    TotalDistributed,
    DonorCount,
    Donors,
    Beneficiaries,
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn init(env: Env) {
        env.storage().instance().set(&DataKey::TotalDistributed, &0i128);
        env.storage().instance().set(&DataKey::DonorCount, &0u64);
        env.storage().instance().set(&DataKey::Donors, &Vec::<Address>::new(&env));
        env.storage().instance().set(&DataKey::Beneficiaries, &0u64);
    }

    pub fn record_distribution(
        env: Env,
        donor: Address,
        total_amount: i128,
        _beneficiaries: String,
        tx_hash: String,
    ) {
        donor.require_auth();

        let mut donor_total: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::DonorTotal(donor.clone()))
            .unwrap_or(0);
        donor_total += total_amount;
        env.storage()
            .persistent()
            .set(&DataKey::DonorTotal(donor.clone()), &donor_total);

        let mut total: i128 = env.storage().instance().get(&DataKey::TotalDistributed).unwrap_or(0);
        total += total_amount;
        env.storage().instance().set(&DataKey::TotalDistributed, &total);

        let mut donors: Vec<Address> = env.storage().instance().get(&DataKey::Donors).unwrap_or(Vec::new(&env));
        if !donors.contains(&donor) {
            donors.push_back(donor.clone());
            env.storage().instance().set(&DataKey::Donors, &donors);
            let mut count: u64 = env.storage().instance().get(&DataKey::DonorCount).unwrap_or(0);
            count += 1;
            env.storage().instance().set(&DataKey::DonorCount, &count);
        }

        let mut beneficiary_count: u64 = env.storage().instance().get(&DataKey::Beneficiaries).unwrap_or(0);
        beneficiary_count += 1;
        env.storage().instance().set(&DataKey::Beneficiaries, &beneficiary_count);

        #[allow(deprecated)]
        env.events().publish(
            ("distribution", donor.clone()),
            (total_amount, tx_hash),
        );
    }

    pub fn get_donor_total(env: Env, donor: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::DonorTotal(donor))
            .unwrap_or(0)
    }

    pub fn get_total_distributed(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalDistributed)
            .unwrap_or(0)
    }

    pub fn get_donor_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::DonorCount)
            .unwrap_or(0)
    }

    pub fn get_beneficiary_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::Beneficiaries)
            .unwrap_or(0)
    }
}

mod test;
