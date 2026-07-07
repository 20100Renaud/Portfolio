import crypto from "crypto";

const HMAC_KEY = Buffer.from(process.env.EMAIL_HASH_KEY, "hex");
const ENCRYPTION_KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY, "hex");

// HMAC-SHA256
export function hmacEmail(email) {
  return crypto
    .createHmac("sha256", HMAC_KEY)
    .update(email)
    .digest("hex");
}

// AES-256-GCM
export function encryptEmail(email) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(email, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

// Déchiffrement
export function decryptEmail(data) {
  const [ivHex, tagHex, encryptedHex] = data.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    ENCRYPTION_KEY,
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}