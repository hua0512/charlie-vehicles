package org.uva.dbcs.charlie;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.model.ChargerPointStatus;
import org.uva.dbcs.charlie.model.VehiclePlugType;
import org.uva.dbcs.charlie.model.VehiclePower;
import org.uva.dbcs.charlie.repo.ChargePointRepository;

@Configuration
public class LoadDatabase {
  private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

  @Bean
  CommandLineRunner initDatabase(ChargePointRepository repository) {
    return args -> {
      if (repository.count() > 0) {
        return;
      }
      log.info("Preloading " + repository.save(new ChargePoint("C. Arzobispo García Goldaraz, 11", 40.31, 3.48, VehiclePlugType.CSS, VehiclePower.MEDIA, ChargerPointStatus.DISPONIBLE)));
      for (int i = 0; i < 100; i++) {
        log.info("Preloading " + repository.save(new ChargePoint("C. Arzobispo García Goldaraz, " + i, Math.random() * 90, Math.random() * 5, VehiclePlugType.values()[(int) (Math.random() * VehiclePlugType.values().length)], VehiclePower.values()[(int) (Math.random() * VehiclePower.values().length)], ChargerPointStatus.values()[(int) (Math.random() * ChargerPointStatus.values().length)])));
      }
    };
  }
}