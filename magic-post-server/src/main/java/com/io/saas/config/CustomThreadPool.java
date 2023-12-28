package com.io.saas.config;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CustomThreadPool extends ThreadPoolExecutor {

	private static final Logger logger = LoggerFactory.getLogger(CustomThreadPool.class);

	public CustomThreadPool(int corePoolSize, int maxPoolSize, int poolTimeout, BlockingQueue<Runnable> blockingQueue,
			ThreadFactory tf) {
		super(corePoolSize, maxPoolSize, poolTimeout, TimeUnit.SECONDS, blockingQueue, tf);
	}

	private final ThreadLocal<Long> startTime = new ThreadLocal<>();

	private final AtomicLong numTasks = new AtomicLong();

	private final AtomicLong totalTime = new AtomicLong();

	@Override
	protected void beforeExecute(Thread t, Runnable r) {
		super.beforeExecute(t, r);
		logger.info("Runnable " + Thread.currentThread().getName() + " starts in " + t);
		startTime.set(System.currentTimeMillis());
	}

	@Override
	protected void afterExecute(Runnable r, Throwable t) {
		try {
			long endTime = System.currentTimeMillis();
			long taskTime = endTime - startTime.get();
			numTasks.incrementAndGet();
			totalTime.addAndGet(taskTime);
			logger.info("Runnable " + Thread.currentThread().getName() + " ends after " + taskTime + " milliseconds"
					+ "; current active: " + this.getActiveCount());
			if (t != null) {
				logger.info("" + t.getCause());
			}
		} finally {
			super.afterExecute(r, t);
		}
	}

	@Override
	protected void terminated() {
		try {
			logger.info("Terminated: avg time=" + totalTime.get() / numTasks.get());
			startTime.remove();
		} finally {
			super.terminated();
		}
	}

}
