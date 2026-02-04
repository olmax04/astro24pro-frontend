package com.astro.backend.platform.user.model;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "avatar_id")
    private Integer avatarId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(nullable = false)
    private String patronymic;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @Column(name = "specialist_details_specialization")
    private String specialization;

    @Column(name = "specialist_details_experience")
    private BigDecimal experience;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "specialist_details_biography", columnDefinition = "jsonb")
    private Map<String, Object> biography;

    @Column(name = "specialist_details_service_cost_amount")
    private BigDecimal serviceCostAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "specialist_details_service_cost_currency", columnDefinition = "enum_users_specialist_details_service_cost_currency")
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ServiceCurrency serviceCostCurrency;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "salt")
    private String salt;

    @Column(name = "hash")
    private String hash;

    @Column(name = "login_attempts")
    private BigDecimal loginAttempts;

    @Column(name = "lock_until")
    private OffsetDateTime lockUntil;


}
