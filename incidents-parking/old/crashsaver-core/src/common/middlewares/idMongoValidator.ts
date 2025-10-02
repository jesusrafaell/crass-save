import listCodeErrors from "./listCodeErrors";

export const idMongoValidatgor = (value: string) => {
  const regex = /^[0-9a-fA-F]{24}$/;
  if (!regex.test(value)) {
    throw new Error(listCodeErrors.invalidIdMongo.code);
  }
  return true;
};
