package org.uva.dbcs.charlie.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "CHARGE_POINT")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = ChargePoint.class)
public class ChargePoint implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  /**
   * The ChargePoint class represents a charging point for a vehicle. It contains information about the address,
   * latitude, longitude, plug type, power, and status of the charging point.
   */
  public ChargePoint() {

  }

  /**
   * Creates a new ChargePoint object based on the provided ChargePoint object.
   *
   * @param chargePoint the ChargePoint object to create a new ChargePoint from
   * @return a new ChargePoint object
   */
  public static ChargePoint from(ChargePoint chargePoint) {
    return new ChargePoint(chargePoint.getAddress(), chargePoint.getLatitude(), chargePoint.getLongitude(), chargePoint.getPlugType(), chargePoint.getPower(), chargePoint.getStatus());
  }

  public ChargePoint(String address, double latitude, double longitude, VehiclePlugType plugType, VehiclePower power, ChargerPointStatus status) {
    this.address = address;
    setLatitude(latitude);
    setLongitude(longitude);
    this.plugType = plugType;
    this.power = power;
    this.status = status;
  }

  @Column(nullable = false)
  private String address;

  @Column(nullable = false)
  private double latitude;

  @Column(nullable = false)
  private double longitude;
  /**
   * Tipo de conector del vehículo. Enum con los valores: Schuko, CSS, Mennekes, CHAdeMO
   * Usamos ORDINAL para que se guarde en la base de datos como un entero y es más eficiente
   *
   * @see VehiclePlugType
   */
  @Enumerated(EnumType.ORDINAL)
  @Column(nullable = false)
  private VehiclePlugType plugType;

  /**
   * Tipo de power del vehículo.
   * Usamos ORDINAL para que se guarde en la base de datos como un entero y es más eficiente
   *
   * @see VehiclePower
   */
  @Enumerated(EnumType.ORDINAL)
  @Column(nullable = false)
  private VehiclePower power;


  /**
   * Tipo de estado del punto de carga.
   * Usamos ORDINAL para que se guarde en la base de datos como un entero y es más eficiente
   *
   * @see ChargerPointStatus
   */
  @Enumerated(EnumType.ORDINAL)
  @Column(nullable = false)
  private ChargerPointStatus status;


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
    if (address == null || address.isEmpty()) {
      throw new IllegalArgumentException("Address must be provided");
    }
    if (address.length() > 256) {
      throw new IllegalArgumentException("Address must be less than 256 characters");
    }
    this.address = address;
  }

  public double getLatitude() {
    return latitude;
  }

  public void setLatitude(double latitude) {
    // check if latitude is valid
    if (latitude < -90 || latitude > 90) {
      throw new IllegalArgumentException("Latitude must be between -90 and 90");
    }
    this.latitude = latitude;
  }

  public double getLongitude() {
    return longitude;
  }

  public void setLongitude(double longitude) {
    // check if longitude is valid
    if (longitude < -180 || longitude > 180) {
      throw new IllegalArgumentException("Longitude must be between -180 and 180");
    }
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

  public ChargerPointStatus getStatus() {
    return status;
  }

  public void setStatus(ChargerPointStatus status) {
    this.status = status;
  }

}
