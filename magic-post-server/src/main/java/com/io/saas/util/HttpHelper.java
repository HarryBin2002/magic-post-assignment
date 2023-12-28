package com.io.saas.util;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.io.saas.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class HttpHelper {
    private static Logger logger = LoggerFactory.getLogger(HttpHelper.class);
    
    @Autowired
    @Qualifier("coreServiceRestTemplate")
    RestTemplate restTemplate;
    public <T, V> T post(String url, HttpHeaders headers, V body, Class<T> responseType) throws Exception{
        HttpEntity<V> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<T> response = restTemplate.postForEntity(
                url,
                requestEntity,
                responseType
        );
        T res =  response.getBody();
        if (res == null) {
            logger.error("Response body is null");
            throw new BusinessException(response.getStatusCode().toString());
        }
        return res;
    }

    public <T> T get(String url, HttpHeaders headers, Class<T> responseType) throws Exception{
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<T> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                responseType
        );
        return  response.getBody();
    }

    public <T> T objectConvert(Object object, Class<T> responseType) throws Exception{
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(object);
        return mapper.readValue(json, responseType);
    }
}
