package org.uva.dbcs.charlie.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class is a controller advice used to handle exceptions related to charger points.
 *
 * It provides two handler methods for specific exception types:
 *  - chargerPointNotFoundHandler: Handles ChargerPointNotFoundException and returns a string message.
 *  - invalidChargerPointHandler: Handles InvalidChargerPointException and returns a string message.
 *
 * These handler methods are annotated with @ExceptionHandler to specify the exception types they can handle,
 * and @ResponseBody to indicate that the return values should be written directly to the response body.
 * The @ResponseStatus annotation is used to set the HTTP status code for the response.
 * @author weiweng
 */
@ControllerAdvice
public class ChargerPointNotFoundAdvice {

  /**
   * This method handles the ChargerPointNotFoundException and returns a string message.
   *
   * @param ex the ChargerPointNotFoundException object
   * @return the error message as a string
   */
  @ResponseBody
  @ExceptionHandler(ChargerPointNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public String chargerPointNotFoundHandler(ChargerPointNotFoundException ex) {
    return ex.getMessage();
  }

  /**
   * Handles InvalidChargerPointException and returns the error message as a string.
   *
   * @param ex the InvalidChargerPointException object
   * @return the error message as a string
   */
  @ResponseBody
  @ExceptionHandler(InvalidChargerPointException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public String invalidChargerPointHandler(InvalidChargerPointException ex) {
    return ex.getMessage();
  }
}
