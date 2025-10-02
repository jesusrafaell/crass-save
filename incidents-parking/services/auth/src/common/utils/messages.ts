export const getLangEmailVerifyMessage = (
  email: string,
  lang: "es" | "en" | "fr" = "es"
): string => {
  if (lang === "en") return `The verification link was sent to ${email}`;
  if (lang === "fr") return `Le lien de vérification a été envoyé à ${email}`;

  return `Se ha enviado a ${email} el enlace con la verificación`;
};
