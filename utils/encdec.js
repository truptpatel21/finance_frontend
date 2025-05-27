import { createCipheriv, createDecipheriv } from "crypto";

const crypto = require("crypto");
const encryptionKey = process.env.NEXT_PUBLIC_KEY || "xza548sa3vcr641b5ng5nhy9mlo64r6k"; 
const encryptionIV = process.env.NEXT_PUBLIC_IV || "5ng5nhy9mlo64r6k"; 

export function encrypt(data) {
  if (!encryptionKey || !encryptionIV) {
    throw new Error("Encryption key or IV is missing.");
  }

  const key = Buffer.from(encryptionKey, "utf8");
  const iv = Buffer.from(encryptionIV, "utf8");

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
}
  
export function  decrypt(data) {
  try {
    if (!data || typeof data !== 'string') {
      console.error('Invalid input: Data is empty or not a string');
      return JSON.stringify({});
    }

    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (!base64Regex.test(data)) {
      console.error('Invalid input: Data is not valid base64');
      return JSON.stringify({});
    }

    if (!encryptionKey || !encryptionIV) {
      throw new Error('Encryption key or IV is missing.');
    }

    const key = Buffer.from(encryptionKey, 'utf8');
    const iv = Buffer.from(encryptionIV, 'utf8');

    if (key.length !== 32) {
      throw new Error(`Invalid key length: ${key.length}, expected 32 bytes`);
    }
    if (iv.length !== 16) {
      throw new Error(`Invalid IV length: ${iv.length}, expected 16 bytes`);
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption Error:', error.message);
    return JSON.stringify({});
  }
}