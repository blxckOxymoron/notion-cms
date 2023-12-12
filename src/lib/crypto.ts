import "server-only";

// https://github.com/bradyjoslin/webcrypto-example/blob/master/script.js

const bufferToBase64 = (buff: ArrayBuffer) =>
  btoa(new Uint8Array(buff).reduce((data, byte) => data + String.fromCharCode(byte), ""));

const base64ToBuffer = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

async function getKey(salt: Pbkdf2Params["salt"], usage: KeyUsage[]) {
  if (!process.env.TOKEN_ENCRYPTION_KEY) throw new Error("Missing TOKEN_ENCRYPTION_KEY");

  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.TOKEN_ENCRYPTION_KEY),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 50_000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    usage
  );
}

export async function encrypt(data: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await getKey(salt, ["encrypt"]);

  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    new TextEncoder().encode(data)
  );

  const encryptedContentArr = new Uint8Array(encryptedContent);

  const buff = new Uint8Array(salt.byteLength + iv.byteLength + encryptedContentArr.byteLength);
  buff.set(salt, 0);
  buff.set(iv, salt.byteLength);
  buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);

  return bufferToBase64(buff);
}

export async function decrypt(data: string) {
  const buffer = base64ToBuffer(data);

  const salt = buffer.subarray(0, 16);
  const iv = buffer.subarray(16, 16 + 12);
  const encrypted = buffer.subarray(16 + 12);

  const key = await getKey(salt, ["decrypt"]);

  const content = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encrypted
  );

  return new TextDecoder().decode(content);
}
