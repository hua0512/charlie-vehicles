package org.uva.dbcs.charlie;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.uva.dbcs.charlie.model.Vehicle;
import org.uva.dbcs.charlie.model.VehiclePlugType;
import org.uva.dbcs.charlie.repo.VehicleRepository;

/**
 * @author hua0512
 * @date : 2024/1/29 10:05
 */
@Configuration
public class LoadDatabase {
  private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

  @Bean
  CommandLineRunner initDatabase(VehicleRepository repository) {
    if (repository.count() > 0) {
      return args -> {
      };
    }
    return args -> {
      log.info("Preloading " + repository.save(new Vehicle("3234ABC", 1, "Tesla", "Model S", 302, VehiclePlugType.CSS)));
      log.info("Preloading " + repository.save(new Vehicle("3234DEF", 2, "Tesla", "Model 3", 263, VehiclePlugType.CSS)));
      for (int i = 0; i < 100; i++) {
        if (Math.random() > 0.5) {
          String matricula = "1234" + (char) (Math.random() * 26 + 'A') + (char) (Math.random() * 26 + 'A') + (char) (Math.random() * 26 + 'A');
          if (!repository.existsVehicleByCarRegistration(matricula))
            log.info("Preloading " + repository.save(new Vehicle(matricula, (int) (Math.random() * 100), "Tesla", "Model " + (char) (Math.random() * 26 + 'A'), (int) (Math.random() * 100), VehiclePlugType.values()[(int) (Math.random() * VehiclePlugType.values().length)])));
        }
      }
    };
  }
}
