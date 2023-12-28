package com.io.saas.util;

import java.math.BigDecimal;
import org.apache.commons.lang3.StringUtils;

public class ConvertUtils {
	public static final int[] maxtrix_power_ten = { 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000,
			1000000000 };

	public static int powerOf(int pow) {
		return maxtrix_power_ten[pow];
	}

	public static long convertStringToLong(String str, int precision) {
		return convertBigDecimalToLong(new BigDecimal(str), precision);
	}

	public static long convertBigDecimalToLong(BigDecimal sourceNumber, int precision) {
		return sourceNumber.multiply(new BigDecimal("1.0E+" + precision + "")).toBigInteger().longValue();
	}

	public static BigDecimal convertLongToBigDecimal(long sourceNumber, int precision) {
		return new BigDecimal(sourceNumber).divide(new BigDecimal(powerOf(precision)));
	}

	public static double convertLongToDouble(long sourceNumber, short numberPrecision) {
		StringBuffer strBuffer = new StringBuffer();
		String numberString = String.valueOf(sourceNumber);
		int index = numberString.length() - numberPrecision;
		if (index == 0) {
			strBuffer.append("0.");
			strBuffer.append(numberString);
		} else if (index > 0) {
			strBuffer.append(numberString.substring(0, index));
			strBuffer.append(".");
			strBuffer.append(numberString.substring(index, numberString.length()));
		} else {
			strBuffer.append("0.");
			strBuffer.append(StringUtils.repeat("0", Math.abs(index)));
			strBuffer.append(numberString);
		}
		return Double.parseDouble(strBuffer.toString());
	}

	public static double convertLongToDouble(long sourceNumber, long numberPrecision) {
		StringBuffer strBuffer = new StringBuffer();
		long result = sourceNumber * numberPrecision;
		String numberString = String.valueOf(result);
		strBuffer.append("0.").append(numberString);
		return Double.parseDouble(strBuffer.toString());
	}

	public static String convertLongToPercent(long sourceNumber, long numberPrecision) {
		StringBuffer strBuffer = new StringBuffer();
		long result = (sourceNumber * numberPrecision) / 100;
		String numberString = String.valueOf(result);
		strBuffer.append("0.").append(numberString).append(" %");
		return strBuffer.toString();
	}

	public static String convertLongToString(long sourceNumber, short numberPrecision) {
		StringBuffer strBuffer = new StringBuffer();
		String numberString = String.valueOf(sourceNumber);
		int index = numberString.length() - numberPrecision;
		if (index == 0) {
			strBuffer.append("0.");
			strBuffer.append(numberString);
		} else if (index > 0) {
			strBuffer.append(numberString.substring(0, index));
			strBuffer.append(".");
			strBuffer.append(numberString.substring(index, numberString.length()));
		} else {
			strBuffer.append("0.");
			strBuffer.append(StringUtils.repeat("0", Math.abs(index)));
			strBuffer.append(numberString);
		}
		return strBuffer.toString();
	}

}
