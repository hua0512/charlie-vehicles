package org.uva.dbcs.charlie.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.uva.dbcs.charlie.model.ChargePoint;
import org.uva.dbcs.charlie.repo.ChargePointRepository;

import java.util.List;

@RestController
@RequestMapping("/chargerpoints")
public class ChargePointController extends BaseController<ChargePointRepository> {

  public ChargePointController(ChargePointRepository repository) {
    super(repository);
  }

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public List<ChargePoint> getAll() {
    return repo.findAll();
  }

  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public ChargePoint createChargePoint(ChargePoint chargePoint) {
    return repo.save(chargePoint);
  }

  @PutMapping("/{id}")
  @PatchMapping("/{id}")
  public ChargePoint updateChargePoint(@PathVariable long id, ChargePoint chargePoint) {
    if (id == 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Charge point id is required");
    }
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Charge point not found");
    }
    ChargePoint saved = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Charge point not found"));

    // only status can be updated
    if (chargePoint.getStatus() != null) {
      saved.setStatus(chargePoint.getStatus());
    }
    return repo.save(saved);
  }
}
