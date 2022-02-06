const bitcoin = require("bitcoinjs-lib");
const bitcoinMessage = require("bitcoinjs-message");

const CoinKey = require("coinkey");
const coininfo = require("coininfo"); //coininfo gives us meta data about a bunch of crypto currencies, including Ravencoin

const frmt = coininfo.ravencoin.main.toBitcoinJS();
const RAVENCOIN_NETWORK = {
  messagePrefix: "\x16Raven Signed Message:\n",
  bip32: {
    public: frmt.bip32.public,
    private: frmt.bip32.private,
  },
  pubKeyHash: frmt.pubKeyHash,
  scriptHash: frmt.scriptHash,
  wif: frmt.wif,
};

const message = "This is an example of a signed message.";
const privateKeyWIF = "KwTnXnJ4kbAf29wYEmXkB3xkCm8byYxg3hkPt8yhd37ofjwj7h8F";

//Import private key as WIF and set coinkey to use MAIN-net for Ravencoin
const coinkey = CoinKey.fromWif(privateKeyWIF);
coinkey.versions = coininfo("RVN").versions;

const { address } = bitcoin.payments.p2pkh({
  pubkey: coinkey.publicKey,
  network: RAVENCOIN_NETWORK,
});

const privateKey = coinkey.privateKey;
/*
export function sign(
  message: string | Buffer,
  privateKey: Buffer | Signer,
  compressed?: boolean,
  messagePrefix?: string,
  sigOptions?: SignatureOptions
): Buffer;
*/
var signature = bitcoinMessage.sign(
  message,
  privateKey,
  coinkey.compressed,
  RAVENCOIN_NETWORK.messagePrefix
);
const table = {
  address,
  message,
  signature: signature.toString("base64"),
};
console.table(table);
/*
export function verify(
  message: string | Buffer,
  address: string,
  signature: string | Buffer,
  messagePrefix?: string,
  checkSegwitAlways?: boolean
): boolean;

*/
const result = bitcoinMessage.verify(
  message,
  address,
  signature,
  RAVENCOIN_NETWORK.messagePrefix
);

console.log("Result", result);
