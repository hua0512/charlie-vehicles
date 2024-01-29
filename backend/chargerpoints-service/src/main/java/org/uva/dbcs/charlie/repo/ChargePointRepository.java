package org.uva.dbcs.charlie.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.model.VehiclePlugType;

import java.util.List;
import java.util.Optional;

/**
 * Repository for the ChargePoint entity.
 * @author weiweng
 */
public interface ChargePointRepository extends JpaRepository<ChargePoint, Long> {

  /**
   * Retrieves a list of ChargePoints based on the provided VehiclePlugType.
   *
   * @param plugType the VehiclePlugType to filter the ChargePoints by
   * @return an Optional containing the list of ChargePoints matching the plugType, or an empty Optional if no matches are found
   */
  public Optional<List<ChargePoint>> findAllByPlugType(VehiclePlugType plugType);

  /**
   * Finds a charge point by its address.
   *
   * @param address the address of the charge point
   * @return an Optional containing the found ChargePoint, or an empty Optional if no matching charge point is found
   */
  Optional<ChargePoint> findChargePointByAddress(String address);

  /**
   * Finds a charge point by latitude and longitude.
   *
   * @param latitude  the latitude of the charge point
   * @param longitude the longitude of the charge point
   * @return an Optional containing the found ChargePoint, or an empty Optional if no matching charge point is found
   */
  Optional<ChargePoint> findChargePointByLatitudeAndLongitude(double latitude, double longitude);
}
