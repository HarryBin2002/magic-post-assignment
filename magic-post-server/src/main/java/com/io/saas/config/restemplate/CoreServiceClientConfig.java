package com.io.saas.config.restemplate;

import static com.io.saas.util.RestTemplateGenericUtil.getSocketFactoryRegistry;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class CoreServiceClientConfig {

  @Bean
  @ConfigurationProperties(prefix = "rest.core-service.connection")
  public HttpComponentsClientHttpRequestFactory coreServiceHttpRequestFactory(
      PoolingHttpClientConnectionManager coreServiceHttpClientConnectionManager) {
    HttpClientBuilder builder = HttpClients.custom()
        .setConnectionManager(coreServiceHttpClientConnectionManager)
        .setConnectionManagerShared(true);
    CloseableHttpClient closeableHttpClient = builder.build();
    return new HttpComponentsClientHttpRequestFactory(closeableHttpClient);
  }

  @Bean("coreServiceRestTemplate")
  public RestTemplate coreServiceRestTemplate(
      HttpComponentsClientHttpRequestFactory coreServiceHttpRequestFactory) {
    RestTemplate restTemplate = new RestTemplate();
    restTemplate.setRequestFactory(coreServiceHttpRequestFactory);
    return restTemplate;
  }

  @Bean
  @ConfigurationProperties(prefix = "rest.core-service.connection-pool")
  public PoolingHttpClientConnectionManager coreServiceHttpClientConnectionManager()
      throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
    return new PoolingHttpClientConnectionManager(getSocketFactoryRegistry());
  }

}
