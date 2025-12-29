export const abi = [
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
];

export const mantleContractAddress =
  "0x0E9EBb442DB3309d3e8d991C21a5371997d76DDf";
export const contractAddress = mantleContractAddress;
export const u2u_mainnet_contractAddress =
  "0xb75751B725A9663420962f10042f77D6abF5f56c";
