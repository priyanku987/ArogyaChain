// Fabric smart contract classes
const { Contract, Context } = require("fabric-contract-api");

class MedicalRecord extends Contract {
  // init the Ledger

  async InitLedger(ctx) {
    const emrs = [
      {
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
        PatientAge: 0,
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
      },
    ];
    for (const emr of emrs) {
      await ctx.stub.putState(emr.Id, Buffer.from(JSON.stringify(emr)));
      console.info(`EMR ${emr.Id} initialized`);
    }
  }

  // This is JavaScript so without Funcation Decorators, all functions are assumed
  // to be transaction functions
  //
  // For internal functions... prefix them with _
  async _GetAllResults(iterator, isHistory) {
    let allResults = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString("utf8"));
        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.txId;
          jsonRes.Timestamp = res.value.timestamp;
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString("utf8");
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString("utf8");
          }
        }
        allResults.push(jsonRes);
      }
      res = await iterator.next();
    }
    iterator.close();
    return allResults;
  }

  // GetQueryResultForQueryString executes the passed in query string.
  // Result set is built and returned as a byte array containing the JSON results.
  async GetQueryResultForQueryString(ctx, queryString) {
    let resultsIterator = await ctx.stub.getQueryResult(queryString);
    let results = await this._GetAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // createMedicalRecord issues a new EMR to the world state with given details.
  async CreateMedicalRecord(
    ctx,
    id,
    type,
    owner,
    issuedBy,
    consultingDoctorId,
    consultingDoctorName,
    consultingDoctorRegisteredNumber,
    hospitalId,
    hospitalName,
    hospitalRegisteredNumber,
    createdBy,
    updatedBy,
    patientId,
    patientName,
    patientAge,
    patientAddress,
    patientCountry,
    patientState,
    patientCity,
    patientDistrict,
    patientVillage,
    patientZipcode,
    patientEmail,
    patientPhoneNumbers,
    patientAttendantName,
    patientAttendantRelation,
    diseaseName,
    diseaseDescription,
    diseaseSeverity,
    prescribedMedicines,
    suggesstions,
    testsRecommended
  ) {
    const emr = {
      Id: id,
      Type: type,
      Owner: owner,
      IssuedBy: issuedBy,
      ConsultingDoctorID: consultingDoctorId,
      ConsultingDoctorName: consultingDoctorName,
      ConsultingDoctorRegisteredNumber: consultingDoctorRegisteredNumber,
      HospitalId: hospitalId,
      HospitalName: hospitalName,
      HospitalRegisteredNumber: hospitalRegisteredNumber,
      IssueDate: new Date(),
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      CreatedBy: createdBy,
      UpdatedBy: updatedBy,
      PatientId: patientId,
      PatientName: patientName,
      PatientAge: patientAge,
      PatientAddress: patientAddress,
      PatientCountry: patientCountry,
      PatientState: patientState,
      PatientCity: patientCity,
      PatientDistrict: patientDistrict,
      PatientVillage: patientVillage,
      PatientZipcode: patientZipcode,
      PatientEmail: patientEmail,
      PatientPhoneNumbers: patientPhoneNumbers,
      PatientAttendantName: patientAttendantName,
      PatientAttendantRelation: patientAttendantRelation,
      DiseaseName: diseaseName,
      DiseaseDescription: diseaseDescription,
      SeverityOfDisease: diseaseSeverity,
      MedicinesPrescribed: prescribedMedicines,
      Suggesstions: suggesstions,
      TestsRecommended: testsRecommended,
    };
    await ctx.stub.putState(emr.Id, Buffer.from(JSON.stringify(emr)));
    // Also create an access grant transaction
    return JSON.stringify(emr);
  }

  // GetEMRSByPatientId returns EMRs based on Patient Id.
  async GetEMRByPatientId(ctx, patientId) {
    //get client identity
    const invokerIdentity = await ctx.stub.getID();
    if (invokerIdentity === patientId) {
      let queryString = {};
      queryString.selector = {};
      queryString.selector.PatientId = patientId;
      queryString.selector.Type = "PRESCRIPTION";
      const results = await this.GetQueryResultForQueryString(
        ctx,
        JSON.stringify(queryString)
      );
      return results;
    } else {
      //check whether the entity invoking this have the access to the resource
      let queryString1 = {};
      queryString1.selector = {};
      queryString1.selector.Type = "ACCESS-GRANT-REVOKE";
      queryString1.selector.PerformedBy = patientId;
      queryString1.selector.PerformedFor = invokerIdentity;
      queryString1.sort = [{ Date: "desc" }];
      const results1 = await this.GetQueryResultForQueryString(
        ctx,
        JSON.stringify(queryString1)
      );
      if (results1.length === 0) {
        return []; // need to through errror saying this invoker has no access to any o the patients EMRs
      } else {
        if (results1[0].Operation === "GRANT_ACCESS") {
          let queryString2 = {};
          queryString2.selector = {};
          queryString2.selector.Type = "PRESCRIPTION";
          queryString2.selector.PatientId = patientId;
          const results2 = await this.GetQueryResultForQueryString(
            ctx,
            JSON.stringify(queryString2)
          );
          return results2;
        } else {
          return []; // need to through errror saying this invoker has no access to any o the patients EMRs
        }
      }
    }
  }
}

module.exports = MedicalRecord;
