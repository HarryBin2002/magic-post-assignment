package com.io.saas.dto.response;

public class ResponseDataPagination extends ResponseData {
	private Object pagination;

	public Object getPagination() {
		return pagination;
	}

	public ResponseDataPagination setPagination(Object pagination) {
		this.pagination = pagination;
		return this;
	}
}
