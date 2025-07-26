use borsh::{BorshDeserialize,BorshSerialize};
use solana_program::{
    account_info::{next_account_info,AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    entrypoint
};

#[derive(BorshDeserialize,BorshSerialize)]
enum IntructionType {
    Increment(u32),
    Decrement(u32)
}

#[derive(BorshDeserialize,BorshSerialize)]
struct Counter {
    count: u32
}

entrypoint!(counter_contract);
pub fn counter_contract(
    _program_id: &Pubkey, // Pub key of contract
    accounts: &[AccountInfo], // Array of accounts we are interacting with
    instruction_data: &[u8] // 
) -> ProgramResult {
    let acc = next_account_info(&mut accounts.iter())?;
    let instruction_type = IntructionType::try_from_slice(instruction_data)?;
    let mut counter_data = Counter::try_from_slice(&acc.data.borrow())?;
    match instruction_type {
        IntructionType::Increment(value) => {
            counter_data.count += value;
        },
        IntructionType::Decrement(value) => {
            counter_data.count -= value;
        }
    }
    let final_data = counter_data.serialize(&mut *acc.data.borrow_mut());
    match final_data {
        Ok(_) => {msg!("Contract succeded"); },
        Err(_) => {msg!("Contract failed")}
    }
    Ok({})
}

// Program ID-->
// 5zCoUANRHokBagRiqmfYytrKisTNtNtzV8cVSDxZqsnE