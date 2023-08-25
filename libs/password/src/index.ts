import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import invariant from "tiny-invariant";

const SEPARATOR = ".";

export async function generatePasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${await hashPassword(password, salt)}${SEPARATOR}${salt}`;
}

export async function isSamePassword(password: string, hash: string) {
  const [hashedPassword, salt] = hash.split(SEPARATOR);

  invariant(
    hashedPassword != null,
    `Can't compare password without a hashed password. Got '${hashedPassword}'`
  );
  invariant(
    salt != null && salt !== "",
    `Can't compare password without a salt. Got '${salt}'`
  );

  return timingSafeEqual(
    Buffer.from(hashedPassword),
    Buffer.from(await hashPassword(password, salt))
  );
}

async function hashPassword(password: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    scrypt(
      password,
      salt,
      64,
      {
        cost: 2 << 16,
        maxmem: 32 * 16 * 1024 * 1024,
      },
      (error, result) => {
        if (error == null) {
          resolve(result.toString("hex"));
        } else {
          reject(error);
        }
      }
    );
  });
}
