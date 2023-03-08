// Fabric smart contract classes
const { Contract, Context } = require("fabric-contract-api");

class MedicalRecord extends Contract {
  // init the Ledger

  async InitLedger(ctx) {
    const emrs = [
      {
        Id: "1xasaDE",
        Type: "PRESCRIPTION",
        Owner: "demo", // Patient's Adhaar Id
        IssuedBy: "mohfw", //Doctors Adhaar Id
        ConsultingDoctorID: "mohfw", //Doctors Adhaar Id
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
        PatientId: "demo", // Patient's Adhaar Id
        PatientName: "demo",
        PatientAge: 20,
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

  _extractCommonNameFromX509SubjectIdentityString(subjectIdentityString) {
    const parts = subjectIdentityString.split("/");
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith("CN=")) {
        return parts[i].substring(3);
      }
    }
    return null;
  }

  _extractSubjectDN(identityString) {
    const parts = identityString?.split("::");
    return parts[1];
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
      IssueDate: new Date().getTime(),
      CreatedAt: new Date().getTime(),
      UpdatedAt: new Date().getTime(),
      CreatedBy: createdBy,
      UpdatedBy: updatedBy,
      PatientId: patientId,
      PatientName: patientName,
      PatientAge: parseInt(patientAge),
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
  async GetEMRByPatientId(ctx, patientId, accessControlChaincodeName) {
    //get client identity
    const invokerIdentityX509 = await ctx.clientIdentity.getID();
    const invokerDN = this._extractSubjectDN(invokerIdentityX509);
    const invokerIdentity =
      this._extractCommonNameFromX509SubjectIdentityString(invokerDN);
    if (invokerIdentity === patientId) {
      let queryString = {};
      queryString.selector = {};
      queryString.selector.PatientId = patientId;
      queryString.selector.Type = "PRESCRIPTION";
      let results = await this.GetQueryResultForQueryString(
        ctx,
        JSON.stringify(queryString)
      );
      if (typeof results === "string") {
        results = JSON.parse(results);
      }
      return results;
    } else {
      // Invoke the acces control smart contract and fetch access results
      const accessControlResponse = await ctx.stub.invokeChaincode(
        accessControlChaincodeName,
        [
          "GetAccessListByPerformedByAndPerformedFor",
          patientId,
          invokerIdentity,
        ],
        "arogyaehrchannel"
      );
      const stringResponse = accessControlResponse.payload.toString("utf8");
      const accessControlJSONResults = JSON.parse(stringResponse);
      if (accessControlJSONResults.length === 0) {
        return []; // need to through errror saying this invoker has no access to any o the patients EMRs
      } else {
        //assuming that the results are in sorted order in descending, means latest record comes in first
        if (accessControlJSONResults[0].Operation === "GRANT_ACCESS") {
          let queryString2 = {};
          queryString2.selector = {};
          queryString2.selector.Type = "PRESCRIPTION";
          queryString2.selector.PatientId = patientId;
          let results2 = await this.GetQueryResultForQueryString(
            ctx,
            JSON.stringify(queryString2)
          );
          if (typeof results2 === "string") {
            results2 = JSON.parse(results2);
          }
          return results2;
        } else {
          return []; // need to through errror saying this invoker has no access to any o the patients EMRs
        }
      }
    }
  }
}

module.exports = MedicalRecord;
