package edu.mtisw.prestabank_backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String name;
    private String lastName;
    private String email;
    private String rut;
    private int birthDay;
    private int birthMonth;
    private int birthYear;
    private String password;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRut() {
        return rut;
    }

    public void setRut(String rut) {
        this.rut = rut;
    }

    public int getBirthDay() {
        return birthDay;
    }

    public void setBirthDay(int day) {
        this.birthDay = day;
    }

    public int getBirthMonth() {
        return birthMonth;
    }

    public void setBirthMonth(int month) {
        this.birthMonth = month;
    }

    public int getBirthYear() {
        return birthYear;
    }

    public void setBirthYear(int year) {
        this.birthYear = year;
    }
}


