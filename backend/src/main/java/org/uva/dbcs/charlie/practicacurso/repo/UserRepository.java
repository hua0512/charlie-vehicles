package org.uva.dbcs.charlie.practicacurso.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.uva.dbcs.charlie.practicacurso.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

  public Optional<User> findByName(String name);

  boolean existsUserByName(String name);
}
