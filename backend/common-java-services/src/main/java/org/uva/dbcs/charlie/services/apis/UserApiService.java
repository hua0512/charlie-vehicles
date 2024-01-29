package org.uva.dbcs.charlie.services.apis;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.uva.dbcs.charlie.model.User;

import java.util.List;

@Service
public class UserApiService extends BaseApiService {
  private static final String RESOURCE_PATH = "/users";

  @Override
  String getBaseUrl() {
    return System.getenv("USER_API_URL") == null ? "http://localhost:8082" : System.getenv("USER_API_URL");
  }

  public UserApiService(WebClient.Builder webClientBuilder) {
    super(webClientBuilder);
  }

  public User getUserById(long id, String token) {
    System.out.println("Getting user with id: " + id);
    System.out.println("URL: " + getBaseUrl() + RESOURCE_PATH + "/" + id);
    return webClient
            .get()
            .uri(RESOURCE_PATH + "/" + id)
            .header("Authorization", token)
            .retrieve()
            .bodyToMono(User.class)
            .block();
  }

  public List<User> getUserByEmail(String email) {
    return webClient
            .get()
            .uri(RESOURCE_PATH + "?email=" + email)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<User>>() {
            })
            .block();
  }

  public boolean updateUser(User user, String token) {
    User updatedUser = webClient
            .put()
            .uri(RESOURCE_PATH + "/" + user.getId())
            .header("Authorization", token)
            .bodyValue(user)
            .retrieve()
            .bodyToMono(User.class)
            .block();
    return updatedUser != null;
  }

}
