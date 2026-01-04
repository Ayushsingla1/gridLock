export const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "createGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_usdContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
    ],
    name: "PRBMath_MulDiv18_Overflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "denominator",
        type: "uint256",
      },
    ],
    name: "PRBMath_MulDiv_Overflow",
    type: "error",
  },
  {
    inputs: [],
    name: "PRBMath_SD59x18_Div_InputTooSmall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "SD59x18",
        name: "x",
        type: "int256",
      },
      {
        internalType: "SD59x18",
        name: "y",
        type: "int256",
      },
    ],
    name: "PRBMath_SD59x18_Div_Overflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "SD59x18",
        name: "x",
        type: "int256",
      },
    ],
    name: "PRBMath_SD59x18_Exp2_InputTooBig",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "SD59x18",
        name: "x",
        type: "int256",
      },
    ],
    name: "PRBMath_SD59x18_Exp_InputTooBig",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "SD59x18",
        name: "x",
        type: "int256",
      },
    ],
    name: "PRBMath_SD59x18_Log_InputTooSmall",
    type: "error",
  },
  {
    inputs: [],
    name: "PRBMath_SD59x18_Mul_InputTooSmall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "SD59x18",
        name: "x",
        type: "int256",
      },
      {
        internalType: "SD59x18",
        name: "y",
        type: "int256",
      },
    ],
    name: "PRBMath_SD59x18_Mul_Overflow",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "GameCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "redeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "result",
        type: "uint8",
      },
    ],
    name: "resultAnnounced",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "winner",
        type: "uint8",
      },
    ],
    name: "ResultSet",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "bet",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "stakeAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "staker",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "yesSide",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paid",
        type: "uint256",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "bet",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "getAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getBet",
    outputs: [
      {
        internalType: "uint256",
        name: "yesShares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "noShares",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "gameId",
        type: "string",
      },
    ],
    name: "getGame",
    outputs: [
      {
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        internalType: "bool",
        name: "finished",
        type: "bool",
      },
      {
        internalType: "uint8",
        name: "winner",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "yesShares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "noShares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakerCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalPool",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "usdContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export const mantleContractAddress =
  "0x0E9EBb442DB3309d3e8d991C21a5371997d76DDf";
export const mantleUsdContractAddress =
  "0xbb16eD6D8c96c328f47f298cB9C033701Ca8C5c8";
export const contractAddress = mantleContractAddress;
export const usdContractAddress = mantleUsdContractAddress;

export const u2u_mainnet_contract =
  "0xb75751B725A9663420962f10042f77D6abF5f56c";
export const u2u_mainnet_usd = "0x67588a34FAfae09E9b683b76dB1FB97d9238B63a";
