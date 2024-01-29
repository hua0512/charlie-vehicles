package org.uva.dbcs.charlie.services.apis;

import org.uva.dbcs.charlie.model.Vehicle;

import java.util.List;

/**
 * @author hua0512
 * @date : 2023/12/17
 */
public interface VehicleApi {

  List<Vehicle> getVehiclesByUserId(long userId);

  void delete(long id, String token);
}
