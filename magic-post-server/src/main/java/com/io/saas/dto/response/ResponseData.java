package com.io.saas.dto.response;

public class ResponseData {
	protected Object data;
	protected String status;
	protected String message;
	public ResponseData() {
	}
	public ResponseData(String status, Object data, String message) {
		this.status = status;
		this.data = data;
		this.message = message;
	}
	public ResponseData(String status, String message) {
		this.status = status;
		this.message = message;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
}
