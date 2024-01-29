package org.uva.dbcs.charlie.exceptions;

/**
 * The InvalidChargerPointException is an exception thrown when an invalid charger point is encountered.
 * It extends the RuntimeException class.
 *
 * @author weiweng
 */
public class InvalidChargerPointException extends RuntimeException {
  /**
   * The InvalidChargerPointException is an exception thrown when an invalid charger point is encountered.
   * It extends the RuntimeException class.
   *
   * @param message the detail message of the exception
   */
  public InvalidChargerPointException(String message) {
    super("Invalid charger point " + message);
  }
}
