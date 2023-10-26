package org.uva.dbcs.charlie.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.model.Vehicle;
import org.uva.dbcs.charlie.model.VehiclePlugType;

import java.util.List;
import java.util.Optional;

public interface ChargePointRepository extends JpaRepository<ChargePoint, Long> {

  public Optional<ChargePoint> findChargePointById(long id);

  public Optional<List<ChargePoint>> findAllByPlugType(VehiclePlugType plugType);
}
