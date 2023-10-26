package org.uva.dbcs.charlie.controllers;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.uva.dbcs.charlie.model.User;
import org.uva.dbcs.charlie.repo.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController extends BaseController<UserRepository> {

  public UserController(UserRepository repo) {
    super(repo);
  }

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public List<User> getAll() {
    return repo.findAll();
  }

  @GetMapping("/{id}")
  public User getUserById(@PathVariable long id) {
    return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
  }

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


  @PutMapping("/{id}")
  public User updateUser(@RequestBody User newUser, @PathVariable long id) {

    /**
     * PUT /users/{id}: Modificará el usuario con el id especificado. Se podrá modificar el email, password y
     * paymentCard. Hay que tener en cuenta que si un usuario tiene añadida la forma de pago y asociado al
     * menos un vehículo, su estado pasará a activado (“enabled” a true). Si deja de tener forma de pago no puede
     * seguir activo para la carga.
     *
     */
    // check if user exists
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
    // get saved user
    //noinspection OptionalGetWithoutIsPresent
    User savedUser = repo.findById(id).get();

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
      if (savedUser.getVehicles() != null && !savedUser.getVehicles().isEmpty()) {
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

  @DeleteMapping("/{id}")
  public void deleteUser(@PathVariable long id) {
    // check if user exists
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }
    // delete user
    repo.deleteById(id);
  }
}
