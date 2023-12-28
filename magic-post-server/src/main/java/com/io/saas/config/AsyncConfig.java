package com.io.saas.config;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedTransferQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

	private static final Logger logger = LoggerFactory.getLogger(AsyncConfig.class);

	@Value("${executor.corePoolSize:2}")
	private String poolSize;
	@Value("${executor.maxPoolSize:4}")
	private String setMaxPoolSize;
	@Value("${executor.poolTimeOut:120}")
	private String poolTimeOut;

	@Bean("threadPoolTaskExecutor")
	public TaskExecutor getAsyncExecutor() {
		logger.info("corePoolSize : " + poolSize + ", MaxPoolSize : " + setMaxPoolSize);
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(Integer.parseInt(poolSize));
		executor.setMaxPoolSize(Integer.parseInt(setMaxPoolSize));
		executor.setWaitForTasksToCompleteOnShutdown(true);
		executor.setThreadNamePrefix("Async-");
		return executor;
	}

	@Bean("executorService")
	public ExecutorService getExecutorService() {
		ThreadFactory threadFactory = new CustomThreadFactory("NPS");
		BlockingQueue<Runnable> queue = new LinkedTransferQueue<>();
		CustomThreadPool executorService = new CustomThreadPool(Integer.parseInt(poolSize),
				Integer.parseInt(setMaxPoolSize), Integer.parseInt(poolTimeOut), queue, threadFactory);
		executorService.setRejectedExecutionHandler(new RejectedTaskHandler());
		executorService.setKeepAliveTime(Integer.parseInt(poolTimeOut), TimeUnit.SECONDS);
		return executorService;
	}

}
