import "server-only";
import crypto from "crypto";

const algorithm = "aes-256-ctr";

export function encrypt(data: string) {
  if (!process.env.TOKEN_ENCRYPTION_KEY) throw new Error("Missing TOKEN_ENCRYPTION_KEY");
  const iv = crypto.randomBytes(16);

  const cypher = crypto.createCipheriv(algorithm, process.env.TOKEN_ENCRYPTION_KEY, iv);

  const encrypted = Buffer.concat([cypher.update(data), cypher.final()]);

  return Buffer.concat([iv, encrypted]).toString("base64");
}

export function decrypt(data: string) {
  if (!process.env.TOKEN_ENCRYPTION_KEY) throw new Error("Missing TOKEN_ENCRYPTION_KEY");
  const buffer = Buffer.from(data, "base64");

  const iv = buffer.subarray(0, 16);
  const encrypted = buffer.subarray(16);

  const cypher = crypto.createDecipheriv(algorithm, process.env.TOKEN_ENCRYPTION_KEY, iv);

  const decrypted = Buffer.concat([cypher.update(encrypted), cypher.final()]);

  return decrypted.toString();
}
