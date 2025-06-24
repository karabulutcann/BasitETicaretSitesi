import bcrypt from "bcrypt";

const saltRounds = 10; // Number of salt rounds for bcrypt

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

