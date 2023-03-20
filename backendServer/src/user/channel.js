const { Wallets, Gateway, X509 } = require("fabric-network");
const FabricCaServices = require("fabric-ca-client");
const fs = require("fs");
const { getConnectionProfileJSON, getWalletPath } = require("../../utils/misc");

module.exports.getMSPs = async (req, res) => {
  try {
    const { X509Identity, adhaarNumber } = req.user;
    console.log(X509Identity);

    const connectionProfile = getConnectionProfileJSON();
    const networkGateway = new Gateway();
    await networkGateway.connect(connectionProfile, {
      identity: X509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await networkGateway.getNetwork("arogyaehrchannel");

    const channel = network.getChannel();
    console.log(channel);

    const msps = channel?.getMspids();

    return res.status(200).json({
      message: "Success",
      data: msps,
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};
