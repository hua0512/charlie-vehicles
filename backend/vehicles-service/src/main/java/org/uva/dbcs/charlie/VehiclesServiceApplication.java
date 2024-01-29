package org.uva.dbcs.charlie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories({"org.uva.dbcs.charlie.repo"})
public class VehiclesServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(VehiclesServiceApplication.class, args);
  }

}
