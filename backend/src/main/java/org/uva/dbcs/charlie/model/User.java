package org.uva.dbcs.charlie.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "USER")
@JsonIdentityInfo(generator =
        ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class User implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String name;
  @Size(max = 30)
  private String firstName;
  @Size(max = 30)
  private String lastName;
  @Column(nullable = false, unique = true)
  @Size(max = 100)
  private String email;
  @Column(nullable = false)
  @Size(max = 100)
  private String password;
  @Size(max = 50)
  private String paymentCard;
  @Column(nullable = false)
  private boolean enabled = false;
  @CreationTimestamp
  private Instant createdAt;
  @UpdateTimestamp
  private Instant updatedAt;

  @OneToMany(mappedBy = "userId",
          fetch = FetchType.EAGER, cascade =
          CascadeType.MERGE)
  private List<Vehicle> vehicles;


  public User(String name, String firstName, String lastName, String email, String password, String paymentCard) {
    this.name = name;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.paymentCard = paymentCard;
  }

  public User() {

  }


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getPaymentCard() {
    return paymentCard;
  }

  public void setPaymentCard(String paymentCard) {
    this.paymentCard = paymentCard;
  }

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getId() {
    return id;
  }

  public List<Vehicle> getVehicles() {
    return vehicles;
  }
}
