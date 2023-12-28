package com.io.saas.util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.Mac;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Hex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CryptoUtils {
	private static final Logger logger = LoggerFactory.getLogger(CryptoUtils.class);
	private final static String AES_ALGORITHM = "AES";
	private final static String UTF8_CHARSET_NAME = "UTF-8";

	private static Cipher cipher;

	static {
		try {
			cipher = Cipher.getInstance(AES_ALGORITHM);
		} catch (NoSuchAlgorithmException e) {
			logger.error(e.getMessage());
		} catch (NoSuchPaddingException e) {
			logger.error(e.getMessage());
		}
	}

	public static String hmacSha256(String data, String key) throws NoSuchAlgorithmException, InvalidKeyException {
		Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
		SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA256");
		sha256_HMAC.init(secretKey);
		String hash = Hex.encodeHexString(sha256_HMAC.doFinal(data.getBytes()));
		return hash;
	}

	public static String encryptAES(String value, String key) throws NoSuchAlgorithmException, NoSuchPaddingException,
			UnsupportedEncodingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
		synchronized (cipher) {
			SecretKeySpec sKey = new SecretKeySpec(key.getBytes(UTF8_CHARSET_NAME), AES_ALGORITHM);
			cipher.init(Cipher.ENCRYPT_MODE, sKey);

			return Base64.getEncoder().encodeToString(cipher.doFinal(value.getBytes(UTF8_CHARSET_NAME)));
		}
	}

	public static String decryptAES(String base64Value, String key)
			throws NoSuchAlgorithmException, NoSuchPaddingException, UnsupportedEncodingException, InvalidKeyException,
			IllegalBlockSizeException, BadPaddingException {
		synchronized (cipher) {
			SecretKeySpec sKey = new SecretKeySpec(key.getBytes(UTF8_CHARSET_NAME), AES_ALGORITHM);
			// Cipher cp = Cipher.getInstance(AES_ALGORITHM);
			cipher.init(Cipher.DECRYPT_MODE, sKey);

			return new String(cipher.doFinal(Base64.getDecoder().decode(base64Value)), UTF8_CHARSET_NAME);
		}
	}

	public static String sha256(String input) throws NoSuchAlgorithmException {
		MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
		return bytesToHex(sha256.digest(input.getBytes()));

	}

	private static String bytesToHex(byte[] hashInBytes) {
		StringBuffer hexString = new StringBuffer();
		for (int i = 0; i < hashInBytes.length; i++) {
			String hex = Integer.toHexString(0xff & hashInBytes[i]);
			if (hex.length() == 1)
				hexString.append('0');
			hexString.append(hex);
		}
		return hexString.toString();
	}

}
