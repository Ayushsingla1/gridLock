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

export const contractAddress = "0x95620BCEEdbCe875Be41510649ba9bA1Fc177E92";