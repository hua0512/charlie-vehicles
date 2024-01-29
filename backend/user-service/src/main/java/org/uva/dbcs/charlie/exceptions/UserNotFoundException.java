package org.uva.dbcs.charlie.exceptions;

/**
 * @author hua0512
 * @date : 2024/1/28 21:34
 */
public class UserNotFoundException extends RuntimeException {
  public UserNotFoundException(long id) {
    super("User not found: " + id);
  }
}
