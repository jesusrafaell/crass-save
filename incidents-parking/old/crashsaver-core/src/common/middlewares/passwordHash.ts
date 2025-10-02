import bcrypt from "bcrypt";
const saltRounds = 10;

const passwordHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export default passwordHash;
