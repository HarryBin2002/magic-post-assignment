package com.io.saas.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Pagination {
	@JsonProperty(value="page")
	private long currentPage;
	
	@JsonProperty(value="size")
	private long pageSize;
	
	@JsonProperty(value="totalPage")
	private long totalPage;
	
	@JsonProperty(value="totalRecords")
	private long totalRecords;

	public long getCurrentPage() {
		return currentPage;
	}

	public Pagination() {}
	
	public Pagination setCurrentPage(long currentPage) {
		this.currentPage = currentPage;
		return this;
	}

	public long getPageSize() {
		return pageSize;
	}

	public Pagination setPageSize(long pageSize) {
		this.pageSize = pageSize;
		return this;
	}

	public long getTotalPage() {
		return totalPage;
	}

	public Pagination setTotalPage(long totalPage) {
		this.totalPage = totalPage;
		return this;
	}
	
	public long getTotalRecords() {
		return totalRecords;
	}

	public void setTotalRecords(long totalRecords) {
		this.totalRecords = totalRecords;
	}
}
