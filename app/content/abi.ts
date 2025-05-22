export const IVotingFactoryABI = [
    // Events
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "votingContract", "type": "address" },
        { "indexed": false, "name": "nullifier", "type": "uint256" }
      ],
      "name": "VotingContractCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "nullifier", "type": "uint256" },
        { "indexed": false, "name": "status", "type": "bool" }
      ],
      "name": "BlacklistStatusUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "admin", "type": "address" }
      ],
      "name": "AdminAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "admin", "type": "address" }
      ],
      "name": "AdminRemoved",
      "type": "event"
    },
    // State Variables (Getters)
    {
      "inputs": [],
      "name": "owner",
      "outputs": [{ "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "nullifier", "type": "uint256" }],
      "name": "blacklist",
      "outputs": [{ "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "admin", "type": "address" }],
      "name": "admins",
      "outputs": [{ "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "index", "type": "uint256" }],
      "name": "votingContracts",
      "outputs": [{ "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    // Functions
    {
      "inputs": [
        {
          "internalType": "struct IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof",
          "name": "proof",
          "type": "tuple",
          "components": [
            { "internalType": "uint256[2]", "name": "a", "type": "uint256[2]" },
            { "internalType": "uint256[2][2]", "name": "b", "type": "uint256[2][2]" },
            { "internalType": "uint256[2]", "name": "c", "type": "uint256[2]" },
            { "internalType": "uint256[21]", "name": "pubSignals", "type": "uint256[21]" }
          ]
        }
      ],
      "name": "UserVerification",
      "outputs": [{ "name": "", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "name": "deadline", "type": "uint256" },
        { "name": "optionCount", "type": "uint256" },
        { "name": "allowMultipleChoices", "type": "bool" },
        { "name": "hasAgeConstraint", "type": "bool" },
        { "name": "minAge", "type": "uint256" },
        {
          "internalType": "struct IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof",
          "name": "proof",
          "type": "tuple",
          "components": [
            { "internalType": "uint256[2]", "name": "a", "type": "uint256[2]" },
            { "internalType": "uint256[2][2]", "name": "b", "type": "uint256[2][2]" },
            { "internalType": "uint256[2]", "name": "c", "type": "uint256[2]" },
            { "internalType": "uint256[21]", "name": "pubSignals", "type": "uint256[21]" }
          ]
        }
      ],
      "name": "createVotingContract",
      "outputs": [{ "name": "", "type": "address" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "name": "nullifier", "type": "uint256" },
        { "name": "status", "type": "bool" }
      ],
      "name": "setBlacklist",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "name": "admin", "type": "address" }],
      "name": "addAdmin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "name": "admin", "type": "address" }],
      "name": "removeAdmin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotingContracts",
      "outputs": [{ "name": "", "type": "address[]" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  export const IVotingABI = [
    // Events
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "nullifier", "type": "uint256" },
        { "indexed": false, "name": "options", "type": "uint256[]" }
      ],
      "name": "Voted",
      "type": "event"
    },
    // State Variables (Getters)
    {
      "inputs": [],
      "name": "factory",
      "outputs": [{ "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deadline",
      "outputs": [{ "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "optionCount",
      "outputs": [{ "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "allowMultipleChoices",
      "outputs": [{ "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "index", "type": "uint256" }],
      "name": "voteCounts",
      "outputs": [{ "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "nullifier", "type": "uint256" }],
      "name": "hasVoted",
      "outputs": [{ "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    // Functions
    {
      "inputs": [
        {
          "internalType": "struct IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof",
          "name": "proof",
          "type": "tuple",
          "components": [
            { "internalType": "uint256[2]", "name": "a", "type": "uint256[2]" },
            { "internalType": "uint256[2][2]", "name": "b", "type": "uint256[2][2]" },
            { "internalType": "uint256[2]", "name": "c", "type": "uint256[2]" },
            { "internalType": "uint256[21]", "name": "pubSignals", "type": "uint256[21]" }
          ]
        }
      ],
      "name": "hasVotingPower",
      "outputs": [{ "name": "", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "struct IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof",
          "name": "proof",
          "type": "tuple",
          "components": [
            { "internalType": "uint256[2]", "name": "a", "type": "uint256[2]" },
            { "internalType": "uint256[2][2]", "name": "b", "type": "uint256[2][2]" },
            { "internalType": "uint256[2]", "name": "c", "type": "uint256[2]" },
            { "internalType": "uint256[21]", "name": "pubSignals", "type": "uint256[21]" }
          ]
        },
        { "name": "options", "type": "uint256[]" }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProposal",
      "outputs": [
        { "name": "votes", "type": "uint256[]" },
        { "name": "isActive", "type": "bool" },
        { "name": "timeLeft", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];