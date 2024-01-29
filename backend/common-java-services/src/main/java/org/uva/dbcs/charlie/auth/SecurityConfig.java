package org.uva.dbcs.charlie.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.uva.dbcs.charlie.services.UserDetailsServiceImpl;

import java.util.List;


@Configuration
public class SecurityConfig {


  private final UserDetailsServiceImpl userService;
  private final JwtAuthorizationFilter jwtAuthorizationFilter;


  public SecurityConfig(UserDetailsServiceImpl userController, JwtAuthorizationFilter jwtAuthorizationFilter) {
    this.userService = userController;
    this.jwtAuthorizationFilter = jwtAuthorizationFilter;
  }


  @Bean
  public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder bCryptPasswordEncoder)
          throws Exception {
    AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
    authenticationManagerBuilder.userDetailsService(userService).passwordEncoder(bCryptPasswordEncoder);
    return authenticationManagerBuilder.build();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    // @formatter:off
    http
            .authorizeHttpRequests((authorize) -> authorize
                    .requestMatchers(new CharlieRequestMatchers()).permitAll()
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable())
            .cors( cors -> cors.configurationSource(new CharlieCorsConfigurationSource()))
            .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    // @formatter:on
    return http.build();
  }

  private class CharlieCorsConfigurationSource implements org.springframework.web.cors.CorsConfigurationSource {

    @Override
    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
      CorsConfiguration corsConfiguration = new CorsConfiguration();
      corsConfiguration.setAllowedOrigins(List.of("*"));
      corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      corsConfiguration.setAllowedHeaders(List.of("*"));
      corsConfiguration.setAllowCredentials(false);
      corsConfiguration.setMaxAge(3600L);
      return corsConfiguration;
    }
  }
}
