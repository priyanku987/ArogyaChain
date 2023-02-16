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

export { getConnectionProfileJSON, getWalletPath };
