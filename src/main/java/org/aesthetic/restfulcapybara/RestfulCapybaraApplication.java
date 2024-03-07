package org.aesthetic.restfulcapybara;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class RestfulCapybaraApplication {
    public static void main(String[] args) {
        SpringApplication.run(RestfulCapybaraApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(@Value("${server.port}") String serverPort) {
        return args -> {
            LoggerFactory.getLogger(RestfulCapybaraApplication.class)
                    .info("Application started at " + serverPort + ", specify with --server.port=x (default 8080)");
        };
    }
}

@Configuration
class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedMethods("*");
    }
}