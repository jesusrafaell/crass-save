import nodemailer from "nodemailer";
import transporterConfig from "../../infra/transporterConfig";

const verifyURL = process.env.VERIFY_APP as string;

class VerificationEmailService {
  private readonly transporter = nodemailer.createTransport(transporterConfig);

  private getTemaplete(link: string) {
    return `
    <p>
      Por favor, haz clic en el siguiente enlace para verificar tu registro: <a href="${link}">aqui</a>
    </p>
    `;
  }

  public async sendVerificationEmail(
    to: string,
    verificationToken: string,
  ): Promise<void> {
    const link = `${verifyURL}/verify/${verificationToken}`;
    try {
      //body email
      const html = this.getTemaplete(link);
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: "Verificación de registro - CrashSaverapp",
        text: `Por favor, haz clic en el siguiente enlace para verificar tu registro: ${link}`,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }
}

export default VerificationEmailService;
