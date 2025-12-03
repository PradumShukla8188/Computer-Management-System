import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const SECRET_KEY: string =
  process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || "secret-key";

export function storeEncryptedCookie(keyName: string, data: object) {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();

    Cookies.set(keyName, encryptedData, {
      expires: 365,
      secure: process.env.NEXT_PUBLIC_ENV === "PRODUCTION",
      sameSite: "Strict",
      path: "/",
    });
  } catch (err) {
    console.log("Err- in cookie<.", err);
  }
}

export function getDecryptedData(keyName: string) {
  const cipherText: string = Cookies.get(keyName) || "";
  try {
    if (cipherText) {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);

      const fetchData = bytes.toString(CryptoJS.enc.Utf8);

      return JSON.parse(fetchData);
    } else {
      throw new Error("some error");
    }
  } catch (err) {
    console.log("err in decrypted=>", err);
    return {};
  }
}

export function getServerSideDecryption(cipherText: string | undefined) {
  try {
    if (!cipherText) {
      throw new Error("Cipher text is undefined or empty.");
    }

    // Decrypt the cipher text using AES and the provided secret key
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);

    // Convert the decrypted bytes to a UTF-8 string
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    // If the decrypted data is empty, it indicates an issue
    if (!decryptedData) {
      throw new Error("Decryption failed or data is not a valid UTF-8 string.");
    }

    // Parse the JSON if it's valid
    try {
      return JSON.parse(decryptedData);
    } catch {
      throw new Error(
        "Failed to parse decrypted data as JSON: "
      );
    }
  } catch (err) {
    console.log("Error in getServerSideDecryption:", String(err));
    return {}; // Return an empty object on failure
  }
}

export function removeEncryptedCookie(keyName: string) {
  if (Cookies.get(keyName)) {
    Cookies.remove(keyName);
  }
}
