export function generateSecurePassword(length: number): string {
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = ",.*&-+&";
  const allChars = lowerCase + upperCase + numbers + specialChars;

  let password = "";
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  for (let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}
