const { Wallets, Gateway, X509 } = require("fabric-network");
const FabricCaServices = require("fabric-ca-client");
const fs = require("fs");
const {
  getConnectionProfileJSON,
  getWalletPath,
  makeX509Identity,
  makeCredentialsZip,
  replaceNewLineCharactersWithNewLines,
} = require("../../utils/misc");
const mail = require("../../utils/mail");

module.exports.enrollUser = async (req, res) => {
  try {
    const { enrollmentId, enrollmentSecret, emailToSendCredentials } =
      req?.body;
    if (!enrollmentId || !enrollmentSecret || !emailToSendCredentials) {
      return res?.status(400).json({
        message: "Required fields are not provided!",
      });
    }

    // Note: Implement a way to check if the user is being registered with Certificate Authority

    //Make the ca connection
    const ca = new FabricCaServices(process.env.CA_SERVER_ENDPOINT);
    // Enroll the user
    const enrollment = await ca.enroll({
      enrollmentID: enrollmentId,
      enrollmentSecret: enrollmentSecret,
    });

    // Format the certificate and private key string
    // const pemFormattedCertificate = replaceNewLineCharactersWithNewLines(
    //   enrollment?.certificate
    // );

    // console.log("heheheheertetewtwetwe");
    // const pemFormattedPrivateKey = replaceNewLineCharactersWithNewLines(
    //   enrollment?.key.toBytes()
    // );

    // Generate a zip file
    const credentialsZip = await makeCredentialsZip(
      enrollment?.certificate,
      enrollment?.key.toBytes()
    );

    // send mail to user
    await mail.sendCredentialsMail(emailToSendCredentials, credentialsZip);

    // send X.509 Identity object in response
    return res?.status(200).json({
      message:
        "Enrollment successful, Please check your Email to download your credentials!",
      data: {},
    });
  } catch (error) {
    console.log(error?.errors);
    if (
      error?.errors[0]?.message === "Authentication failure" ||
      error?.errors[0]?.message === "Authorization failure"
    ) {
      return res?.status(403).json({
        message: "You have not registered or your credentials are worng!",
      });
    }
    return res?.status(500).json({ message: "Internal server error!" });
  }
};

module.exports.reenrollUser = async (req, res) => {
  try {
    const { enrollmentId } = req?.body;
    if (!enrollmentId) {
      return res?.status(400).json({
        message: "Required fields are not provided!",
      });
    }
    // Note: Implement a JWT infrastructure layer

    // Note: Implement a way to check if the user is being registered with Certificate Authority

    // See if the user is already being enrolled
    // Currently this is simply done by checking if the identity exists in the wallet
    const walletPath = getWalletPath();
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet?.get(enrollmentId);
    if (typeof identity !== "undefined") {
      return res.status(409).json({ message: "Identity is already enrolled!" });
    }
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};
