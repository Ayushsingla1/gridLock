export const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			}
		],
		"name": "createGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usdContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "y",
				"type": "uint256"
			}
		],
		"name": "PRBMath_MulDiv18_Overflow",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "y",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "denominator",
				"type": "uint256"
			}
		],
		"name": "PRBMath_MulDiv_Overflow",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "PRBMath_SD59x18_Div_InputTooSmall",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "SD59x18",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "SD59x18",
				"name": "y",
				"type": "int256"
			}
		],
		"name": "PRBMath_SD59x18_Div_Overflow",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "SD59x18",
				"name": "x",
				"type": "int256"
			}
		],
		"name": "PRBMath_SD59x18_Exp2_InputTooBig",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "SD59x18",
				"name": "x",
				"type": "int256"
			}
		],
		"name": "PRBMath_SD59x18_Exp_InputTooBig",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "SD59x18",
				"name": "x",
				"type": "int256"
			}
		],
		"name": "PRBMath_SD59x18_Log_InputTooSmall",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "PRBMath_SD59x18_Mul_InputTooSmall",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "SD59x18",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "SD59x18",
				"name": "y",
				"type": "int256"
			}
		],
		"name": "PRBMath_SD59x18_Mul_Overflow",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			}
		],
		"name": "GameCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			}
		],
		"name": "redeem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "result",
				"type": "uint8"
			}
		],
		"name": "resultAnnounced",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "winner",
				"type": "uint8"
			}
		],
		"name": "ResultSet",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "shares",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "bet",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "stakeAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "staker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "yesSide",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "shares",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "paid",
				"type": "uint256"
			}
		],
		"name": "Staked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "bet",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "shares",
				"type": "uint256"
			}
		],
		"name": "getAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getBet",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "yesShares",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "noShares",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "gameId",
				"type": "string"
			}
		],
		"name": "getGame",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "finished",
				"type": "bool"
			},
			{
				"internalType": "uint8",
				"name": "winner",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "yesShares",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "noShares",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakerCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPool",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "usdContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
export const contractAddress = "0xcb4068EB5Dad5A7869772Db33E19D209646484f0";
export const usdContractAddress = "0xCaF4c2c7D95ceE7E141389cAd8f07c0b92349aac";