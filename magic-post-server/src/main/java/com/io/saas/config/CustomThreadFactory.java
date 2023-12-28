package com.io.saas.config;

import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicLong;

public class CustomThreadFactory implements ThreadFactory {

	private String namePrefix;
	private final AtomicLong threadNumber = new AtomicLong();

	public CustomThreadFactory(String namePrefix) {
		this.namePrefix = namePrefix;
	}

	@Override
	public Thread newThread(Runnable runnable) {
		return new Thread(runnable, namePrefix + ".Thread-" + threadNumber.getAndIncrement());
	}

}
