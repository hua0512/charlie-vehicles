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

@RestController
@RequestMapping("/vehicles")
public class VehicleController extends BaseController<VehicleRepository> {

  private final UserRepository userRepo;
  private final ChargePointRepository cpRepo;

  public VehicleController(VehicleRepository repo, UserRepository userRepo, ChargePointRepository chargePointRepository) {
    super(repo);
    this.userRepo = userRepo;
    this.cpRepo = chargePointRepository;
  }

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public List<Vehicle> getAll() {
    return repo.findAll();
  }

  @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public Vehicle getVehicleById(@PathVariable long id) {
    return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
  }

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
    // check if user is enabled and has a payment method
    changeUserStatus(vehicle.getUserId(), true);

    return saved;
  }

  private void changeUserStatus(User user, boolean enabled) {
    // check if user is enabled and has a payment method
    if (user.isEnabled() && user.getPaymentCard() != null && !user.getPaymentCard().isEmpty()) {
      User savedUser = userRepo.getReferenceById(user.getId());
      savedUser.setEnabled(enabled);
      userRepo.save(savedUser);
    }
  }


  @DeleteMapping("/{id}")
  public void deleteVehicle(@PathVariable long id) {
    Vehicle vehicle = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
    if (repo.findAllByUserId_Id(vehicle.getUserId().getId()).size() == 1) {
      changeUserStatus(vehicle.getUserId(), false);
    }
    repo.deleteById(id);
  }

  @GetMapping(value = "/{id}/chargepoints", produces = MediaType.APPLICATION_JSON_VALUE)
  public List<ChargePoint> getCompatibleChargePoints(@PathVariable long id) {
    Vehicle vehicle = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
    if (vehicle.getPlugType() != null) {
      return cpRepo.findAllByPlugType(vehicle.getPlugType()).orElse(new ArrayList<>());
    } else {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vehicle plug type is required");
    }
  }
}
