const fs = require("fs");
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; //Using AES encryption
const jsZip = require("jszip");
const { customAlphabet } = require("nanoid");

const key = crypto
  .createHash("sha512")
  .update("jdkaidudidwdid")
  .digest("hex")
  .substring(0, 32);
const encryptionIV = crypto
  .createHash("sha512")
  .update("dlwkjdnlwndjkwnk")
  .digest("hex")
  .substring(0, 16);

function getConnectionProfileJSON() {
  const connectionProfilePath =
    "/home/priyanku/Desktop/major-project/ArogyaChain/backendServer/utils/commonConnectionProfile.json";
  const connectionProfileJSON = fs.readFileSync(connectionProfilePath, "utf8");
  const parsedConnectionProfile = JSON.parse(connectionProfileJSON);
  return parsedConnectionProfile;
}

function getWalletPath() {
  const walletPath =
    "/Users/priyankuhazarika/Desktop/.personal/major-project/ArogyaChain/wallet";
  return walletPath;
}

function makeX509Identity(certificate, privatekeyString, mspId) {
  return {
    credentials: {
      certificate,
      privateKey: privatekeyString,
    },
    mspId: mspId,
    type: "X.509",
  };
}

function encryptCookie(data) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, encryptionIV);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64");
}

function decryptCookie(encryptedData) {
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, encryptionIV);
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  );
}

async function makeCredentialsZip(
  pemFormattedCertificate,
  pemFormattedPrivateKey
) {
  const zip = new jsZip();
  const nanoid = customAlphabet("1234567890abcdef", 50);
  const privateKeyFileName = `${nanoid()}_sk`;

  zip.file("certificate.pem", pemFormattedCertificate);
  zip.file(privateKeyFileName, pemFormattedPrivateKey);

  return zip.generateAsync({ type: "base64" });
}

function replaceNewLineCharactersWithNewLines(string) {
  return str.replace(/\r?\n/g, "\n");
}

module.exports = {
  getConnectionProfileJSON,
  getWalletPath,
  makeX509Identity,
  encryptCookie,
  decryptCookie,
  makeCredentialsZip,
  replaceNewLineCharactersWithNewLines,
};
