package org.uva.dbcs.charlie.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import org.uva.dbcs.charlie.exceptions.InvalidUserException;
import org.uva.dbcs.charlie.exceptions.UserConflictException;
import org.uva.dbcs.charlie.exceptions.UserNotFoundException;
import org.uva.dbcs.charlie.model.User;
import org.uva.dbcs.charlie.model.Vehicle;
import org.uva.dbcs.charlie.repo.UserRepository;
import org.uva.dbcs.charlie.services.apis.VehicleApiService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Restful service para usuarios.
 * BASE URL : /users
 *
 * @author weiweng
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
public class UserController extends BaseController<UserRepository> {


//  // bCrypt password encoder
  public PasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2B);

  private final VehicleApiService vehicleApiService;


  /**
   * Crea un controlador con parametros jpa.
   *
   * @param repo interfaz jpa de usuario
   */
  public UserController(UserRepository repo, VehicleApiService vehicleApiService) {
    super(repo);
    this.vehicleApiService = vehicleApiService;
  }

  /**
   * Devuelve todos los usuarios almacenados.
   * <p>
   * Devuelve por defecto todos los usuarios. Si el request contiene parametro "enable=true|false",
   * devuelve la lista de usuarios activos o inactivos respectivamente.
   * Si el request contiene parametro "email=...", devuelve una lista con el usuario con el email especificado.
   *
   * @param params mapa de parametros de request
   * @return la lista de usuarios por defecto, o la lista con usuarios activos o inactivos, o la lista con un usuario con un determinado email.
   */
  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public List<User> getAll(@RequestParam(required = false) Map<String, String> params) {
    // check if it has enabled param
    if (!params.isEmpty()) {
      // ?enable=true|false
      if (params.containsKey("enable")) {
        String enabled = params.get("enable");
        // check if it is a boolean
        if (enabled.equals("true") || enabled.equals("false")) {
          return repo.findAllByEnabled(Boolean.parseBoolean(enabled));
        } else {
          return new ArrayList<>();
        }
      }
      // ?email=...
      if (params.containsKey("email")) {
        String email = params.get("email");
        return repo.findByEmail(email).map(List::of).orElse(new ArrayList<>());
      }
      return new ArrayList<>();
    }
    return repo.findAll();
  }

  /**
   * Obtiene un usuario con el id especificado.
   *
   * @param id id del usuario
   * @return devuelve el usuario buscado.
   */
  @GetMapping("/{id}")
  public User getUserById(@PathVariable long id) {
    return repo.findById(id).orElseThrow(() -> new UserNotFoundException(id));
  }

  /**
   * Crea un usuario y lo guarda en la base de datos.
   *
   * @param user el usuario a crear
   * @return el usuario creado.
   */
  @PostMapping
  public User newUser(@RequestBody User user) {
    // check if user is null
    if (user == null) {
      throw new InvalidUserException("User is required");
    }

    // check if user valid
    try {
      User.from(user);
    } catch (Exception e) {
      throw new InvalidUserException("Invalid user format");
    }

    // check if user already exists
    if (repo.existsUserByName(user.getName())) {
      throw new UserConflictException("User already exists");
    }

    // check if email is already taken
    if (repo.existsUserByEmail(user.getEmail())) {
      throw new UserConflictException("Email already taken");
    }
    // hash password
    String hashedPassword = encodePassword(user.getPassword());
    user.setPassword(hashedPassword);
    // make sure user is not enabled
    user.setEnabled(false);
    return repo.save(user);
  }


  /**
   * Modifica un usuario con el id especificado. Solo se podrá modificar el email, password y paymentCard.
   * <b
   * <p>
   * Se activará el usuario si tiene un vehiculo y paymentCard asignado.
   * </br>
   *
   * @param newUser el usuario a modificar
   * @param id      el id del usuario a modificar
   * @return el usuario modificado
   */
  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public User updateUser(@RequestBody User newUser, @PathVariable Long id) {
    if (newUser == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is required");
    }

    System.out.println("Requesting user update: " + newUser);
    // check if user exists
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
    // get saved user
    User savedUser = repo.getReferenceById(id);
    // update email if changed
    updateEmailIfChanged(newUser, savedUser);
    // update password if changed
    updatePasswordIfChanged(newUser, savedUser);
    // update paymentCard if changed
    updatePaymenCardIfChanged(newUser, savedUser);
    // check if user can be enabled
    enableUserIfHasVehicleAndPaymentCard(savedUser);
    // update user
    try {
      User saved = repo.save(savedUser);
      saved.setPassword("");
      return saved;
    } catch (Exception e) {
      throw new InvalidUserException("Invalid user format");
    }
  }

  private void enableUserIfHasVehicleAndPaymentCard(User user) {
    // check if paymentCard is not null or empty and user has at least one vehicle
    if (user.getPaymentCard() != null && !user.getPaymentCard().isEmpty()) {
      List<Vehicle> vehicles = getVehiclesByUserId(user.getId());
      if (!vehicles.isEmpty()) {
        // enable user
        user.setEnabled(true);
        System.out.println("User enabled : " + user.getId());
        return;
      }
    }
    user.setEnabled(false);
  }

  /**
   * Elimina un usuario con el id especificado.
   *
   * @param id el id del usuario a eliminar
   */
  @DeleteMapping("/{id}")
  public void deleteUser(@PathVariable long id, @RequestHeader("Authorization") String token) {
    // check if user exists
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
    // delete user
    try {
      vehicleApiService.getVehiclesByUserId(id).forEach((vehicle -> vehicleApiService.delete(vehicle.getId(), token)));
      repo.deleteById(id);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting user");
    }
  }


  /**
   * Obtiene todos los vehiculos de un usuario especificado con el id.
   *
   * @param id el id del usuario a consultar.
   * @return devuelve todos los vehiculos del usuario con id especificado.
   */
  @GetMapping(value = "/{id}/vehicles", produces = MediaType.APPLICATION_JSON_VALUE)
  public List<Vehicle> getVehiclesByUserId(@PathVariable long id) {
    try {
      return vehicleApiService.getVehiclesByUserId(id);
    } catch (WebClientResponseException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error getting vehicles");
    }
  }

  private void updateEmailIfChanged(User newUser, User savedUser) {
    String newEmail = newUser.getEmail();
    if (newEmail == null) {
      return;
    }

    if (isSameContent(newEmail, savedUser.getEmail())) {
      return;
    }

    // check if email is already taken
    if (repo.existsUserByEmail(newEmail)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already taken");
    }

    try {
      savedUser.setEmail(newEmail);
    } catch (Exception e) {
      throw new InvalidUserException("Invalid email format");
    }
  }

  private void updatePasswordIfChanged(User newUser, User savedUser) {
    String newPassword = newUser.getPassword();
    if (newPassword == null) {
      return;
    }

    if (isSameContent(newPassword, savedUser.getPassword())) {
      return;
    }

    try {
      // check format first
      savedUser.setPassword(newPassword);
      // hash password
      String hashedPassword = encodePassword(newPassword);
      savedUser.setPassword(hashedPassword);
    } catch (Exception e) {
      throw new InvalidUserException("Invalid password format");
    }
  }

  private void updatePaymenCardIfChanged(User newUser, User savedUser) {
    try {
      Optional.ofNullable(newUser.getPaymentCard()).ifPresent(savedUser::setPaymentCard);
    } catch (Exception e) {
      throw new InvalidUserException("Invalid payment card format");
    }
  }


  /**
   * Encripta un password mediante algoritmo BCrypt.
   * <p>
   * Se utiliza la version 2B de BCrypt, con un salt de 10.
   * </p>
   *
   * @param password password a encriptar
   * @return devuelve el password encriptado.
   */
  private String encodePassword(String password) {
    // hash password
    return bCryptPasswordEncoder.encode(password);
  }
}
