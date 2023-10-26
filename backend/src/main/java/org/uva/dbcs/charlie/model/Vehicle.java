package org.uva.dbcs.charlie.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(name = "VEHICLE")
@JsonIdentityInfo(generator =
        ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Vehicle implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Size(max = 10)
  @Column(nullable = false, unique = true)
  private String carRegistration;

  @JoinColumn(name = "user_id",
          referencedColumnName = "id")
  @ManyToOne(optional = false,
          fetch = FetchType.EAGER,
          cascade = CascadeType.MERGE)
  private User userId;

  @Column(nullable = false)
  @Size(max = 20)
  private String brand;

  @Column(nullable = false)
  @Size(max = 20)
  private String model;

  private double capacity = 0.0;

  /**
   * Tipo de conector del vehículo. Enum con los valores: Schuko, CSS, Mennekes, CHAdeMO
   * Usamos ORDINAL para que se guarde en la base de datos como un entero y es más eficiente
   *
   * @see VehiclePlugType
   */
  @Enumerated(EnumType.ORDINAL)
  private VehiclePlugType plugType;

  public Vehicle() {
  }

  public Vehicle(String carRegistration, User userId, String brand, String model, float capacity, VehiclePlugType plugType) {
    this.carRegistration = carRegistration;
    this.userId = userId;
    this.brand = brand;
    this.model = model;
    this.capacity = capacity;
    this.plugType = plugType;
  }

  public String getCarRegistration() {
    return carRegistration;
  }

  public void setCarRegistration(String carRegistration) {
    this.carRegistration = carRegistration;
  }

  public User getUserId() {
    return userId;
  }

  public void setUserId(User userId) {
    this.userId = userId;
  }

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    this.brand = brand;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public double getCapacity() {
    return capacity;
  }

  public void setCapacity(double capacity) {
    this.capacity = capacity;
  }

  public VehiclePlugType getPlugType() {
    return plugType;
  }

  public void setPlugType(VehiclePlugType plugType) {
    this.plugType = plugType;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getId() {
    return id;
  }
}
