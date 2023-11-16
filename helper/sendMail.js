require("dotenv").config();
// sending mail using API keys
const brevo = require("@getbrevo/brevo");

// For sending mail using SMTP server
// const smtpServer = process.env.SMTP_SERVER; //smtp server
// const smtpPort = process.env.SMTP_PORT; // port 
// const smtpPass = process.env.SMTP_PASS; //password
const smtpUser = process.env.SMTP_USER; // sender email
const apiKey_VALUE = process.env.BREVO_API_KEY;

// const senderUserName = "IGIT MCA Commmunity";

let defaultClient = brevo.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = apiKey_VALUE;

let apiInstance = new brevo.TransactionalEmailsApi();
let sendSmtpEmail = new brevo.SendSmtpEmail();


//  this mail is going to be sent User who newly registered
const emailNewUser = async (
  email,
  userName,
  adminEmail,
  batchAdminEmail
) => {
  try {
    sendSmtpEmail.subject = "Account created!";
    sendSmtpEmail.htmlContent = `
    <html>
        <body>
            <p>
                Dear ${userName}, 
                thank you for registering to IGIT MCA Community. Complete your profile by updating your other profile details by clicking on the profile icon.
                We will let you know when Our admin verify your account.
                <br />
                You can get all study materials & including question, notices in our community website. You can also better learn about your classmates, seniors & juniors as well there.
                <br />
                Happy coding :)
                Have good day!
            </p>
            <br />
            <p>
            Learn more about us at <a href="https://igit-mca.vercel.app">https://igit-mca.vercel.app</a>
            </p>
        </body>
    </html>`;
    sendSmtpEmail.sender = {
      // name: senderUserName,
      email: `${smtpUser}`,
    };
    sendSmtpEmail.to = [
      {
        email: email,
        // name: userName
      },
    ];
    // sendSmtpEmail.replyTo = { email: smtpUser, name: senderUserName }; // send email to admin & thier batch mates
    sendSmtpEmail.headers = { "create account email": email };
    sendSmtpEmail.params = {
      parameter: "Send email to user.",
      subject: "New account created!",
    };
    const { messageId } = await apiInstance.sendTransacEmail(sendSmtpEmail);
    if (!messageId) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error in sendAccountVerifiedMail function : ", error);
    return false;
  }
};

// email user when one user account get verified
const sendAccountVerifiedMail = async (email, userName) => {
  try {
    sendSmtpEmail.subject = "Account verified!";
    sendSmtpEmail.htmlContent = `
    <html>
        <body>
            <p>
                Dear ${userName}, 
                Congratulations! You are now a verified member of IGIT MCA Community. Thank you for being part of the MCA community.
                <br />
                You can get all study materials & including question, notices in our community website. You can also better learn about your classmates, seniors & juniors as well there.
                <br />
                Happy coding :)
                Have good day!
            </p>
            <br />
            <p>
              Learn more about us at <a href="https://igit-mca.vercel.app">https://igit-mca.vercel.app</a>
            </p>
        </body>
    </html>
    `;
    sendSmtpEmail.sender = {
      // name: senderUserName,
      email: `${smtpUser}`,
    };
    sendSmtpEmail.to = [
      {
        email: email,
        // name: userName
      },
    ];

    sendSmtpEmail.headers = { "Account verified": email };
    sendSmtpEmail.params = {
      parameter: "Send email to user.",
      subject: "Account verified!",
    };
    const { messageId } = apiInstance.sendTransacEmail(sendSmtpEmail);
    if (!messageId) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error in sendAccountVerifiedMail function : ", error);
    return false;
  }
};


// email admin when a new user registers for the first time
const emailAdminNewUserRegistered = async (adminEmail, userDetails) => {
  try {
    const { batch, email, name } = userDetails;
    sendSmtpEmail.subject = "New user registered!";
    sendSmtpEmail.htmlContent = `
    <html>
        <body>
            <p>
                Dear Admin, 
                Someone with following details has been newly registered to Igit-Mca-community.
            </p>
            <br />
            <p>
              Name : ${name} <br/>
              Email : ${email} <br/>
              Batch : ${batch} 
            </p>
            <br />
            <p>
              Visit & verify user <a href="https://igit-mca.vercel.app">https://igit-mca.vercel.app/admin/user</a>
            </p>
        </body>
    </html> 
    `;
    sendSmtpEmail.sender = {
      // name: senderUserName,
      email: `${smtpUser}`,
    };
    sendSmtpEmail.to = [
      {
        email: adminEmail,
      },
    ];
    sendSmtpEmail.headers = { "New user": email };
    sendSmtpEmail.params = {
      parameter: "Notify email to Admin.",
      subject: "New user registered!",
    };
    const { messageId } = await apiInstance.sendTransacEmail(sendSmtpEmail);
    if (!messageId) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("error in emailAdminNewUserRegistered function : ", error);
    return false;
  }
};
module.exports = {
  emailNewUser,
  sendAccountVerifiedMail,
  emailAdminNewUserRegistered,
};
