package org.uva.dbcs.charlie;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.uva.dbcs.charlie.model.User;
import org.uva.dbcs.charlie.repo.UserRepository;

/**
 * @author hua0512
 * @date : 2024/1/29 9:53
 */
@Configuration
public class LoadDataBase {


  private static final Logger log = LoggerFactory.getLogger(LoadDataBase.class);

  @Bean
  CommandLineRunner initDatabase(UserRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }
      User user = new User("oaguilar", "Oscar", "Aguilar", "oaguilar@gmail.com", "$2b$10$1Q3Th6eYM9fdXqDay.vKo.QersoQGZniQoeYf0n5mu6VH9f4tt.0a", "8123839183213231");
      user.setEnabled(true);
      log.info("Preloading " + repository.save(user));
      user = new User("jdoe", "John", "Doe", "jdoe@gmail.com", "$2b$10$1Q3Th6eYM9fdXqDay.vKo.QersoQGZniQoeYf0n5mu6VH9f4tt.0a", "8123839183213232");
      user.setEnabled(true);
      log.info("Preloading " + repository.save(user));

      for (int i = 0; i < 100; i++) {
        // generate random 16 digits
        String randomDigits = "";
        for (int j = 0; j < 16; j++) {
          randomDigits += (int) (Math.random() * 10);
        }
        String[] paymentCards = new String[]{"", randomDigits};
        log.info("Preloading " + repository.save(new User("uuuuser" + i, "User" + i, "User" + i, "user" + i + "@example.com", "$2b$10$1Q3Th6eYM9fdXqDay.vKo.QersoQGZniQoeYf0n5mu6VH9f4tt.0a", paymentCards[(int) (Math.random() * 2)])));
      }
    };
  }

}
