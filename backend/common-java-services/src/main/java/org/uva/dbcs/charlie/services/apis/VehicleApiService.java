package org.uva.dbcs.charlie.services.apis;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.uva.dbcs.charlie.model.Vehicle;

import java.util.List;

/***
 * Servicio para la API de vehiculos.
 * Se encarga de realizar las peticiones a la API de vehiculos.
 * @author weiweng
 */
@Service
public class VehicleApiService extends BaseApiService implements VehicleApi {

  private static final String RESOURCE_PATH = "/vehicles";

  public VehicleApiService(WebClient.Builder webClientBuilder) {
    super(webClientBuilder);
  }

  @Override
  public List<Vehicle> getVehiclesByUserId(long userId) {
    return webClient.get()
            .uri(RESOURCE_PATH + "?userId=" + userId)
            .accept(MediaType.APPLICATION_JSON)
            .retrieve()
            .bodyToFlux(Vehicle.class)
            .collectList()
            .block();
  }

  @Override
  public void delete(long id, String token) {
    webClient.delete()
            .uri(RESOURCE_PATH + "/" + id)
            .accept(MediaType.APPLICATION_JSON)
            .header("Authorization", token)
            .retrieve()
            .bodyToMono(Void.class)
            .block();
  }

  @Override
  String getBaseUrl() {
    return System.getenv("VEHICLES_API_URL") == null ? "http://localhost:8081" : System.getenv("VEHICLES_API_URL");
  }
}
