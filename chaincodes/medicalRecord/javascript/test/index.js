const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const chaiExclude = require("chai-exclude");
const expect = chai.expect;

const { Context } = require("fabric-contract-api");
const { ChaincodeStub, ClientIdentity } = require("fabric-shim");

const MedicalRecord = require("../lib/medicalRecordContract");

let assert = sinon.assert;
chai.use(chaiExclude);
chai.use(sinonChai);

describe("Medical Record Contract Tests", () => {
  let transactionContext, chaincodeStub, medicalRecord;
  beforeEach(() => {
    transactionContext = new Context();
    chaincodeStub = sinon.createStubInstance(ChaincodeStub);
    transactionContext.setChaincodeStub(chaincodeStub);
    transactionContext.setClientIdentity({
      id: "12345",
      mspid: "MyMSPID",
    });

    chaincodeStub.putState.callsFake((key, value) => {
      if (!chaincodeStub.states) {
        chaincodeStub.states = {};
      }
      chaincodeStub.states[key] = value;
    });

    chaincodeStub.getState.callsFake(async (key) => {
      let ret;
      if (chaincodeStub.states) {
        ret = chaincodeStub.states[key];
      }
      return Promise.resolve(ret);
    });

    chaincodeStub.deleteState.callsFake(async (key) => {
      if (chaincodeStub.states) {
        delete chaincodeStub.states[key];
      }
      return Promise.resolve(key);
    });

    chaincodeStub.getStateByRange.callsFake(async () => {
      function* internalGetStateByRange() {
        if (chaincodeStub.states) {
          // Shallow copy
          const copied = Object.assign({}, chaincodeStub.states);

          for (let key in copied) {
            yield { value: copied[key] };
          }
        }
      }

      return Promise.resolve(internalGetStateByRange());
    });

    medicalRecord = {
      Id: "1xasaDE",
      Type: "PRESCRIPTION",
      Owner: "demo",
      IssuedBy: "mohfw",
      ConsultingDoctorID: "mohfw",
      ConsultingDoctorName: "mohfw",
      ConsultingDoctorRegisteredNumber: "123432432",
      HospitalId: "demo",
      HospitalName: "demo",
      HospitalRegisteredNumber: "13144",
      IssueDate: new Date(),
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      CreatedBy: "mohfw",
      UpdatedBy: "mohfw",
      PatientId: "demo",
      PatientName: "demo",
      PatientAge: "20",
      PatientAddress: "demo",
      PatientCountry: "demo",
      PatientState: "demo",
      PatientCity: "demo",
      PatientDistrict: "demo",
      PatientVillage: "demo",
      PatientZipcode: "00000",
      PatientEmail: "demo",
      PatientPhoneNumbers: ["+91demo", "+91demo"],
      PatientAttendantName: "demo",
      PatientAttendantRelation: "demoRelation",
      DiseaseName: "demo",
      DiseaseDescription: "demo",
      SeverityOfDisease: "low",
      MedicinesPrescribed: [
        {
          name: "demoMedicine",
          reason: "demo reason",
          dosage: "once daily after food",
        },
      ],
      Suggesstions: "Eath Healthy",
      TestsRecommended: ["Sterotonin LIB1 blood test", "Creatin B12 test"],
    };
  });

  describe("Test InitLedger", () => {
    it("should return error on InitLedger", async () => {
      chaincodeStub.putState.rejects("failed inserting key");
      let medicalRecordContract = new MedicalRecord();
      try {
        await medicalRecordContract.InitLedger(transactionContext);
        assert.fail("InitLedger should have failed");
      } catch (err) {
        expect(err.name).to.equal("failed inserting key");
      }
    });

    it("should return success on InitLedger", async () => {
      let medicalRecordContract = new MedicalRecord();
      await medicalRecordContract.InitLedger(transactionContext);

      let ret = JSON.parse(
        (await chaincodeStub.getState("1xasaDE")).toString()
      );
      expect(ret)
        .excluding(["UpdatedAt", "IssueDate", "CreatedAt"])
        .to.eql(Object(medicalRecord));
    });
  });

  describe("Test ReadEMR", () => {
    it("should return error on ReadEMR", async () => {
      let medicalRecordContract = new MedicalRecord();

      try {
        await medicalRecordContract.GetEMRByPatientId(
          transactionContext,
          "asset2"
        );
        assert.fail("GetEMRByPatientId should have failed");
      } catch (err) {
        expect(err.message).to.equal("The EMR asset2 does not exist");
      }
    });

    // it("should return success on ReadAsset", async () => {
    //   let assetTransfer = new AssetTransfer();
    //   await assetTransfer.CreateAsset(
    //     transactionContext,
    //     asset.ID,
    //     asset.Color,
    //     asset.Size,
    //     asset.Owner,
    //     asset.AppraisedValue
    //   );

    //   let ret = JSON.parse(await chaincodeStub.getState(asset.ID));
    //   expect(ret).to.eql(asset);
    // });
  });
});
