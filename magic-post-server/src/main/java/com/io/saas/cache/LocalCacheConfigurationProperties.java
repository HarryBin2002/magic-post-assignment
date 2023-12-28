package com.io.saas.cache;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

@ConfigurationProperties(prefix = "app.cache")
public class LocalCacheConfigurationProperties {

	private String cacheNames = "";

	@NestedConfigurationProperty
	private CaffeineCacheConfig caffeine;

	public String getCacheNames() {
		return cacheNames;
	}

	public void setCacheNames(String cacheNames) {
		this.cacheNames = cacheNames;
	}

	public CaffeineCacheConfig getCaffeine() {
		return caffeine;
	}

	public void setCaffeine(CaffeineCacheConfig caffeine) {
		this.caffeine = caffeine;
	}

	public static class CaffeineCacheConfig {
		private String spec = "";

		public String getSpec() {
			return spec;
		}

		public void setSpec(String spec) {
			this.spec = spec;
		}

	}

}
