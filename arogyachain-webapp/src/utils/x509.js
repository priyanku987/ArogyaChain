import crypto from "crypto";

function extractUserIdentity(certificate, privateKey) {
  const pemFormattedCertificate = certificate?.replace(/\\n/g, "\n");
  const pemFormattedPrivateKey = privateKey?.replace(/\\r\\n|\\n/g, "\n");
  const x509Cert = new crypto?.X
}
