package com.io.saas.exception;

public class JwtException extends RuntimeException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public JwtException(String errorMessage) {
		super(errorMessage);
	}

}
