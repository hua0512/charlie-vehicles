package org.uva.dbcs.charlie.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @author hua0512
 * @date : 2024/1/28 21:19
 */

@ControllerAdvice
public class VehicleExceptionAdvice {


  @ResponseBody
  @ExceptionHandler(VehicleNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public String vehicleNotFoundHandler(VehicleNotFoundException ex) {
    return ex.getMessage();

  }

  @ResponseBody
  @ExceptionHandler(InvalidVehicleException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public String invalidVehicleHandler(InvalidVehicleException ex) {
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(VehicleConflictException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public String vehicleConflictHandler(VehicleConflictException ex) {
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(VehicleInvalidUserException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public String vehicleInvalidUserHandler(VehicleInvalidUserException ex) {
    return ex.getMessage();
  }
}
