const fs = require("fs");

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

module.exports = { getConnectionProfileJSON, getWalletPath, makeX509Identity };
