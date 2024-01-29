package org.uva.dbcs.charlie.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.uva.dbcs.charlie.model.Vehicle;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

  public Optional<Vehicle> findVehicleByCarRegistration(String carRegistration);

  public boolean existsVehicleByCarRegistration(String carRegistration);

  List<Vehicle> findVehiclesByUserId(long userId);
}
