package com.io.saas.util;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

public class Utils {
	private static final char[] SOURCE_CHARACTERS = {'À', 'Á', 'Â', 'Ã', 'È', 'É',
			'Ê', 'Ì', 'Í', 'Ò', 'Ó', 'Ô', 'Õ', 'Ù', 'Ú', 'Ý', 'à', 'á', 'â',
			'ã', 'è', 'é', 'ê', 'ì', 'í', 'ò', 'ó', 'ô', 'õ', 'ù', 'ú', 'ý',
			'Ă', 'ă', 'Đ', 'đ', 'Ĩ', 'ĩ', 'Ũ', 'ũ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ạ',
			'ạ', 'Ả', 'ả', 'Ấ', 'ấ', 'Ầ', 'ầ', 'Ẩ', 'ẩ', 'Ẫ', 'ẫ', 'Ậ', 'ậ',
			'Ắ', 'ắ', 'Ằ', 'ằ', 'Ẳ', 'ẳ', 'Ẵ', 'ẵ', 'Ặ', 'ặ', 'Ẹ', 'ẹ', 'Ẻ',
			'ẻ', 'Ẽ', 'ẽ', 'Ế', 'ế', 'Ề', 'ề', 'Ể', 'ể', 'Ễ', 'ễ', 'Ệ', 'ệ',
			'Ỉ', 'ỉ', 'Ị', 'ị', 'Ọ', 'ọ', 'Ỏ', 'ỏ', 'Ố', 'ố', 'Ồ', 'ồ', 'Ổ',
			'ổ', 'Ỗ', 'ỗ', 'Ộ', 'ộ', 'Ớ', 'ớ', 'Ờ', 'ờ', 'Ở', 'ở', 'Ỡ', 'ỡ',
			'Ợ', 'ợ', 'Ụ', 'ụ', 'Ủ', 'ủ', 'Ứ', 'ứ', 'Ừ', 'ừ', 'Ử', 'ử', 'Ữ',
			'ữ', 'Ự', 'ự',};

	private static final char[] DESTINATION_CHARACTERS = {'A', 'A', 'A', 'A', 'E',
			'E', 'E', 'I', 'I', 'O', 'O', 'O', 'O', 'U', 'U', 'Y', 'a', 'a',
			'a', 'a', 'e', 'e', 'e', 'i', 'i', 'o', 'o', 'o', 'o', 'u', 'u',
			'y', 'A', 'a', 'D', 'd', 'I', 'i', 'U', 'u', 'O', 'o', 'U', 'u',
			'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A',
			'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'A', 'a', 'E', 'e',
			'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E',
			'e', 'I', 'i', 'I', 'i', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o',
			'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O', 'o', 'O',
			'o', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u',
			'U', 'u', 'U', 'u',};
	private static SecureRandom random = new SecureRandom();

	public static boolean validateAmountBigDecimal(BigDecimal amount) {
		if (amount == BigDecimal.ZERO || amount.compareTo(BigDecimal.ZERO) <= 0) {
			return false;
		}
		return true;
	}

	public static String generateRandomString(int numberCharacter) {
		return RandomStringUtils.randomAlphanumeric(numberCharacter);
	}

	public static int generateRandomInt(int n) {
		n = Math.abs(n);
		return (int) Math.pow(10.0D, (double) (n - 1)) + random.nextInt(9 * (int) Math.pow(10.0D, (double) (n - 1)));
	}

	public static long getCurrentTimestamp(int timeZone) {
		/*
		 * Use java.time.Instant to get a time stamp from the Java epoch. According to
		 * the JavaDoc, “epoch-seconds are measured from the standard Java epoch of
		 * 1970-01-01T00:00:00Z, where instants after the epoch have positive values:
		 */
		Instant instant = Instant.now().plusSeconds(timeZone * 60 * 60);
		return instant.getEpochSecond();
	}

	public static boolean isValidEmail(String email) {
		String emailRegex = "^[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*@" + // part before @
				"(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

		Pattern pat = Pattern.compile(emailRegex);
		if (email == null)
			return false;
		return pat.matcher(email).matches();
	}

	public static String generateUUID() {
		return UUID.randomUUID().toString().toUpperCase();
	}

	public static String getMaskedEmail(String email) {
		if (StringUtils.isBlank(email))
			return "";
		return email.replaceAll("(^[^@]{3}|(?!^)\\G)[^@]", "$1*");
	}

	public static String getMaskedPhone(String s) {
		if (StringUtils.isBlank(s))
			return "";
		StringBuilder lastFour = new StringBuilder();
		int check = 0;
		for (int i = s.length() - 1; i >= 0; i--) {
			if (Character.isDigit(s.charAt(i))) {
				check++;
			}
			if (check <= 3)
				lastFour.append(s.charAt(i));
			else if (check >= s.length() - 2)
				lastFour.append(s.charAt(i));
			else
				lastFour.append(Character.isDigit(s.charAt(i)) ? "*" : s.charAt(i));
		}
		return lastFour.reverse().toString();
	}

	public static String[] mergerPath(String[] listPath, String[] listPathSwagger) {
		List<String> pathList = new ArrayList<String>(Arrays.asList(listPath));
		pathList.addAll(Arrays.asList(listPathSwagger));
		return pathList.toArray(new String[pathList.size()]);
	}

	public static String printLogStackTrace(Exception e) {
		StringWriter errors = new StringWriter();
		e.printStackTrace(new PrintWriter(errors));
		String msg = errors.toString();
		return msg;
	}
	public static char removeAccent(char ch) {
		int index = Arrays.binarySearch(SOURCE_CHARACTERS, ch);
		if (index >= 0) {
			ch = DESTINATION_CHARACTERS[index];
		}
		return ch;
	}

	public static String removeAccent(String str) {
		StringBuilder sb = new StringBuilder(str);
		for (int i = 0; i < sb.length(); i++) {
			sb.setCharAt(i, removeAccent(sb.charAt(i)));
		}
		return sb.toString();
	}
}
