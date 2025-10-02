import nodemailer from "nodemailer";
import transporterConfig from "../../config/transporterConfig";

const verifyURL = process.env.VERIFY_APP as string;

class ForgotPasswordEmailService {
  private readonly transporter = nodemailer.createTransport(transporterConfig);

  private getTemaplete(link: string) {
    return `
    <p>
      <b>Saludos,</b>
      <br/>
      <p>
        Ha solicitado un cambio de contraseña. Para cambiar su contraseña, haga clic: <a href="${link}">aqui</a>
      </p>
    </p>
    `;
  }

  public async sendMailFogotPassword(
    to: string,
    verificationToken: string
  ): Promise<void> {
    const link = `${verifyURL}/change-password/${verificationToken}`;
    try {
      //body email
      const html = this.getTemaplete(link);
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: "Recuperar Contraseña - CrashSaverapp",
        text: `Ha solicitado un cambio de contraseña. Para cambiar su contraseña, haga clic: ${link}`,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }
}

export default ForgotPasswordEmailService;
