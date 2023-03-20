const { Wallets, Gateway, X509 } = require("fabric-network");
const FabricCaServices = require("fabric-ca-client");
const fs = require("fs");
const { getConnectionProfileJSON, getWalletPath } = require("../../utils/misc");
const { nanoid } = require("nanoid");

module.exports.createEHR = async (req, res) => {
  try {
    const {
      Type,
      Owner,
      ConsultingDoctorName,
      ConsultingDoctorRegisteredNumber,
      HospitalId,
      HospitalName,
      HospitalRegisteredNumber,
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
    const { X509Identity, adhaarNumber } = req?.user; // Doctor's Adhaar Number

    if (
      !Type ||
      !Owner ||
      !ConsultingDoctorName ||
      !ConsultingDoctorRegisteredNumber ||
      !HospitalId ||
      !HospitalName ||
      !HospitalRegisteredNumber ||
      !PatientId ||
      !PatientName ||
      !PatientAge ||
      !PatientAddress ||
      !PatientCountry ||
      !PatientState ||
      !PatientCity ||
      !PatientDistrict ||
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

    const connectionProfile = getConnectionProfileJSON();
    const networkGateway = new Gateway();
    await networkGateway.connect(connectionProfile, {
      identity: X509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await networkGateway.getNetwork(process.env.EHR_CHANNEL);
    // Get the contract from the network.
    const contract = network.getContract(process.env.MEDICAL_RECORD_CHAINCODE);

    // Generate neccesary data for EHR
    const ehrId = `ehr_${PatientId}_${nanoid(20)}`;
    const doctorId = adhaarNumber;
    await contract.submitTransaction(
      "CreateMedicalRecord",
      ehrId,
      Type,
      Owner,
      doctorId, //issued by
      doctorId, // consulting doctor id
      ConsultingDoctorName,
      ConsultingDoctorRegisteredNumber,
      HospitalId,
      HospitalName,
      HospitalRegisteredNumber,
      doctorId, // createdBY
      doctorId, // updatedBy
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

    networkGateway.disconnect();

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
    const { X509Identity } = req?.user;
    if (!patientId) {
      return res.status(400).json({
        message: "Patient Id not provided!",
      });
    }

    const connectionProfile = getConnectionProfileJSON();
    const networkGateway = new Gateway();
    await networkGateway.connect(connectionProfile, {
      identity: X509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await networkGateway.getNetwork(process.env.EHR_CHANNEL);

    // Get the contract from the network.
    const contract = network.getContract(process.env.MEDICAL_RECORD_CHAINCODE);
    console.log("cotract", contract);
    let results = await contract?.evaluateTransaction(
      "GetEMRByPatientId",
      patientId,
      process.env.ACCESS_CONTROL_CHAINCODE
    );

    results = JSON.parse(results.toString());

    networkGateway.disconnect();

    return res?.status(200).json({
      data: results,
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};
