import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporterConfig: SMTPTransport.Options = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, //it's true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export default transporterConfig;
