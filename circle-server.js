const yargs = require("yargs"); //this is a library that helps to build interactive command line tools
const {
  initiateUserControlledWalletsClient,
} = require("@circle-fin/user-controlled-wallets"); //This is the Circle API library that is used to interact with the Circle API

require("dotenv").config();

//Creating a circle client to interact with the Circle API and its services.
const client = initiateUserControlledWalletsClient({
  apiKey: process.env.API_KEY, //The API key is stored in the .env file
});

/*
To initialize the client and use the circle api services, 
*/

// #Step 1 - Create a new user
async function createNewUser() {
  let response = await client.createUser({
    userId: "User_2",
  });

  console.log("User created successfully");
}

// #Step 2 - Create session token
async function createSessionToken() {
  let response = await client.createUserToken({
    userId: "User_2",
  });

  console.log(response.data);
}

// #Step 3 - Create Challenge for Wallet Creation
async function createChallengeForWalletCreation() {
  let response = await client.createUserPinWithWallets({
    userId: "User_1",
    blockchains: ["ETH-SEPOLIA"],
    userToken: process.env.USER_TOKEN_1,
  });

  console.log(response.data?.challengeId);
}

// #Step 4 - Create Challenge for SCA Wallet Creation
async function createChallengeForSCAWalletCreation() {
  let response = await client.createUserPinWithWallets({
    userId: "User_2",
    blockchains: ["ETH-SEPOLIA"],
    accountType: "SCA",
    userToken: process.env.USER_TOKEN_2,
  });

  console.log(response.data?.challengeId);
}

// #Step 5 - Fetch Wallet Balance
async function fetchWallet() {
  let response = await client.getWalletTokenBalance({
    walletId: process.env.SCA_WALLET_ID,
    userToken: process.env.USER_TOKEN_2,
    userId: "User_2",
  });
  //USDC Token ID: 5797fbd6-3795-519d-84ca-ec4c5f80c3b1

  console.log(response.data?.tokenBalances); //This will return the balance of the wallet. the syntax is response.data?.tokenBalances[0].balance. response.data? is used to check if the data is available
}

// #Step 6 - Create Challenge for Outbound Transfer
async function createChallengeForOutboundTransfer() {
  let response = await client.createTransaction({
    idempotencyKey: "4d5774b0-62c4-4dee-83dc-5814cff64411", //This is a unique key that is used to identify the transaction to prevent duplicate transactions
    amounts: ["0.1"],
    destinationAddress: "0x27fe6efc3d8b720e29ab9834d25f6ffcdcd0ffec",
    tokenId: "5797fbd6-3795-519d-84ca-ec4c5f80c3b1",
    walletId: process.env.SCA_WALLET_ID,
    userId: "User_2",
    fee: {
      type: "level",
      config: {
        feeLevel: "MEDIUM",
      },
    },
    userToken: process.env.USER_TOKEN_2,
  });
  console.log(response.data?.challengeId);
}

yargs
  .scriptName("circle_server")
  .usage("$0 <cmd> [args]")

  .command(
    "create-user",
    "Create a new user",
    () => {},
    (argv) => {
      createNewUser();
    }
  )

  .command(
    "create-token",
    "Create a session token",
    () => {},
    (argv) => {
      createSessionToken();
    }
  )

  .command(
    "create-challenge-wallet",
    "Create Challenge to Create Wallet",
    () => {},
    (argv) => {
      createChallengeForWalletCreation();
    }
  )

  .command(
    "create-challenge-sca-wallet",
    "Create Challenge to Create SCA Wallet",
    () => {},
    (argv) => {
      createChallengeForSCAWalletCreation();
    }
  )

  .command(
    "fetch-wallet",
    "Fetch wallet",
    () => {},
    (argv) => {
      fetchWallet();
    }
  )

  .command(
    "create-challenge-outbound-transfer",
    "Create Challenge for Outbound Transfer",
    () => {},
    (argv) => {
      createChallengeForOutboundTransfer();
    }
  )

  .help().argv;
