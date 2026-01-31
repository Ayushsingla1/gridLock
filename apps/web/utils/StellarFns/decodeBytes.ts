import * as StellarSdk from "@stellar/stellar-sdk";

export function decodeU128Tuple(scVal: StellarSdk.xdr.ScVal) {
  const vec = scVal.vec();
  return {
    a: BigInt(vec[0]!.u128().lo().toString()),
    b: BigInt(vec[1].u128().lo().toString()),
  };
} 

export function decodeStakeResult(scVal: StellarSdk.xdr.ScVal) {
  const vec = scVal.vec();
  return {
    price: BigInt(vec[0].u128().lo().toString()),
    tokenAmount: BigInt(vec[1].i128().lo().toString()),
    amount: BigInt(vec[2].i128().lo().toString()),
  };
}

export function decodeGame(scVal: StellarSdk.xdr.ScVal) {
  const v = scVal.vec();
  return {
    gameId: v[0].str(),
    finished: v[1].b(),
    winner: v[2].u32(),
    yesShares: BigInt(v[3].u128().lo().toString()),
    noShares: BigInt(v[4].u128().lo().toString()),
    stakers: v[5].u32(),
    totalPool: BigInt(v[6].i128().lo().toString()),
  };
}

export function decodeI128(scVal: StellarSdk.xdr.ScVal) {
  return BigInt(scVal.i128().lo().toString());
}
