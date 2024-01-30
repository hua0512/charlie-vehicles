package org.uva.dbcs.charlie.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import javax.persistence.*;
import javax.validation.constraints.Size;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "VEHICLE")
@JsonIdentityInfo(generator =
        ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = Vehicle.class)
public class Vehicle implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  @Size(max = 10)
  @Column(nullable = false, unique = true)
  private String carRegistration;
  private long userId = 0L;

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

  public Vehicle(String carRegistration, long userId, String brand, String model, double capacity, VehiclePlugType plugType) {
    setCarRegistration(carRegistration);
    setUserId(userId);
    setBrand(brand);
    setModel(model);
    setCapacity(capacity);
    setPlugType(plugType);
  }

  public static Vehicle from(Vehicle vehicle) {
    return new Vehicle(vehicle.getCarRegistration(), vehicle.getUserId(), vehicle.getBrand(), vehicle.getModel(), vehicle.getCapacity(), vehicle.getPlugType());
  }

  public String getCarRegistration() {
    return carRegistration;
  }

  public void setCarRegistration(String carRegistration) {
    if (carRegistration == null || carRegistration.isEmpty() || carRegistration.length() > 10) {
      throw new IllegalArgumentException("Car registration is required and must be less than 10 characters");
    }
    this.carRegistration = carRegistration;
  }

  public long getUserId() {
    return userId;
  }

  public void setUserId(long userId) {
    if (userId < 0 || userId == 0) {
      throw new IllegalArgumentException("User id is required");
    }
    this.userId = userId;
  }

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    if (brand == null || brand.isEmpty() || brand.length() > 20) {
      throw new IllegalArgumentException("Brand is required and must be less than 20 characters");
    }

    this.brand = brand;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    if (model == null || model.isEmpty() || model.length() > 20) {
      throw new IllegalArgumentException("Model is required and must be less than 20 characters");
    }
    this.model = model;
  }

  public double getCapacity() {
    return capacity;
  }

  public void setCapacity(double capacity) {
    if (capacity < 0) {
      throw new IllegalArgumentException("Capacity cannot be negative");
    }
    this.capacity = capacity;
  }

  public VehiclePlugType getPlugType() {
    return plugType;
  }

  public void setPlugType(VehiclePlugType plugType) {
    if (plugType == null) {
      throw new IllegalArgumentException("Plug type is required");
    }
    this.plugType = plugType;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getId() {
    return id;
  }

  @Override
  public String toString() {
    return "Vehicle{" +
            "id=" + id +
            ", carRegistration='" + carRegistration + '\'' +
            ", userId=" + userId +
            ", brand='" + brand + '\'' +
            ", model='" + model + '\'' +
            ", capacity=" + capacity +
            ", plugType=" + plugType +
            '}';
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Vehicle vehicle = (Vehicle) o;
    return Double.compare(getCapacity(), vehicle.getCapacity()) == 0 && Objects.equals(getCarRegistration(), vehicle.getCarRegistration()) && Objects.equals(getBrand(), vehicle.getBrand()) && Objects.equals(getModel(), vehicle.getModel()) && getPlugType() == vehicle.getPlugType();
  }

  @Override
  public int hashCode() {
    return Objects.hash(getCarRegistration(), getBrand(), getModel(), getCapacity(), getPlugType());
  }
}
