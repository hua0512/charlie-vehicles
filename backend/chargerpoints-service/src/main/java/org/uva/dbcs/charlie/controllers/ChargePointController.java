package org.uva.dbcs.charlie.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.uva.dbcs.charlie.exceptions.ChargerPointNotFoundException;
import org.uva.dbcs.charlie.exceptions.InvalidChargerPointException;
import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.model.VehiclePlugType;
import org.uva.dbcs.charlie.repo.ChargePointRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Restful service para puntos de carga.
 * BASE URL : /chargerpoints
 *
 * @author weiweng
 */
@RestController
@RequestMapping("/chargerpoints")
@CrossOrigin(origins = "*")
class ChargePointController extends BaseController<ChargePointRepository> {

  /**
   * Represents a controller for managing charge points.
   *
   * @param repository The ChargePointRepository used for CRUD operations.
   */
  public ChargePointController(ChargePointRepository repository) {
    super(repository);
  }

  /**
   * Devuelve todos los puntos de carga almacenados.
   * <p>
   * Devuelve por defecto todos los puntos de carga. Si el request contiene parametro "plugType={}", una listo de puntos de carga, entonces
   * devuelve la lista de puntos de carga compatibles con los tipos de enchufe.
   *
   * @return lista de puntos de carga
   */
  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public List<ChargePoint> getAll(@RequestParam(required = false) Map<String, String> params) {
    // check if it has plugType param
    if (!params.isEmpty()) {
      if (params.containsKey("plugType")) {
        String plugsType = params.get("plugType");
        List<String> plugs = List.of(plugsType.split(","));
        List<ChargePoint> compatibles = new ArrayList<>();
        // check if the plug type is valid
        for (String plug : plugs) {
          VehiclePlugType plugType;
          // find enum value
          // return empty list if the plug type is not valid
          try {
            plugType = VehiclePlugType.valueOf(plug);
          } catch (IllegalArgumentException e) {
            return new ArrayList<>();
          }
          // add all compatible charge points
          repo.findAllByPlugType(plugType).ifPresent(compatibles::addAll);
        }
        return compatibles;
      } else {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid parameter");
      }
    }
    return repo.findAll();
  }

  /**
   * Crea un punto de carga
   *
   * @param chargePoint punto de carga
   * @return el punto de carga creado.
   */
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public ChargePoint createChargePoint(@RequestBody ChargePoint chargePoint) {
    if (chargePoint == null)
      throw new InvalidChargerPointException("information not provided");

    if (chargePoint.getAddress() == null || chargePoint.getAddress().isEmpty()) {
      throw new InvalidChargerPointException("address must be provided");
    }
    // check if the charge point is valid
    try {
      ChargePoint.from(chargePoint);
    } catch (Exception e) {
      throw new InvalidChargerPointException("invalid charge point");
    }

    // find chargerpoins with the same address
    repo.findChargePointByAddress(chargePoint.getAddress()).map((point) -> {
      throw new InvalidChargerPointException("address already exists");
    });
    // find by latitude and longitude
    repo.findChargePointByLatitudeAndLongitude(chargePoint.getLatitude(), chargePoint.getLongitude()).map((point) -> {
      throw new InvalidChargerPointException("latitude and longitude already exists");
    });

    return repo.save(chargePoint);
  }

  /**
   * Actualiza un punto de carga.
   * Solo se puede actualizar el estado!
   *
   * @param id          el id del punto de carga a actualizar
   * @param chargePoint punto de carga a actualizar
   * @return el punto de carga actualizado
   */
  @PutMapping("/{id}")
  @PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ChargePoint updateChargePoint(@PathVariable long id, @RequestBody ChargePoint chargePoint) {
    if (id == 0) {
      throw new ChargerPointNotFoundException(0L);
    }
    if (chargePoint == null) throw new InvalidChargerPointException("information not provided");

    // check if the charge point is valid
    ChargePoint saved = repo.findById(id).orElseThrow(() -> new ChargerPointNotFoundException(id));

    if (chargePoint.getStatus() == null) {
      throw new InvalidChargerPointException("status must be provided");
    }

    // only status can be updated
    if (chargePoint.getStatus() != null) {
      saved.setStatus(chargePoint.getStatus());
    }
    return repo.save(saved);
  }
}
