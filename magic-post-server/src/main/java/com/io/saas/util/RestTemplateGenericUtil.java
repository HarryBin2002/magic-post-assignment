package com.io.saas.util;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import javax.net.ssl.SSLContext;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.ssl.SSLContexts;

public class RestTemplateGenericUtil {

	private RestTemplateGenericUtil() {
	}

	public static Registry<ConnectionSocketFactory> getSocketFactoryRegistry()
			throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
		SSLContextBuilder builder = SSLContexts.custom();
		builder.loadTrustMaterial(null, (chain, authType) -> true);
		SSLContext sslContext = builder.build();
		SSLConnectionSocketFactory sslSocketFactory = new SSLConnectionSocketFactory(sslContext,
				(s, sslSession) -> s.equalsIgnoreCase(sslSession.getPeerHost()));
		return RegistryBuilder.<ConnectionSocketFactory>create().register("https", sslSocketFactory)
				.register("http", new PlainConnectionSocketFactory()).build();
	}

}
