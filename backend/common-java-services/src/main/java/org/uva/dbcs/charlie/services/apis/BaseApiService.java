package org.uva.dbcs.charlie.services.apis;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public abstract class BaseApiService {

  protected WebClient webClient;

  abstract String getBaseUrl();

  public BaseApiService(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.baseUrl(getBaseUrl()).build();
  }

}
