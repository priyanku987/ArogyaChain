const { Wallets, Gateway, X509 } = require("fabric-network");
const FabricCaServices = require("fabric-ca-client");
const fs = require("fs");
const { getConnectionProfileJSON } = require("../../utils/misc");
const { nanoid } = require("nanoid");
const _ = require("lodash");

module.exports.getEHRs = async (req, res) => {
  try {
    const { aadhaarNumber, x509Identity } = req?.session?.user;

    // NOTE : implement a way to See if the user is already being enrolled
    // Make the gateway connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      identity: x509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await gateway.getNetwork(process.env.EHR_CHANNEL);

    // Get the contract from the network.
    const contract = network.getContract("medicalRecordSimpleldb_1_0");
    const results = await contract?.evaluateTransaction(
      "GetEMRByPatientId",
      aadhaarNumber,
      "accessControlSimpleldb_1_0"
    );
    const jsonResults = JSON.parse(results.toString());

    const filteredJsonResults = [];
    jsonResults?.forEach((ree) => {
      const element = _.attempt(JSON.parse, ree?.MedicinesPrescribed);
      const element2 = _.attempt(JSON.parse, ree?.TestsRecommended);

      if (!_.isError(element) && !_.isError(element2)) {
        filteredJsonResults.push(ree);
      }
    });

    gateway?.disconnect();

    return res.status(200).json({
      data: filteredJsonResults,
    });
  } catch (error) {
    // console.log(JSON.stringify(error));
    return res
      ?.status(500)
      .json({ error: error?.message, message: "Internal server error!" });
  }
};

module.exports.grantAllEHRAccessToIdentity = async (req, res) => {
  try {
    const { granteeId } = req?.body; // The person's adhaar number to whom the user is granting access
    const { adhaarNumber, X509Identity } = req?.user; // Users Adhaar Number

    if (!granteeId) {
      return res?.status(400).json({
        message: "Required fields are not provided!",
      });
    }

    // Assuming that the grantee is already enrolled in the network
    // NOTE : implement a way to See if the user is already being enrolled

    // Make the gateway connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      identity: X509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await gateway.getNetwork(process.env.EHR_CHANNEL);

    // Get the contract from the network.
    const contract = network.getContract("accessControl");
    await contract.submitTransaction("GrantAccess", {
      Id: nanoid(30),
      Type: "ACCESS-GRANT-REVOKE",
      Operation: "GRANT_ACCESS",
      EHRId: null,
      PerformedBy: adhaarNumber,
      PerformedFor: granteeId,
      Date: new Date(),
    });

    gateway?.disconnect();

    return res?.status(200).json({
      message: "Successfully submitted the transaction for granting access!",
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};

module.exports.grantParticularEHRAccessToIdentity = async (req, res) => {
  try {
    const { granteeId, ehrId } = req?.body; // The person's adhaar number to whom the user is granting access
    const { aadhaarNumber, x509Identity } = req?.session?.user; // Users Adhaar Number

    if (!granteeId || !ehrId) {
      return res?.status(400).json({
        message: "Required fields are not provided!",
      });
    }

    // Assuming that the grantee is already enrolled in the network and the EHR already exists
    // NOTE: Implement a way to See if the user is already being enrolled

    // Make the gateway connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      identity: x509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await gateway.getNetwork(process.env.EHR_CHANNEL);

    // Get the contract from the network.
    const contract = network.getContract(process.env.ACCESS_CONTROL_CHAINCODE);
    await contract.submitTransaction(
      "GrantAccess",
      nanoid(30),
      ehrId,
      aadhaarNumber,
      granteeId
    );

    gateway?.disconnect();

    return res?.status(200).json({
      message: "Successfully submitted the transaction for granting access!",
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};

module.exports.revokeParticularEHRAccessFromIdentity = async (req, res) => {
  try {
    const { granteeId, ehrId } = req?.body; // The person's adhaar number to whom the user is granting access
    const { aadhaarNumber, x509Identity } = req?.session?.user; // Users Adhaar Number

    if (!granteeId || !ehrId) {
      return res?.status(400).json({
        message: "Required fields are not provided!",
      });
    }

    // Assuming that the grantee is already enrolled in the network and the EHR already exists
    // NOTE: Implement a way to See if the user is already being enrolled

    // Make the gateway connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      identity: x509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await gateway.getNetwork(process.env.EHR_CHANNEL);

    // Get the contract from the network.
    // Get the contract from the network.
    const contract = network.getContract(process.env.ACCESS_CONTROL_CHAINCODE);
    await contract.submitTransaction(
      "RevokeAccess",
      nanoid(30),
      ehrId,
      aadhaarNumber,
      granteeId
    );
    gateway?.disconnect();

    return res?.status(200).json({
      message: "Successfully submitted the transaction for revoking access!",
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};

module.exports.getExecutorACLHistory = async (req, res) => {
  try {
    const { aadhaarNumber, x509Identity } = req?.session?.user;

    // Make the gateway connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      identity: x509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await gateway.getNetwork(process.env.EHR_CHANNEL);

    // Get the contract from the network.
    // Get the contract from the network.
    const contract = network.getContract(process.env.ACCESS_CONTROL_CHAINCODE);

    const results = await contract?.evaluateTransaction(
      "GetACLHistoryForACProviderIdentity",
      aadhaarNumber
    );

    const jsonResults = JSON.parse(results.toString());
    gateway?.disconnect();

    return res.status(200).json({
      data: jsonResults,
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};

module.exports.getACLHistoryExecutedForAnIdentity = async (req, res) => {
  try {
    const { aadhaarNumber, x509Identity } = req?.session?.user;

    // Make the gateway connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      identity: x509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await gateway.getNetwork(process.env.EHR_CHANNEL);

    // Get the contract from the network.
    // Get the contract from the network.
    const contract = network.getContract(process.env.ACCESS_CONTROL_CHAINCODE);

    const results = await contract?.evaluateTransaction(
      "GetACLHistoryForACAcceptorIdentity",
      aadhaarNumber
    );

    const jsonResults = JSON.parse(results.toString());
    gateway?.disconnect();

    return res.status(200).json({
      data: jsonResults,
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};
