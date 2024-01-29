package org.uva.dbcs.charlie.exceptions;

/**
 * @author hua0512
 * @date : 2024/1/28 21:28
 */
public class VehicleInvalidUserException extends RuntimeException {
  public VehicleInvalidUserException(long id) {
    super("Invalid user: " + id);
  }
}
