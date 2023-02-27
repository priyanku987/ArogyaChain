function getConnectionProfileJSON() {
  const connectionProfilePath =
    "backendServer/utils/commonConnectionProfile.json";
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
      privateKey: privatekeyString.toBytes(),
    },
    mspId: mspId,
    type: "X.509",
  };
}

export { getConnectionProfileJSON, getWalletPath, makeX509Identity };
