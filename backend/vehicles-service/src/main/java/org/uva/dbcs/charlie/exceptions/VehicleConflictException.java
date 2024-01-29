package org.uva.dbcs.charlie.exceptions;

/**
 * @author hua0512
 * @date : 2024/1/28 21:18
 */
public class VehicleConflictException extends RuntimeException {
  public VehicleConflictException(String matricula) {
    super("Vehicle with matricula " + matricula + " already exists");
  }
}
