export interface FormatEmailDto {
  subject: string;
  text: string;
  //for html
  title: string;
  desc: string;
  buttonLabel: string;
}

export function formatEmailVerifyTrucker(
  lang: string,
  userName: string,
  companyName: string,
  link: string
): FormatEmailDto {
  const format: FormatEmailDto = {
    subject: "",
    text: "",
    title: "",
    desc: "",
    buttonLabel: "",
  };
  if (lang === "es") {
    return {
      subject: "Verificación de camionero - CrashSaverapp",
      text: `Por favor, haz clic en el siguiente enlace: ${link}`,
      title: `Saludos, ${userName}`,
      desc: `Para verificarte como camionero de la compañía <b>${companyName}</b>, haz click en el siguiente botón`,
      buttonLabel: "Verificar",
    };
  } else if (lang === "en") {
    return {
      subject: "Truck Driver Verification - CrashSaverapp",
      text: `Please, click on the following link: ${link}`,
      title: `Greetings, ${userName}`,
      desc: `To verify yourself as a truck driver for the company <b>${companyName}</b>, please click on the following button`,
      buttonLabel: "Verify",
    };
  } else if (lang === "fr") {
    return {
      subject: "Vérification de chauffeur de camion - CrashSaverapp",
      text: `Veuillez cliquer sur le lien suivant : ${link}`,
      title: `Salutations, ${userName}`,
      desc: `Pour vous vérifier comme chauffeur de camion pour l'entreprise <b>${companyName}</b>, veuillez cliquer sur le bouton suivant`,
      buttonLabel: "Vérifier",
    };
  }
  return format;
}
