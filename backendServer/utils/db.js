const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

module.exports = open({
  filename: path.join(__dirname, "..", "db", "main.db"),
  driver: sqlite3.cached.Database,
}).then(async (db) => {
  const adhharVerificationTable =
    db.run(`CREATE TABLE IF NOT EXISTS "uidai_aadhaar_verifications" (
    "id" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "verified_at" DATETIME,
    PRIMARY KEY("id")
  );`);

  await Promise.all([cpTable, connectorsTable, transactionsTable]);

  return db;
});
