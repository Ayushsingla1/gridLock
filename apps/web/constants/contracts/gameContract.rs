#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Env, String, Vec,
};

#[contract]
pub struct XBetContract;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    GameExists = 1,
    NoSuchGame = 2,
    GameFinished = 3,
    InvalidBet = 4,
    InvalidResult = 5,
    InsufficientAmount = 6,
    NotFinished = 7,
    NoWinnings = 8,
    NoTotalWinningShares = 9,
    Unauthorized = 10,
    InvalidShares = 11,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Bet {
    pub yes_shares: u128,
    pub no_shares: u128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Game {
    pub game_id: String,
    pub finished: bool,
    pub winner: u32, // 0 = no, 1 = yes, 2 = not set
    pub yes_shares: u128,
    pub no_shares: u128,
    pub total_pool: i128,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Owner,
    UsdContract,
    Game(String),
    Bet(String, Address), // (game_id, user)
    Stakers(String),      // game_id -> Vec<Address>
}

const B: i128 = 100_000_000;
const PRECISION: i128 = 100_000_000;

#[contractimpl]
impl XBetContract {
    pub fn initialize(env: Env, owner: Address, usd_contract: Address) {
        if env.storage().instance().has(&DataKey::Owner) {
            panic!("Already initialized");
        }

        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage()
            .instance()
            .set(&DataKey::UsdContract, &usd_contract);
    }

    fn get_owner(env: &Env) -> Address {
        env.storage().instance().get(&DataKey::Owner).unwrap()
    }

    fn require_owner(env: &Env, caller: &Address) {
        caller.require_auth();
        let owner = Self::get_owner(env);
        if caller != &owner {
            panic!("Unauthorized");
        }
    }

    pub fn create_game(env: Env, owner: Address, game_id: String) -> Result<(), Error> {
        Self::require_owner(&env, &owner);

        let game_key = DataKey::Game(game_id.clone());

        if env.storage().persistent().has(&game_key) {
            return Err(Error::GameExists);
        }

        let game = Game {
            game_id: game_id.clone(),
            finished: false,
            winner: 2,
            yes_shares: 0,
            no_shares: 0,
            total_pool: 0,
        };

        env.storage().persistent().set(&game_key, &game);

        let stakers_key = DataKey::Stakers(game_id.clone());
        let stakers: Vec<Address> = Vec::new(&env);
        env.storage().persistent().set(&stakers_key, &stakers);

        env.events()
            .publish((String::from_str(&env, "GameCreated"),), game_id);

        Ok(())
    }

    fn calculate_cost(yes_shares: u128, no_shares: u128) -> u128 {
        let y = yes_shares as i128;
        let n = no_shares as i128;

        let y_over_b = (y * PRECISION) / B;
        let n_over_b = (n * PRECISION) / B;

        let exp_y = Self::exp_fixed(y_over_b);
        let exp_n = Self::exp_fixed(n_over_b);
        let sum_exp = exp_y + exp_n;

        let ln_sum = Self::ln_fixed(sum_exp);
        let cost = (B * ln_sum) / PRECISION;

        cost as u128
    }

    fn exp_fixed(x: i128) -> i128 {
        if x == 0 {
            return PRECISION;
        }

        if x > 10 * PRECISION || x < -10 * PRECISION {
            let half = Self::exp_fixed(x / 2);
            return (half * half) / PRECISION;
        }

        let mut result = PRECISION;
        let mut term = PRECISION;
        let mut factorial = 1i128;

        for i in 1..=10 {
            term = (term * x) / PRECISION;
            factorial *= i;
            let term_divided = term / factorial;
            result += term_divided;

            if term_divided.abs() < 100 {
                break;
            }
        }

        result
    }

    fn ln_fixed(x: i128) -> i128 {
        if x <= 0 {
            return -100 * PRECISION;
        }
        if x == PRECISION {
            return 0; // ln(1) = 0
        }

        // For x > 2, use ln(x) = ln(x/e) + 1, recursively
        if x > 2 * PRECISION {
            let e_approx = 271828182; // e ≈ 2.71828182 (scaled by 1e8)
            return Self::ln_fixed((x * PRECISION) / e_approx) + PRECISION;
        }

        // For x < 0.5, use ln(x) = -ln(1/x)
        if x < PRECISION / 2 {
            return -Self::ln_fixed((PRECISION * PRECISION) / x);
        }

        // Calculate z = (x - 1) / (x + 1)
        let numerator = x - PRECISION;
        let denominator = x + PRECISION;
        let z = (numerator * PRECISION) / denominator;

        let mut result = 0i128;
        let mut z_power = z;
        let z_squared = (z * z) / PRECISION;

        // Calculate series: 2 * (z + z^3/3 + z^5/5 + z^7/7 + ...)
        for i in 0..10 {
            let term = z_power / (2 * i + 1);
            result += term;
            z_power = (z_power * z_squared) / PRECISION;

            // Early exit if term becomes negligible
            if term.abs() < 100 {
                break;
            }
        }

        2 * result
    }

    /// Calculate delta cost for buying shares
    fn calculate_delta_cost(
        yes_shares: u128,
        no_shares: u128,
        buy_yes: bool,
        shares_to_buy: u128,
    ) -> u128 {
        let c0 = Self::calculate_cost(yes_shares, no_shares);
        let c1 = if buy_yes {
            Self::calculate_cost(yes_shares + shares_to_buy, no_shares)
        } else {
            Self::calculate_cost(yes_shares, no_shares + shares_to_buy)
        };

        if c1 > c0 {
            c1 - c0
        } else {
            0
        }
    }

    /// Get the amount needed to buy shares
    pub fn get_amount(env: Env, game_id: String, bet: u32, shares: u128) -> Result<u128, Error> {
        if bet > 1 {
            return Err(Error::InvalidBet);
        }

        let game_key = DataKey::Game(game_id);
        let game: Game = env
            .storage()
            .persistent()
            .get(&game_key)
            .ok_or(Error::NoSuchGame)?;

        let buy_yes = bet == 1;
        let price = Self::calculate_delta_cost(game.yes_shares, game.no_shares, buy_yes, shares);

        // Price is already in token units with 8 decimals
        Ok(price)
    }

    /// Ensure staker is in the stakers list
    fn ensure_staker(env: &Env, game_id: &String, staker: &Address) {
        let bet_key = DataKey::Bet(game_id.clone(), staker.clone());

        if !env.storage().persistent().has(&bet_key) {
            // Add to stakers list
            let stakers_key = DataKey::Stakers(game_id.clone());
            let mut stakers: Vec<Address> = env
                .storage()
                .persistent()
                .get(&stakers_key)
                .unwrap_or(Vec::new(env));

            stakers.push_back(staker.clone());
            env.storage().persistent().set(&stakers_key, &stakers);
        }
    }

    /// Stake an amount on a bet
    pub fn stake_amount(
        env: Env,
        staker: Address,
        game_id: String,
        shares: u128,
        bet: u32,
        amount: i128,
    ) -> Result<(u128, i128, i128), Error> {
        staker.require_auth();

        if amount <= 0 {
            return Err(Error::InsufficientAmount);
        }
        if shares == 0 {
            return Err(Error::InvalidShares);
        }
        if bet > 1 {
            return Err(Error::InvalidBet);
        }

        let game_key = DataKey::Game(game_id.clone());
        let mut game: Game = env
            .storage()
            .persistent()
            .get(&game_key)
            .ok_or(Error::NoSuchGame)?;

        if game.finished {
            return Err(Error::GameFinished);
        }

        let buy_yes = bet == 1;
        let price = Self::calculate_delta_cost(game.yes_shares, game.no_shares, buy_yes, shares);
        let token_amount = price as i128; // Price is already in token units with 8 decimals

        if amount < token_amount {
            return Err(Error::InsufficientAmount);
        }

        // Get USD token contract
        let usd_contract: Address = env.storage().instance().get(&DataKey::UsdContract).unwrap();

        let token_client = token::Client::new(&env, &usd_contract);

        // Transfer tokens from staker to contract
        token_client.transfer(&staker, &env.current_contract_address(), &token_amount);

        // Update or create bet
        let bet_key = DataKey::Bet(game_id.clone(), staker.clone());
        let mut user_bet = env.storage().persistent().get(&bet_key).unwrap_or(Bet {
            yes_shares: 0,
            no_shares: 0,
        });

        Self::ensure_staker(&env, &game_id, &staker);

        game.total_pool += token_amount;

        if buy_yes {
            game.yes_shares += shares;
            user_bet.yes_shares += shares;
        } else {
            game.no_shares += shares;
            user_bet.no_shares += shares;
        }

        env.storage().persistent().set(&game_key, &game);
        env.storage().persistent().set(&bet_key, &user_bet);

        env.events().publish(
            (String::from_str(&env, "Staked"), game_id),
            (staker, buy_yes, shares, price),
        );

        Ok((price, token_amount, amount))
    }

    /// Announce result (only owner)
    pub fn result_announced(
        env: Env,
        owner: Address,
        game_id: String,
        result: u32,
    ) -> Result<(), Error> {
        Self::require_owner(&env, &owner);

        if result > 1 {
            return Err(Error::InvalidResult);
        }

        let game_key = DataKey::Game(game_id.clone());
        let mut game: Game = env
            .storage()
            .persistent()
            .get(&game_key)
            .ok_or(Error::NoSuchGame)?;

        if game.finished {
            return Err(Error::GameFinished);
        }

        game.finished = true;
        game.winner = result;

        env.storage().persistent().set(&game_key, &game);

        env.events()
            .publish((String::from_str(&env, "ResultSet"),), (game_id, result));

        Ok(())
    }

    /// Redeem winnings
    pub fn redeem(env: Env, user: Address, game_id: String) -> Result<i128, Error> {
        user.require_auth();

        let game_key = DataKey::Game(game_id.clone());
        let game: Game = env
            .storage()
            .persistent()
            .get(&game_key)
            .ok_or(Error::NoSuchGame)?;

        if !game.finished {
            return Err(Error::NotFinished);
        }

        let bet_key = DataKey::Bet(game_id.clone(), user.clone());
        let mut bet: Bet = env
            .storage()
            .persistent()
            .get(&bet_key)
            .ok_or(Error::NoWinnings)?;

        let winning_shares = if game.winner == 1 {
            bet.yes_shares
        } else {
            bet.no_shares
        };

        if winning_shares == 0 {
            return Err(Error::NoWinnings);
        }

        let total_winning_shares = if game.winner == 1 {
            game.yes_shares
        } else {
            game.no_shares
        };

        if total_winning_shares == 0 {
            return Err(Error::NoTotalWinningShares);
        }

        // Reset user's winning shares
        if game.winner == 1 {
            bet.yes_shares = 0;
        } else {
            bet.no_shares = 0;
        }
        env.storage().persistent().set(&bet_key, &bet);

        // Calculate payout
        let payout = (game.total_pool * winning_shares as i128) / total_winning_shares as i128;

        // Transfer tokens
        let usd_contract: Address = env.storage().instance().get(&DataKey::UsdContract).unwrap();

        let token_client = token::Client::new(&env, &usd_contract);
        token_client.transfer(&env.current_contract_address(), &user, &payout);

        Ok(payout)
    }

    /// Get game information
    pub fn get_game(
        env: Env,
        game_id: String,
    ) -> Result<(String, bool, u32, u128, u128, u32, i128), Error> {
        let game_key = DataKey::Game(game_id.clone());
        let game: Game = env
            .storage()
            .persistent()
            .get(&game_key)
            .ok_or(Error::NoSuchGame)?;

        let stakers_key = DataKey::Stakers(game_id);
        let stakers: Vec<Address> = env
            .storage()
            .persistent()
            .get(&stakers_key)
            .unwrap_or(Vec::new(&env));

        Ok((
            game.game_id,
            game.finished,
            game.winner,
            game.yes_shares,
            game.no_shares,
            stakers.len(),
            game.total_pool,
        ))
    }

    /// Get bet information for a user
    pub fn get_bet(env: Env, game_id: String, user: Address) -> Result<(u128, u128), Error> {
        let bet_key = DataKey::Bet(game_id, user);
        let bet: Bet = env.storage().persistent().get(&bet_key).unwrap_or(Bet {
            yes_shares: 0,
            no_shares: 0,
        });

        Ok((bet.yes_shares, bet.no_shares))
    }
}


