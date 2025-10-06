export const abi = [
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
	}
]

export const contractAddress = "0xF4130320c8825A1c7bF79164B7b46fBF765fA33c";