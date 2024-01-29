package org.uva.dbcs.charlie.exceptions;

/**
 * @author hua0512
 * @date : 2024/1/28 21:33
 */
public class UserConflictException extends RuntimeException {
  public UserConflictException(String ewail) {
    super("User conflict: " + ewail);
  }
}
