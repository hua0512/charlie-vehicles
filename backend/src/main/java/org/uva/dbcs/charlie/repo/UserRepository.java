package org.uva.dbcs.charlie.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.uva.dbcs.charlie.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

  public Optional<User> findByName(String name);

  boolean existsUserByName(String name);

  boolean existsUserByEmail(String email);
}
