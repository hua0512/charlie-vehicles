package org.uva.dbcs.charlie.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @author hua0512
 * @date : 2024/1/28 21:35
 */
@ControllerAdvice
public class UserExceptionAdvice {

  @ResponseBody
  @ExceptionHandler(UserConflictException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public String userConflictHandler(UserConflictException ex) {
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(UserNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public String userNotFoundHandler(UserNotFoundException ex) {
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(InvalidUserException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public String invalidUserHandler(InvalidUserException ex) {
    return ex.getMessage();
  }

}
