package org.uva.dbcs.charlie.services;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;

@Controller
public class UserDetailsServiceImpl implements UserDetailsService {
  /**
   * Load a user by their username.
   *
   * @param username the username of the user to load
   * @return a UserDetails object representing the loaded user
   * @throws UsernameNotFoundException if the user is not found
   */
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    System.out.println("loadUserByUsername: " + username);


    // CONFIAMOS DE MOMENTO QUE EL TOKEN JWT ES CORRECTO Y ES GENERADO POR NOSOTROS
    // POR LO QUE NO HACE FALTA COMPROBAR LA CONTRASEÑA
    // create a UserDetails object from the data
    return org.springframework.security.core.userdetails.User
            .withUsername(username)
            .password("")
            .authorities("USER")
            .build();
  }
}
