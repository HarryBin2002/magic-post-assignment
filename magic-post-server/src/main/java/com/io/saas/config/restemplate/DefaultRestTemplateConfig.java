package com.io.saas.config.restemplate;

import static com.io.saas.util.RestTemplateGenericUtil.getSocketFactoryRegistry;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

@Configuration
public class DefaultRestTemplateConfig {

	@Bean
	@ConfigurationProperties(prefix = "rest.default.connection")
	public HttpComponentsClientHttpRequestFactory defaultHttpRequestFactory(
			PoolingHttpClientConnectionManager defaultHttpPoolingConnectionManager) {
		CloseableHttpClient closeableHttpClient = HttpClients.custom()
				.setConnectionManager(defaultHttpPoolingConnectionManager).setConnectionManagerShared(true).build();
		return new HttpComponentsClientHttpRequestFactory(closeableHttpClient);
	}

	@Primary
	@Bean("defaultRestTemplate")
	public RestTemplate defaultRestTemplate(HttpComponentsClientHttpRequestFactory defaultHttpRequestFactory) {
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.setErrorHandler(new DefaultResponseErrorHandler() {
			@Override
			public boolean hasError(ClientHttpResponse response) throws IOException {
				HttpStatus.Series series = response.getStatusCode().series();
				return HttpStatus.Series.CLIENT_ERROR.equals(series) || HttpStatus.Series.SERVER_ERROR.equals(series);
			}
		});
		restTemplate.setRequestFactory(defaultHttpRequestFactory);
		return restTemplate;
	}

	@Bean
	@ConfigurationProperties(prefix = "rest.default.connection-pool")
	public PoolingHttpClientConnectionManager defaultHttpPoolingConnectionManager()
			throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
		return new PoolingHttpClientConnectionManager(getSocketFactoryRegistry());
	}
}
