package org.uva.dbcs.charlie.services.apis;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.model.VehiclePlugType;

import java.util.List;

@Service
public class ChargerPointsApiService extends BaseApiService implements ChargerPointsApi {

  private static final String RESOURCE_PATH = "/chargerpoints";

  public ChargerPointsApiService(WebClient.Builder webClientBuilder) {
    super(webClientBuilder);
  }

  @Override
  String getBaseUrl() {
    return System.getenv("CHARGERPOINTS_API_URL") == null ? "http://localhost:8081" : System.getenv("CHARGERPOINTS_API_URL");
  }

  @Override
  public List<ChargePoint> getCompatibleChargerPoints(List<VehiclePlugType> plugTypes) {
    return webClient
            .get()
            .uri(RESOURCE_PATH + "?plugType=" + plugTypes)
            .retrieve()
            .bodyToFlux(ChargePoint.class)
            .collectList()
            .block();
  }
}
