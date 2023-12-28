package com.io.saas.cache;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisClusterConfiguration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.util.CollectionUtils;

@Configuration
@EnableConfigurationProperties(RedisCacheConfigurationProperties.class)
@ConditionalOnProperty(value = "app.cache.redis.enable", havingValue = "true")
public class RedisCacheConfig {

    private static final Logger logger = LoggerFactory.getLogger(RedisCacheConfig.class);

    private static RedisCacheConfiguration createCacheConfiguration(long timeoutInSeconds) {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        JdkSerializationRedisSerializer jdkSerializer = new JdkSerializationRedisSerializer(loader);
        RedisSerializationContext.SerializationPair<Object> pair = RedisSerializationContext.SerializationPair
                .fromSerializer(jdkSerializer);

        return RedisCacheConfiguration.defaultCacheConfig().serializeValuesWith(pair)
//                .disableCachingNullValues()
                .entryTtl(Duration.ofSeconds(timeoutInSeconds));
    }

    @Bean
    public LettuceConnectionFactory redisConnectionFactory(RedisCacheConfigurationProperties properties) {
        logger.info("Redis (/Lettuce) configuration enabled. With cache timeout " + properties.getTimeoutSeconds()
                + " seconds.");
        if (!CollectionUtils.isEmpty(properties.getNodes())) {
            logger.info("Redis Cluster: {}", properties.getNodes());
            RedisClusterConfiguration redisClusterConfiguration = new RedisClusterConfiguration(properties.getNodes());
            if (!StringUtils.isEmpty(properties.getPassword())) {
                redisClusterConfiguration.setPassword(RedisPassword.of(properties.getPassword()));
            }
            return new LettuceConnectionFactory(redisClusterConfiguration);
        } else {
            logger.info("Redis Standalone: {}:{}", properties.getHost(), properties.getPort());
            RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
            redisStandaloneConfiguration.setHostName(properties.getHost());
            redisStandaloneConfiguration.setPort(properties.getPort());
            if (!StringUtils.isEmpty(properties.getPassword())) {
                redisStandaloneConfiguration.setPassword(RedisPassword.of(properties.getPassword()));
            }
            return new LettuceConnectionFactory(redisStandaloneConfiguration);
        }
    }

    @Bean("redisTemplate")
    public RedisTemplate<String, String> redisStringTemplate(RedisConnectionFactory cf) {
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(cf);
        return redisTemplate;
    }

    @Bean
    public RedisTemplate<Byte[], Byte[]> redisTemplate(RedisConnectionFactory cf) {
        RedisTemplate<Byte[], Byte[]> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(cf);
        return redisTemplate;
    }

    @Bean
    public RedisCacheConfiguration cacheConfiguration(RedisCacheConfigurationProperties properties) {
        return createCacheConfiguration(properties.getTimeoutSeconds());
    }

    @Bean
    public CacheManager redisCacheManager(RedisConnectionFactory redisConnectionFactory,
                                          RedisCacheConfigurationProperties properties) {
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        for (Map.Entry<String, Long> cacheNameAndTimeout : properties.getCacheExpirations().entrySet()) {
            cacheConfigurations.put(cacheNameAndTimeout.getKey(),
                    createCacheConfiguration(cacheNameAndTimeout.getValue()));
        }

        return RedisCacheManager.builder(redisConnectionFactory).cacheDefaults(cacheConfiguration(properties))
                .withInitialCacheConfigurations(cacheConfigurations).build();
    }

}
