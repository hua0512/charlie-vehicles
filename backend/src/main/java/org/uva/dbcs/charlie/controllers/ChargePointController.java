package org.uva.dbcs.charlie.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.repo.ChargePointRepository;

import java.util.List;

/**
 * Restful service para puntos de carga.
 * BASE URL : /chargerpoints
 *
 * @author weiweng
 * @author pabvela
 * @author laublan
 */
@RestController
@RequestMapping("/chargerpoints")
public class ChargePointController extends BaseController<ChargePointRepository> {

  public ChargePointController(ChargePointRepository repository) {
    super(repository);
  }

  /**
   * Devuelve todos los puntos de carga almacenados.
   *
   * @return lista de puntos de carga
   */
  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public List<ChargePoint> getAll() {
    return repo.findAll();
  }

  /**
   * Crea un punto de carga
   *
   * @param chargePoint punto de carga
   * @return el punto de carga creado.
   */
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public ChargePoint createChargePoint(ChargePoint chargePoint) {
    if (chargePoint == null)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Charge point information not provided");
    return repo.save(chargePoint);
  }

  /**
   * Actualiza un punto de carga.
   * Solo se puede actualizar el estado!
   * @param id el id del punto de carga a actualizar
   * @param chargePoint  punto de carga a actualizar
   * @return el punto de carga actualizado
   */
  @PutMapping("/{id}")
  @PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ChargePoint updateChargePoint(@PathVariable long id, @RequestBody ChargePoint chargePoint) {
    if (id == 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Charge point id is required");
    }
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Charge point not found");
    }

    if (chargePoint == null) throw  new ResponseStatusException(HttpStatus.BAD_REQUEST, "Charge point info is null");
    ChargePoint saved = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Charge point not found"));

    // only status can be updated
    if (chargePoint.getStatus() != null) {
      saved.setStatus(chargePoint.getStatus());
    }
    return repo.save(saved);
  }
}
