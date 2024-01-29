package org.uva.dbcs.charlie.exceptions;

/**
 * The ChargerPointNotFoundException is an exception thrown when a charger point is not found.
 * It extends the RuntimeException class.
 * @author weiweng
 */
public class ChargerPointNotFoundException extends RuntimeException {
  /**
   * The ChargerPointNotFoundException is an exception thrown when a charger point is not found.
   * It extends the RuntimeException class.
   *
   * @param id the ID of the charger point that was not found
   */
  public ChargerPointNotFoundException(Long id ) {
    super("Could not find charger point " + id);
  }

}
