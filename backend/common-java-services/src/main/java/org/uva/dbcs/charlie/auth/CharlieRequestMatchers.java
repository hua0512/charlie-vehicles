package org.uva.dbcs.charlie.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.util.Enumeration;

/**
 * A RequestMatcher implementation for matching requests based on request method and URL.
 * It handles the following scenarios:
 * - Handles the request if the request method is GET and the URL is /users, with parameter email.
 * - Handles the request if the request method is GET and the URL is /vehicles, with parameter userId.
 * - Handles the request if the request method is GET and the URL is /chargerpoints, with parameter plugType.
 *
 * @author hua0512
 * @date : 2023/12/17
 */
public class CharlieRequestMatchers implements RequestMatcher {

  /***
   * Matches the request based on the request method and URL.
   * Handles the request if the request method is GET and the URL is /users, with parameter email.
   * Handles the request if the request method is GET and the URL is /vehicles, with parameter userId.
   * Handles the request if the request method is GET and the URL is /chargerpoints, with parameter plugType.
   * @param request the request to check for a match
   * @return true if the request matches, false otherwise
   */
  @Override
  public boolean matches(HttpServletRequest request) {
    String method = request.getMethod();
    String uri = request.getRequestURI();
    Enumeration<String> parameterNames = request.getParameterNames();
    // return false if no parameters is present in the request
    if (!parameterNames.hasMoreElements()) return false;
    // Allow only GET requests
    if (method.equals("GET")) {
      String parameterName = parameterNames.nextElement();
      switch (uri) {
        case "/users" -> {
          if (parameterName.equals("email")) return true;
        }
        case "/vehicles" -> {
          if (parameterName.equals("userId")) return true;
        }
        case "/chargerpoints" -> {
          if (parameterName.equals("plugType")) return true;
        }
      }
    }
    return false;
  }
}