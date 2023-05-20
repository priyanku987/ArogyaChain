const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.sendEnrollmentSecretMail = async (toAddress, secret) => {
  const msg = {
    to: toAddress, // Change to your recipient
    from: "u19csel2083@cit.ac.in", // Change to your verified sender
    subject: "Your ArogyaChain Enrollment Secret",
    text: `Hello User, your Enrollment Secret is: ${secret}. Please don't share this secret with anyone!`,
    html: `Hello User, your Enrollment Secret is: <strong>${secret}</strong>.</br> Please donot share this secret with anyone!`,
  };
  await sgMail.send(msg);
};

module.exports.sendCredentialsMail = async (toAddress, base64Zip) => {
  const msg = {
    to: toAddress, // Change to your recipient
    from: "u19csel2083@cit.ac.in", // Change to your verified sender
    subject: "Your ArogyaChain Credentials",
    text: `Hello User, your ArogyaChain Credentials are attached here in a zip. Please don't share your Private Key with anyone!`,
    html: `Hello User, your ArogyaChain Credentials are attached here in a zip. </br>Please <strong>don't share your Private Key</strong> with anyone!`,
    attachments: [
      {
        content: base64Zip,
        filename: "credentials.zip",
        type: "application/zip",
        disposition: "attachment",
      },
    ],
  };
  await sgMail.send(msg);
};
