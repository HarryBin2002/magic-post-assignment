package com.io.saas.config;

import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RejectedTaskHandler implements RejectedExecutionHandler {

	private static final Logger logger = LoggerFactory.getLogger(RejectedTaskHandler.class);

	@Override
	public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
		logger.info("RejectedTaskHandler: The task {} has been rejected", r.toString());
		try {
			logger.info("Resubmit task to queue: {}", r.toString());
			executor.getQueue().put(r);
		} catch (InterruptedException e) {
			logger.error("RejectTaskException when re put to queue", e);
			Thread.currentThread().interrupt();
		}
	}
}
