import nodemailer from "nodemailer";
import transporterConfig from "../../config/transporterConfig";
import { formatEmailVerifyTrucker } from "../../../../common/utils/verifyTruckerLang";

const verifyURL = process.env.VERIFY_APP as string;

export interface MailDto {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface HTMLProps {
  title: string;
  description: string;
  button: {
    label: string;
    href: string;
  };
}

class VerificationEmailService {
  private readonly transporter = nodemailer.createTransport(transporterConfig);

  public async sendMail({ to, subject, text, html }: MailDto) {
    try {
      //body email
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }

  public async sendVerificationEmail(
    to: string,
    verificationToken: string
  ): Promise<void> {
    try {
      const link = `${verifyURL}/verify/${verificationToken}`;

      const text = `Por favor, haz clic en el siguiente enlace para verificar tu registro: ${link}`;
      const subject = "Verificación de registro - CrashSaverapp";
      const html = this.getTemplateByParams({
        title: "Saludos,",
        description: `Para verificar tu cuenta, haz click en el siguiente botón`,
        button: {
          label: "Verificar cuenta",
          href: link,
        },
      });

      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_FROM,
        to,
        text,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }

  public async sendVerificationTrucker(
    to: string,
    verificationToken: string,
    lang: string,
    companyName: string,
    userName: string
  ): Promise<void> {
    try {
      const link = `${verifyURL}/verify-trucker?token=${verificationToken}`;

      const format = formatEmailVerifyTrucker(
        lang,
        userName,
        companyName,
        link
      );

      const html = this.getTemplateByParams({
        title: format.title,
        description: format.desc,
        button: {
          label: format.buttonLabel,
          href: link,
        },
      });

      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: format.subject,
        text: format.text,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }

  public getTemplateByParams({ title, description, button }: HTMLProps) {
    return `
      <table align="center" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 10px;">
            <b style="font-size: 20px;">${title}</b>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px;">
            ${description}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px;">
            <a target="_blank" rel="nofollow noopener" href="${button.href}" style="padding: 10px; border-radius: 8px; background-color: rgb(233, 2, 175); color: #FFF; text-decoration: none;">
              ${button.label}
            </a>
          </td>
        </tr>
      </table>
    `;
  }
}

export default VerificationEmailService;
