const web3 = new Web3(window.ethereum); // Initialize Web3
let account;
const CONTRACT_ADDR = "0x6241a82414EDBDCa3829951329A61485f04Be939"; // Smart contract address
const CONTRACT_ABI = [
    {
        "inputs": [{ "internalType": "string[]", "name": "_candidateName", "type": "string[]" }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_candidateId", "type": "uint256" }],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "candidatecount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "candidates",
        "outputs": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "uint256", "name": "votecount", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_candidateId", "type": "uint256" }],
        "name": "getvotecount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "hasvoted",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractInstance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDR);

document.addEventListener("DOMContentLoaded", async function () {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            account = accounts[0];
            console.log("Connected account:", account);

            // Fetch candidate count
            const candidateCount = await contractInstance.methods.candidatecount().call();

            for (let i = 1; i <= candidateCount; i++) {
                const candidate = await contractInstance.methods.candidates(i).call();

                // Dynamically populate the table
                document.getElementById(candidate.id).innerHTML = candidate.name;
                document.getElementById(`candidate${candidate.id}`).innerHTML = candidate.votecount;
            }
        } catch (err) {
            console.error("Error connecting to Metamask or fetching data:", err);
        }
    } else {
        alert("Please install Metamask to use this application.");
    }
});

// Voting function
async function vote() {
    const candidateId = document.getElementById("candidate").value;
    if (!candidateId) {
        alert("Please enter a valid candidate ID.");
        return;
    }

    try {
        await contractInstance.methods.vote(candidateId).send({ from: account });
        alert("Vote submitted successfully!");

        // Update vote count dynamically
        const updatedVoteCount = await contractInstance.methods.getvotecount(candidateId).call();
        document.getElementById(`candidate${candidateId}`).innerHTML = updatedVoteCount;
    } catch (err) {
        console.error("Error submitting vote:", err);
        alert("An error occurred while voting. Please try again.");
    }
}
