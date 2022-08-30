import {
  AptosAccount,
  WalletClient,
  HexString,
} from "@martiandao/aptos-web3-bip44.js";
import * as env from "dotenv";
env.config();

const feeNumerator = 10;
const {
  APTOS_NODE_URL: aptosNodeURL,
  APTOS_FAUCET_URL: aptosFaucetURL,
  WALLET_PRIVATE_KEY: walletPrivateKey,
  MARKET_NAME: marketName,
} = process.env;

async function main() {
  const client = new WalletClient(aptosNodeURL, aptosFaucetURL);
  const account = new AptosAccount(
    HexString.ensure(walletPrivateKey).toUint8Array()
  );
  const payload = {
    type: "script_function_payload",
    function: `${account.address()}::market::create_market`,
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [marketName, feeNumerator, `${account.address()}`],
  };
  const transaction = await client.aptosClient.generateTransaction(
    account.address(),
    payload
  );
  await client.signAndSubmitTransaction(account, transaction);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });