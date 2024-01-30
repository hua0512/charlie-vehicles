package org.uva.dbcs.charlie.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "USER")
@JsonIdentityInfo(generator =
        ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = User.class)
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
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
  @Size(max = 256)
  private String password;
  @Size(max = 50)
  private String paymentCard;
  @Column(nullable = false)
  private boolean enabled = false;
  @CreationTimestamp
  private Instant createdAt;
  @UpdateTimestamp
  private Instant updatedAt;

  public static User from(User user) {
    return new User(user.getName(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getPassword(), user.getPaymentCard());
  }


  public User(String name, String firstName, String lastName, String email, String password, String paymentCard) {
    setName(name);
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
    setPassword(password);
    setPaymentCard(paymentCard);
  }

  public User() {

  }


  public String getName() {
    return name;
  }

  public void setName(String name) {
    if (name == null || name.isEmpty() || name.length() > 30) {
      throw new IllegalArgumentException("Name is required and must be less than 30 characters");
    }
    this.name = name;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    if (firstName == null || firstName.isEmpty() || firstName.length() > 30) {
      throw new IllegalArgumentException("First name is required and must be less than 30 characters");
    }
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    if (lastName == null || lastName.isEmpty() || lastName.length() > 30) {
      throw new IllegalArgumentException("Last name is required and must be less than 30 characters");
    }
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    if (email == null || email.isEmpty() || email.length() > 100) {
      throw new IllegalArgumentException("Email is required and must be less than 100 characters");
    }

    // check if an email format is valid
    if (!email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
      throw new IllegalArgumentException("Email format is invalid");
    }
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    if (password != null && password.length() > 256) {
      throw new IllegalArgumentException("Password is required and must be less than 256 characters");
    }
    this.password = password;
  }

  public String getPaymentCard() {
    return paymentCard;
  }

  public void setPaymentCard(String paymentCard) {
    if (paymentCard != null && paymentCard.length() > 50) {
      throw new IllegalArgumentException("Payment card must be less than 50 characters");
    }
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

  @Override
  public String toString() {
    return "User{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", password='" + password + '\'' +
            ", paymentCard='" + paymentCard + '\'' +
            ", enabled=" + enabled +
            '}';
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof User user)) return false;
    return isEnabled() == user.isEnabled() &&
            Objects.equals(getId(), user.getId()) &&
            Objects.equals(getName(), user.getName()) &&
            Objects.equals(getFirstName(), user.getFirstName()) &&
            Objects.equals(getLastName(), user.getLastName()) &&
            Objects.equals(getEmail(), user.getEmail());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getId(), getName(), getFirstName(), getLastName(), getEmail(), getPassword(), getPaymentCard(), isEnabled(), getCreatedAt(), getUpdatedAt());
  }
}
