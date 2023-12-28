package com.io.saas.cache;

import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import com.github.benmanes.caffeine.cache.Caffeine;

//@Configuration
//@EnableConfigurationProperties(LocalCacheConfigurationProperties.class)
//@ConditionalOnProperty(value = "app.cache.enable", havingValue = "true", matchIfMissing = true)
public class LocalCacheConfig {

	private static final Logger logger = LoggerFactory.getLogger(LocalCacheConfig.class);

	@Bean
	public Caffeine<Object, Object> caffeineCacheBuilder(LocalCacheConfigurationProperties properties) {
		return Caffeine.from(properties.getCaffeine().getSpec());
	}

	@Bean
	@Primary
	public CacheManager localCacheManager(Caffeine<Object, Object> caffeineCacheBuilder,
			LocalCacheConfigurationProperties properties) {
		CaffeineCacheManager cacheManager = new CaffeineCacheManager();
		if (properties.getCacheNames() == null || "".equals(properties.getCacheNames())) {
			cacheManager.setCacheNames(null); // dynamic
		} else {
			cacheManager.setCacheNames(Arrays.asList(properties.getCacheNames()));
		}
		logger.info("Configuring local cache manager");
		logger.info("Using caffeine: {}", caffeineCacheBuilder.toString());
		logger.info("Cache names: {}", properties.getCacheNames());
		cacheManager.setCaffeine(caffeineCacheBuilder);
		return cacheManager;
	}
}
