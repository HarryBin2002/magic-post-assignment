package com.io.saas;

import org.json.simple.parser.JSONParser;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Base64;

@SpringBootApplication(scanBasePackageClasses = { App.class }, scanBasePackages = { "com.io.saas" }, exclude = DataSourceAutoConfiguration.class)
@EnableScheduling
public class App {

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}

	public int compute(int x) {
		int res = 0;
		int[] a = {2, 2, 3, 4};
		int i = 0;
		while (i < a.length) {
			if (a[i] > x*2) {
				res += 2;
			} else if (a[i] == x*2) {
				res += 1;
			}
			i++;
		}
		return res;
	}
	
}
