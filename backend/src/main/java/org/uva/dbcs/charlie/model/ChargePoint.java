package org.uva.dbcs.charlie.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "CHARGE_POINT")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ChargePoint implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  public ChargePoint() {

  }

  public ChargePoint(String address, double latitude, double longitude, VehiclePlugType plugType, VehiclePower power, VehicleStatus status) {
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.plugType = plugType;
    this.power = power;
    this.status = status;
  }

  private String address;

  private double latitude;

  private double longitude;
  /**
   * Tipo de conector del vehículo. Enum con los valores: Schuko, CSS, Mennekes, CHAdeMO
   * Usamos ORDINAL para que se guarde en la base de datos como un entero y es más eficiente
   *
   * @see VehiclePlugType
   */
  @Enumerated(EnumType.ORDINAL)
  private VehiclePlugType plugType;

  /**
   * Tipo de power del vehículo.
   * Usamos ORDINAL para que se guarde en la base de datos como un entero y es más eficiente
   *
   * @see VehiclePower
   */
  @Enumerated(EnumType.ORDINAL)
  private VehiclePower power;


  /**
   * Tipo de estado del vehículo.
   * Usamos ORDINAL para que se guarde en la base de datos como un entero y es más eficiente
   *
   * @see VehicleStatus
   */
  @Enumerated(EnumType.ORDINAL)
  private VehicleStatus status;


  public void setId(Long id) {
    this.id = id;
  }

  public Long getId() {
    return id;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public double getLatitude() {
    return latitude;
  }

  public void setLatitude(double latitude) {
    this.latitude = latitude;
  }

  public double getLongitude() {
    return longitude;
  }

  public void setLongitude(double longitude) {
    this.longitude = longitude;
  }

  public VehiclePlugType getPlugType() {
    return plugType;
  }

  public void setPlugType(VehiclePlugType plugType) {
    this.plugType = plugType;
  }

  public VehiclePower getPower() {
    return power;
  }

  public void setPower(VehiclePower power) {
    this.power = power;
  }

  public VehicleStatus getStatus() {
    return status;
  }

  public void setStatus(VehicleStatus status) {
    this.status = status;
  }

}
