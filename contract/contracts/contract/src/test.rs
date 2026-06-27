#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_init() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    client.init();
    assert_eq!(client.get_total_distributed(), 0);
    assert_eq!(client.get_donor_count(), 0);
    assert_eq!(client.get_beneficiary_count(), 0);
}

#[test]
fn test_record_distribution() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let donor = Address::generate(&env);

    client.init();
    client.record_distribution(
        &donor,
        &1000i128,
        &String::from_str(&env, "The Poor, The Needy"),
        &String::from_str(&env, "tx_hash_1"),
    );

    assert_eq!(client.get_total_distributed(), 1000);
    assert_eq!(client.get_donor_count(), 1);
    assert_eq!(client.get_beneficiary_count(), 1);
    assert_eq!(client.get_donor_total(&donor), 1000);

    client.record_distribution(
        &donor,
        &2500i128,
        &String::from_str(&env, "Wayfarers"),
        &String::from_str(&env, "tx_hash_2"),
    );

    assert_eq!(client.get_total_distributed(), 3500);
    assert_eq!(client.get_donor_count(), 1);
    assert_eq!(client.get_beneficiary_count(), 2);
    assert_eq!(client.get_donor_total(&donor), 3500);
}

#[test]
fn test_multiple_donors() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let donor1 = Address::generate(&env);
    let donor2 = Address::generate(&env);

    client.init();
    client.record_distribution(
        &donor1,
        &5000i128,
        &String::from_str(&env, "The Poor"),
        &String::from_str(&env, "tx_1"),
    );
    client.record_distribution(
        &donor2,
        &3000i128,
        &String::from_str(&env, "The Needy"),
        &String::from_str(&env, "tx_2"),
    );

    assert_eq!(client.get_total_distributed(), 8000);
    assert_eq!(client.get_donor_count(), 2);
    assert_eq!(client.get_donor_total(&donor1), 5000);
    assert_eq!(client.get_donor_total(&donor2), 3000);
}

#[test]
fn test_zero_values() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let donor = Address::generate(&env);

    client.init();
    assert_eq!(client.get_donor_total(&donor), 0);
    assert_eq!(client.get_total_distributed(), 0);
    assert_eq!(client.get_donor_count(), 0);
}
