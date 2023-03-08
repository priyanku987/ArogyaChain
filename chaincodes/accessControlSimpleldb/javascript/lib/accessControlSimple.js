// Fabric smart contract classes
const { Contract, Context } = require("fabric-contract-api");

class AccessRecord extends Contract {
  // init the Ledger

  async InitLedger(ctx) {
    const accessRecords = [
      {
        Id: "1kwd13",
        Type: "ACCESS-GRANT-REVOKE",
        Operation: "GRANT_ACCESS",
        EHRId: "demo",
        PerformedBy: "demo",
        PerformedFor: "demo",
        Date: new Date().getTime(),
      },
    ];
    for (const accessRecord of accessRecords) {
      await ctx.stub.putState(
        accessRecord?.Id,
        Buffer.from(JSON.stringify(accessRecord))
      );
      console.info(`Access Record ${accessRecord.Id} initialized`);
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

  async GetAllResultLeveldb(ctx) {
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let results = await this._GetAllResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  // GrantAccess grants access to a particular identity.
  async GrantAccess(ctx, id, ehrId, performedBy, performedFor) {
    const accessRecord = {
      Id: id,
      Type: "ACCESS-GRANT-REVOKE",
      Operation: "GRANT_ACCESS",
      EHRId: ehrId,
      PerformedBy: performedBy,
      PerformedFor: performedFor,
      Date: new Date().getTime(),
    };
    await ctx.stub.putState(
      accessRecord?.Id,
      Buffer.from(JSON.stringify(accessRecord))
    );
    return JSON.stringify(accessRecord);
  }

  // RevokeAccess revoke access from a particular identity.
  async RevokeAccess(ctx, id, ehrId, performedBy, performedFor) {
    const accessRecord = {
      Id: id,
      Type: "ACCESS-GRANT-REVOKE",
      Operation: "REVOKE_ACCESS",
      EHRId: ehrId,
      PerformedBy: performedBy,
      PerformedFor: performedFor,
      Date: new Date().getTime(),
    };
    await ctx.stub.putState(
      accessRecord?.Id,
      Buffer.from(JSON.stringify(accessRecord))
    );
    return JSON.stringify(accessRecord);
  }

  // GetAccessList retrieves the access list for the person who is now invoking this contract.
  async GetAccessListForInvoker(ctx) {
    const invokerIdentityX509 = await ctx.clientIdentity.getID();
    const invokerDN = this._extractSubjectDN(invokerIdentityX509);
    const invoker =
      this._extractCommonNameFromX509SubjectIdentityString(invokerDN);

    const results = await this.GetAllResultLeveldb(ctx);
    let formattedResults = [];
    if (typeof results === "object") {
      formattedResults = results;
    } else {
      formattedResults = JSON.parse(results);
    }
    formattedResults = formattedResults?.map((res) => {
      return res?.Record;
    });

    //filter the results
    const filteredResults = formattedResults?.filter((record) => {
      return (
        record?.PerformedFor === invoker &&
        record?.Type === "ACCESS-GRANT-REVOKE" &&
        record?.Operation === "GRANT_ACCESS"
      );
    });

    //sort by date
    const sortedResults = filteredResults?.sort((a, b) => {
      return Number(b.Date) - Number(a.Date);
    });
    //returns JSON data
    return sortedResults;
  }

  async GetAccessListByPerformedByAndPerformedFor(
    ctx,
    performedBy,
    performedFor
  ) {
    const results = await this.GetAllResultLeveldb(ctx);
    let formattedResults = [];
    if (typeof results === "object") {
      formattedResults = results;
    } else {
      formattedResults = JSON.parse(results);
    }
    formattedResults = formattedResults?.map((res) => {
      return res?.Record;
    });

    // filter the results
    const filteredResults = formattedResults?.filter((record) => {
      return (
        record?.PerformedBy === performedBy &&
        record?.PerformedFor === performedFor
      );
    });
    //sort by date
    const sortedResults = filteredResults?.sort((a, b) => {
      return Number(b.Date) - Number(a.Date);
    });
    //returns JSON data
    return sortedResults;
  }
}

module.exports = AccessRecord;
