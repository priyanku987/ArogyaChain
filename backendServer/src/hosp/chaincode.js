const { Wallets, Gateway, X509 } = require("fabric-network");
const FabricCaServices = require("fabric-ca-client");
const fs = require("fs");
const { getConnectionProfileJSON, getWalletPath } = require("../../utils/misc");

module.exports.createEHR = async (req, res) => {
  try {
    const {
      Id,
      Type,
      Owner,
      IssuedBy,
      ConsultingDoctorID,
      ConsultingDoctorName,
      ConsultingDoctorRegisteredNumber,
      HospitalId,
      HospitalName,
      HospitalRegisteredNumber,
      CreatedBy,
      UpdatedBy,
      PatientId,
      PatientName,
      PatientAge,
      PatientAddress,
      PatientCountry,
      PatientState,
      PatientCity,
      PatientDistrict,
      PatientVillage,
      PatientZipcode,
      PatientEmail,
      PatientPhoneNumbers,
      PatientAttendantName,
      PatientAttendantRelation,
      DiseaseName,
      DiseaseDescription,
      SeverityOfDisease,
      MedicinesPrescribed,
      Suggesstions,
      TestsRecommended,
    } = req?.body;
    const { adhaarNumber } = req?.user; // Doctor's Adhaar Number

    if (
      !Id ||
      !Type ||
      !Owner ||
      !IssuedBy ||
      !ConsultingDoctorID ||
      !ConsultingDoctorName ||
      !ConsultingDoctorRegisteredNumber ||
      !HospitalId ||
      !HospitalName ||
      !HospitalRegisteredNumber ||
      !CreatedBy ||
      !UpdatedBy ||
      !PatientId ||
      !PatientName ||
      !PatientAge ||
      !PatientAddress ||
      !PatientCountry ||
      !PatientState ||
      !PatientCity ||
      !PatientDistrict ||
      !PatientVillage ||
      !PatientZipcode ||
      !PatientEmail ||
      !PatientPhoneNumbers ||
      !PatientAttendantName ||
      !PatientAttendantRelation ||
      !DiseaseName ||
      !DiseaseDescription ||
      !SeverityOfDisease ||
      !MedicinesPrescribed ||
      !Suggesstions
    ) {
      return res
        ?.status(400)
        .json({ message: "Required fields are not provided!" });
    }

    // Assuming that the grantee is already enrolled in the network
    // See if the user is already being enrolled
    // Currently this is simply done by checking if the identity exists in the wallet
    const walletPath = getWalletPath();
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet?.get(adhaarNumber);
    if (typeof identity === "undefined") {
      return res.status(403).json({ message: "Identity is not enrolled!" });
    }

    // Make the gateway connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      wallet,
      identity: identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await gateway.getNetwork(process.env.EHR_CHANNEL);
    // Get the contract from the network.
    const contract = network.getContract("medicalRecord");
    await contract.submitTransaction(
      "CreateMedicalRecord",
      Id,
      Type,
      Owner,
      IssuedBy,
      ConsultingDoctorID,
      ConsultingDoctorName,
      ConsultingDoctorRegisteredNumber,
      HospitalId,
      HospitalName,
      HospitalRegisteredNumber,
      CreatedBy,
      UpdatedBy,
      PatientId,
      PatientName,
      PatientAge,
      PatientAddress,
      PatientCountry,
      PatientState,
      PatientCity,
      PatientDistrict,
      PatientVillage,
      PatientZipcode,
      PatientEmail,
      PatientPhoneNumbers,
      PatientAttendantName,
      PatientAttendantRelation,
      DiseaseName,
      DiseaseDescription,
      SeverityOfDisease,
      MedicinesPrescribed,
      Suggesstions,
      TestsRecommended
    );

    gateway.disconnect();

    return res.status(200).json({
      message: "Successfully submitted transaction for creating EHR!",
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};

module.exports.getEHRByPatient = async (req, res) => {
  try {
    const { patientId } = req?.query;
    const { adhaarNumber } = req?.user;
    if (!patientId) {
      return res.status(400).json({
        message: "Patient Id not provided!",
      });
    }

    // See if the user is already being enrolled
    // Currently this is simply done by checking if the identity exists in the wallet
    const walletPath = getWalletPath();
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet?.get(adhaarNumber);
    if (typeof identity === "undefined") {
      return res.status(403).json({ message: "Identity is not enrolled!" });
    }

    // Make the gateway connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      wallet,
      identity: identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await gateway.getNetwork(process.env.EHR_CHANNEL);

    // Get the contract from the network.
    const contract = network.getContract("medicalRecord");
    const results = await contract?.evaluateTransaction("GetEMRByPatientId", [
      patientId,
    ]);

    gateway.disconnect();

    return res?.status(200).json({
      data: results,
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};
