package org.uva.dbcs.charlie.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import org.uva.dbcs.charlie.exceptions.InvalidVehicleException;
import org.uva.dbcs.charlie.exceptions.VehicleConflictException;
import org.uva.dbcs.charlie.exceptions.VehicleInvalidUserException;
import org.uva.dbcs.charlie.exceptions.VehicleNotFoundException;
import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.model.User;
import org.uva.dbcs.charlie.model.Vehicle;
import org.uva.dbcs.charlie.repo.VehicleRepository;
import org.uva.dbcs.charlie.services.apis.ChargerPointsApiService;
import org.uva.dbcs.charlie.services.apis.UserApiService;

import java.util.List;
import java.util.Map;

/**
 * Restful service para vehículos.
 * BASE URL : /vehicles
 *
 * @author weiweng
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/vehicles")
public class VehicleController extends BaseController<VehicleRepository> {


  private final UserApiService userApiService;

  private final ChargerPointsApiService cpService;

  /**
   * Crea un vehiclecontroller con los siguientes parametros.
   *
   * @param repo el jpa repository de vehiculos
   */
  @Autowired
  public VehicleController(VehicleRepository repo, UserApiService userApiService, ChargerPointsApiService chargerPointsApiService) {
    super(repo);
    this.userApiService = userApiService;
    this.cpService = chargerPointsApiService;
  }

  /**
   * Obtiene una lista con todos los vehiculos almacenado en la base de datos.
   * <p>
   * Si el request contiene parametro "userId=...", devuelve la lista de vehiculos del usuario especificado.
   *
   * @return la lista de vehiculos por defecto, o la lista de vehiculos de un usuario especificado.
   */
  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public List<Vehicle> getAll(@RequestParam(required = false) Map<String, String> params) {
    if (!params.isEmpty()) {
      // ?userId=...
      if (params.containsKey("userId")) {
        String userId = params.get("userId");
        return repo.findVehiclesByUserId(Long.parseLong(userId));
      } else {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid param");
      }
    }
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
    return repo.findById(id).orElseThrow(() -> new VehicleNotFoundException(id));
  }

  /**
   * Crea un vehiculo con la informacion especificada.
   * <p>
   * Actualiza el estado del usuario a activo si el usuario tiene un metodo de pago y tiene al menos un vehiculos.
   *
   * @param vehicle el vehiculo a crear
   * @return el vehiculo creado.
   */
  @PostMapping
  public Vehicle createVehicle(@RequestBody Vehicle vehicle, @RequestHeader("Authorization") String token) {
    if (vehicle == null) throw new InvalidVehicleException("Vehicle is required");

    // check if the vehicle is valid
    try {
      Vehicle.from(vehicle);
    } catch (Exception e) {
      throw new InvalidVehicleException(e.getMessage());
    }
    // check if vehicle already exists
    if (repo.existsVehicleByCarRegistration(vehicle.getCarRegistration())) {
      throw new VehicleConflictException(vehicle.getCarRegistration());
    }

    User vehicleUser;
    try {
      // get user from users-api
      vehicleUser = userApiService.getUserById(vehicle.getUserId(), token);
    } catch (WebClientResponseException e) {
      throw new VehicleInvalidUserException(vehicle.getUserId());
    }

    Vehicle saved;
    try {
      // save vehicle
      saved = repo.save(vehicle);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving vehicle");
    }

    // enable user if it has a payment method and has at least one vehicle
    if (!vehicleUser.isEnabled() && vehicleUser.getPaymentCard() != null && !vehicleUser.getPaymentCard().isEmpty()) {
      vehicleUser.setEnabled(true);
      try {
        // update user
        if (!userApiService.updateUser(vehicleUser, token)) {
          System.out.println("Error enabling user, rolling back...");
          // rollback
          repo.deleteById(saved.getId());
          throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error enabling user");
        }
      } catch (Exception e) {
        // rollback
        try {
          repo.deleteById(saved.getId());
        } catch (Exception ex) {
          System.out.println("Error rolling back");
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error enabling user");
      }
    }
    return saved;
  }

  /**
   * Elimina un vehiculo con el id especificado.
   *
   * @param id el id del vehiculo a eliminar
   */
  @DeleteMapping("/{id}")
  public void deleteVehicle(@PathVariable long id, @RequestHeader("Authorization") String token) {
    System.out.println("Called delete vehicle" + id);
    Vehicle vehicle = repo.findById(id).orElseThrow(() -> new VehicleNotFoundException(id));
    // check if user has no vehicles
    long userId = vehicle.getUserId();
    int vehiclesCount = repo.findVehiclesByUserId(userId).size();
    System.out.println("vehicles count: " + vehiclesCount);
    // delete vehicle
    try {
      repo.deleteById(id);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting vehicle");
    }
    if (vehiclesCount == 1) {
      // retrieve user from users-api
      User savedUser = userApiService.getUserById(userId, token);
      // disable user
      savedUser.setEnabled(false);
      try {
        if (!userApiService.updateUser(savedUser, token)) {
          throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error disabling user");
        }
      } catch (WebClientResponseException e) {
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error disabling user");
      }
    }
  }

  /**
   * Obtiene una lista de puntos de carga compatibles con el vehiculo especificado(ID).
   *
   * @param id el id del vehiculo a consultar
   * @return lista de puntos de carga compatibles
   */
  @GetMapping(value = "/{id}/chargerpoints", produces = MediaType.APPLICATION_JSON_VALUE)
  public List<ChargePoint> getCompatibleChargePoints(@PathVariable long id) {
    Vehicle vehicle = repo.findById(id).orElseThrow(() -> new VehicleNotFoundException(id));
    // check if vehicle has plug type
    if (vehicle.getPlugType() != null) {
      // lista de puntos de carga compatibles
      return cpService.getCompatibleChargerPoints(List.of(vehicle.getPlugType()));
    } else {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vehicle plug type is required");
    }
  }
}
