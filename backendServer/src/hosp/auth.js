const { Wallets, Gateway } = require("fabric-network");
const { getConnectionProfileJSON } = require("../../utils/misc");
const FabricCAServices = require("fabric-ca-client");
const { User } = require("fabric-common");
const { nanoid } = require("nanoid");
const mail = require("../../utils/mail");

const commonConnectionProfilePath =
  "backendServer/utils/commonConnectionProfile.json";

module.exports.registerIdentity = async (req, res) => {
  try {
    const { x509Identity } = req?.session?.user;
    console.log(req?.session);
    const { aadhaarNumber, fullName, dob, phoneNumber, email, roles } =
      req.body; //"org" should be in lower case letters

    if (
      !aadhaarNumber ||
      !fullName ||
      !dob ||
      !phoneNumber ||
      !email ||
      roles?.length === 0
    ) {
      return res?.status(400).json({
        message: "Required fields are not provided!",
      });
    }

    // Implement UIDAI Adhaar authenticatio and verification layer

    // Get the connection profile from the input provided in the header
    // Connect to the gateway and select the channel to transact on
    const connectionProfile = getConnectionProfileJSON();
    const networkGateway = new Gateway();
    await networkGateway.connect(connectionProfile, {
      identity: x509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the ca instance
    const ca = new FabricCAServices(process.env.CA_SERVER_ENDPOINT);

    const attributes = [
      {
        name: "FULL_NAME",
        value: fullName,
        ecert: true,
      },
      {
        name: "DOB",
        value: dob,
        ecert: true,
      },
      {
        name: "PHONE_NUMBER",
        value: phoneNumber,
        ecert: true,
      },
      {
        name: "EMAIL",
        value: email,
        ecert: true,
      },
      {
        name: "MSPID",
        value: x509Identity?.mspId,
        ecert: true,
      },
    ];
    roles?.forEach((role) => {
      attributes.push({
        name: role,
        value: "true",
        ecert: true,
      });
    });

    const secret = nanoid(20);
    let affiliation = `${req?.session?.user?.attrs["hf.Affiliation"]}.usermanagement.users`;
    if (roles?.includes("DOCTOR") || roles?.includes("RECIEPTIONIST")) {
      affiliation = `${req?.session?.user?.attrs["hf.Affiliation"]}.usermanagement`;
    }
    const registrationResult = await ca.register(
      {
        enrollmentID: aadhaarNumber,
        enrollmentSecret: secret,
        role: "client",
        affiliation: affiliation, //NOTE: need to update the fabric-ca-server-config.yaml to include "user" in the affiliations
        maxEnrollments: -1,
        attrs: attributes,
      },
      networkGateway?.identityContext?.user
    );

    // send mail
    await mail.sendEnrollmentSecretMail(email, secret);
    return res.status(200).json({
      message: "Identity registration successfull!",
      data: registrationResult,
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({
      message: "Internal server error!",
    });
  }
};
