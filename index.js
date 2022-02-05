const bitcoin = require("bitcoinjs-lib");
const bitcoinMessage = require("bitcoinjs-message");

//coininfo gives us meta data about a bunch of crypto currencies, including Ravencoin
const coininfo = require("coininfo");

const { ECPairFactory } = require("ecpair");
const ecc = require("tiny-secp256k1");
const ECPair = ECPairFactory(ecc);

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
const privateKeyWIF = "KzukNMdpgEEfGUA4h5AByvAp7ANGALEVJxGc4uRSQatDLn5Qosq2";

var keyPair = ECPair.fromWIF(privateKeyWIF, RAVENCOIN_NETWORK);

const { address } = bitcoin.payments.p2pkh({
  pubkey: keyPair.publicKey,
  network: RAVENCOIN_NETWORK,
});

var privateKey = keyPair.privateKey;
/*
export function sign(
  message: string | Buffer,
  privateKey: Buffer | Signer,
  compressed?: boolean,
  messagePrefix?: string,
  sigOptions?: SignatureOptions
): Buffer;
*/
var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed, RAVENCOIN_NETWORK.messagePrefix);
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
