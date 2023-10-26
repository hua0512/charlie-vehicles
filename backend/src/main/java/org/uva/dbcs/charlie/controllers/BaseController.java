package org.uva.dbcs.charlie.controllers;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "*")
public abstract class BaseController<T extends JpaRepository<?, ?>> {

  protected final T repo;

  public BaseController(T repo) {
    this.repo = repo;
  }

  protected boolean isSameContent(String a, String b) {
    // check if both are null or empty, or if both are not null and equal
    return (a == null || a.isEmpty()) && (b == null || b.isEmpty()) || (a != null && !a.isEmpty()) && (b != null && !b.isEmpty()) && a.equals(b);
  }

}
