package org.uva.dbcs.charlie.exceptions;

/**
 * @author hua0512
 * @date : 2024/1/28 21:18
 */
public class InvalidVehicleException extends RuntimeException {
  public InvalidVehicleException(String message) {
    super("Invalid vehicle: " + message);
  }
}
