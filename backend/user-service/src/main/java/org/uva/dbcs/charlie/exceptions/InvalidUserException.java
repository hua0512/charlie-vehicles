package org.uva.dbcs.charlie.exceptions;

/**
 * @author hua0512
 * @date : 2024/1/28 21:34
 */
public class InvalidUserException extends RuntimeException {
  public InvalidUserException(String email) {
    super("Invalid user: " + email);
  }
}
