package org.uva.dbcs.charlie.auth;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class ApplicationConfig {


  /**
   * Crea un password encoder BCrypt.
   * <p>
   * Usa la version 2B de BCrypt y 10 salt rounds. por defecto.
   * </p>
   *
   * @return password encoder BCrypt
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2B);
  }

}
