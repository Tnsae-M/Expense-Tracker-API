//here is where password is hashed
import bcryptjs from "bcryptjs";

const salt_round = 12;
export async function hashPassword(password: string) {
  return await bcryptjs.hash(password, salt_round);
}
