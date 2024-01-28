package org.uva.dbcs.charlie.controllers;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.uva.dbcs.charlie.model.User;
import org.uva.dbcs.charlie.model.Vehicle;
import org.uva.dbcs.charlie.repo.UserRepository;
import org.uva.dbcs.charlie.repo.VehicleRepository;

import java.util.List;
import java.util.Map;

/**
 * Restful service para usuarios.
 * BASE URL : /users
 *
 * @author weiweng
 * @author pabvela
 * @author laublan
 */
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController extends BaseController<UserRepository> {

  /**
   * repositorio de vehiculos
   */
  private final VehicleRepository vRepo;

  /**
   * Crea un controlador con parametros jpa.
   *
   * @param repo  interfaz jpa de usuario
   * @param vRepo interfaz jpa de vehiculos
   */
  public UserController(UserRepository repo, VehicleRepository vRepo) {
    super(repo);
    this.vRepo = vRepo;
  }

  /**
   * Devuelve todos los usuarios almacenados.
   * <p>
   * Devuelve por defecto todos los usuarios. Si el request contiene parametro "enable=true|false",
   * devuelve la lista de usuarios activos o inactivos respectivamente.
   *
   * @param params mapa de parametros de request
   * @return la lista de usuarios por defecto, o la lista con usuarios activos o inactivos.
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
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enable param must be a boolean");
        }
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid params");
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
    return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
  }

  /**
   * Crea un usuario y lo guarda en la base de datos.
   *
   * @param user el usuario a crear
   * @return el usuario creado.
   */
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public User createUser(@RequestBody @NotNull User user) {
//     check if user is valid
    if (user.getName() == null || user.getName().isEmpty() || user.getName().length() > 30) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required and must be less than 30 characters");
    }
    // check if user already exists
    if (repo.existsUserByName(user.getName())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
    }
    if (user.getFirstName() == null || user.getFirstName().isEmpty() || user.getFirstName().length() > 30) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "First name is required and must be less than 30 characters");
    }
    if (user.getLastName() == null || user.getLastName().isEmpty() || user.getLastName().length() > 30) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Last name is required and must be less than 30 characters");
    }
    if (user.getEmail() == null || user.getEmail().isEmpty() || user.getEmail().length() > 100) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required and must be less than 100 characters");
    }
    // check if an email format is valid
    if (!user.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email format is invalid");
    }
    // check if email is already taken
    if (repo.existsUserByEmail(user.getEmail())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already taken");
    }

    if (user.getPassword() == null || user.getPassword().isEmpty() || user.getPassword().length() > 100) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required and must be less than 100 characters");
    }
    // paymentCard is optional
    if (user.getPaymentCard() != null && user.getPaymentCard().length() > 50) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment card must be less than 50 characters");
    }

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
  @PutMapping("/{id}")
  public User updateUser(@RequestBody @NotNull User newUser, @PathVariable long id) {
    // check if user exists
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
    // get saved user
    User savedUser = repo.getReferenceById(id);

    // email, password and paymentCard can be modified
    if (newUser.getEmail() != null && !newUser.getEmail().isEmpty() && !isSameContent(newUser.getEmail(), savedUser.getEmail()) && newUser.getEmail().length() <= 100) {

      // check if an email format is valid
      if (!newUser.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email format is invalid");
      }

      // check if email is already taken
      if (repo.existsUserByEmail(newUser.getEmail())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already taken");
      }
      savedUser.setEmail(newUser.getEmail());
    }
    if (newUser.getPassword() != null && !newUser.getPassword().isEmpty() && !isSameContent(newUser.getPassword(), savedUser.getPassword()) && newUser.getPassword().length() <= 100) {
      savedUser.setPassword(newUser.getPassword());
    }
    if (newUser.getPaymentCard() != null && !newUser.getPaymentCard().isEmpty() && !isSameContent(newUser.getPaymentCard(), savedUser.getPaymentCard()) && newUser.getPaymentCard().length() <= 50) {
      savedUser.setPaymentCard(newUser.getPaymentCard());
    }

    // check if paymentCard is not null or empty and user has at least one vehicle
    if (savedUser.getPaymentCard() != null && !savedUser.getPaymentCard().isEmpty()) {
      if (vRepo.countAllByUserId_Id(savedUser.getId()) > 0) {
        // enable user
        savedUser.setEnabled(true);
      }
    } else {
      // disable user
      savedUser.setEnabled(false);
    }
    // update user
    return repo.save(savedUser);
  }

  /**
   * Elimina un usuario con el id especificado.
   *
   * @param id el id del usuario a eliminar
   */
  @DeleteMapping("/{id}")
  public void deleteUser(@PathVariable long id) {
    // check if user exists
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
    // delete user
    try {
      vRepo.deleteAll(vRepo.findAllByUserId_Id(id));
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
    return vRepo.findAllByUserId_Id(id);
  }

}
