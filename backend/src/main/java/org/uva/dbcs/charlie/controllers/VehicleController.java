package org.uva.dbcs.charlie.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.model.User;
import org.uva.dbcs.charlie.model.Vehicle;
import org.uva.dbcs.charlie.repo.ChargePointRepository;
import org.uva.dbcs.charlie.repo.UserRepository;
import org.uva.dbcs.charlie.repo.VehicleRepository;

import java.util.ArrayList;
import java.util.List;

/**
 * Restful service para vehículos.
 * BASE URL : /vehicles
 *
 * @author weiweng
 * @author pabvela
 * @author laublan
 */
@RestController
@RequestMapping("/vehicles")
public class VehicleController extends BaseController<VehicleRepository> {

  /**
   * jpa repository de usuarios
   */
  private final UserRepository userRepo;
  /**
   * jpa repository de puntos de carga
   */
  private final ChargePointRepository cpRepo;

  /**
   * Crea un vehiclecontroller con los siguientes parametros.
   *
   * @param repo                  el jpa repository de vehiculos
   * @param userRepo              jpa repository de usuarios.
   * @param chargePointRepository jpa repository de puntos de carga.
   */
  public VehicleController(VehicleRepository repo, UserRepository userRepo, ChargePointRepository chargePointRepository) {
    super(repo);
    this.userRepo = userRepo;
    this.cpRepo = chargePointRepository;
  }

  /**
   * Obtiene una lista con todos los vehiculos almacenado en la base de datos.
   *
   * @return la lista de vehiculos.
   */
  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public List<Vehicle> getAll() {
    return repo.findAll();
  }

  /**
   * Obtiene un vehiculo especificado con su id.
   *
   * @param id el id del vehiculo buscado.
   * @return el vehiculo buscado
   * @throws ResponseStatusException si no existe el vehiculo buscado.
   */
  @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public Vehicle getVehicleById(@PathVariable long id) {
    return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
  }

  /**
   * Crea un vehiculo con la informacion especificada.
   * <p>
   * Actualiza el estado del usuario a activo si el usuario tiene un metodo de pago y tiene al menos un vehiculos.
   *
   * @param vehicle el vehiculo a crear
   * @return el vehiculo creado.
   * @throws ResponseStatusException si el vehiculo ya existe, o si el usuario no existe.
   */
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
    // check if the vehicle is valid
    if (vehicle.getCarRegistration() == null || vehicle.getCarRegistration().isEmpty() || vehicle.getCarRegistration().length() > 10) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Car registration is required and must be less than 30 characters");
    }
    // check if vehicle already exists
    if (repo.existsVehicleByCarRegistration(vehicle.getCarRegistration())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Vehicle already exists");
    }

    if (vehicle.getBrand() == null || vehicle.getBrand().isEmpty() || vehicle.getBrand().length() > 20) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Brand is required and must be less than 20 characters");
    }
    if (vehicle.getModel() == null || vehicle.getModel().isEmpty() || vehicle.getModel().length() > 20) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Model is required and must be less than 20 characters");
    }

    if (vehicle.getCapacity() < 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Capacity must be greater than 0");
    }
    if (vehicle.getPlugType() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Plug type is required");
    }

    if (vehicle.getUserId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is required");
    }

    // check if user exists
    if (!userRepo.existsById(vehicle.getUserId().getId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User does not exist");
    }

    Vehicle saved = repo.save(vehicle);
    User savedUser = userRepo.getReferenceById(vehicle.getUserId().getId());
    // check if user is not enabled and has a payment method
    if (!savedUser.isEnabled() && savedUser.getPaymentCard() != null && !savedUser.getPaymentCard().isEmpty()) {
      changeUserStatus(savedUser, true);
    }

    return saved;
  }

  /**
   * Cambia el estado de un usuario.
   *
   * @param user    el usuario a cambiar el estado
   * @param enabled el estado a cambiar
   */

  private void changeUserStatus(User user, boolean enabled) {
    // check if user is enabled and has a payment method
    user.setEnabled(enabled);
    userRepo.save(user);
  }


  /**
   * Elimina un vehiculo con el id especificado.
   * @param id el id del vehiculo a eliminar
   */
  @DeleteMapping("/{id}")
  public void deleteVehicle(@PathVariable long id) {
    Vehicle vehicle = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
    if (repo.findAllByUserId_Id(vehicle.getUserId().getId()).size() == 1) {
      User savedUser =  userRepo.getReferenceById(vehicle.getUserId().getId());
      changeUserStatus(savedUser, false);
    }
    repo.deleteById(id);
  }

  /**
   * Obtiene una lista de puntos de carga compatibles con el vehiculo especificado(ID).
   * @param id el id del vehiculo a consultar
   * @return lista de puntos de carga compatibles
   */
  @GetMapping(value = "/{id}/chargerpoints", produces = MediaType.APPLICATION_JSON_VALUE)
  public List<ChargePoint> getCompatibleChargePoints(@PathVariable long id) {
    Vehicle vehicle = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
    // check if vehicle has plug type
    if (vehicle.getPlugType() != null) {
      // lista de puntos de carga compatibles
      return cpRepo.findAllByPlugType(vehicle.getPlugType()).orElse(new ArrayList<>());
    } else {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vehicle plug type is required");
    }
  }
}
