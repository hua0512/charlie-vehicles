package org.uva.dbcs.charlie.services.apis;

import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.model.VehiclePlugType;

import java.util.List;

public interface ChargerPointsApi {

  public List<ChargePoint> getCompatibleChargerPoints(List<VehiclePlugType> plugTypes);

}