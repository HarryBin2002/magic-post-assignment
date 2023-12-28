package com.io.saas.constant;

public interface JwtConstants {
	
	public static final String SCOPE = "scope";
	public static final String TOKEN_HEADER = "Authorization";
	public static final String TOKEN_PREFIX = "Bearer ";
	public static final String CLAIM_NAMEID = "nameid";
	public static final long TIME_TO_EXPIRE_TOKEN = 172800000L;
	public static final String TOKEN_TYPE = "JWT";

	// 1 hour
	public static final long ACCESS_TOKEN_EXPIRED_TIME = 1000 * 60 * 60;
	// 60 days
	public static final long REFRESH_TOKEN_EXPIRED_TIME = 1000 * 60 * 60 * 24 * 60;

}
