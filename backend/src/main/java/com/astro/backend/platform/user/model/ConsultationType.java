package com.astro.backend.platform.user.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ConsultationType {

    @JsonProperty("Видеозвонок")
    VIDEO("Видеозвонок"),
    @JsonProperty("Аудиозвонок")
    AUDIO("Аудиозвонок"),
    @JsonProperty("Чат")
    CHAT("Чат"),
    @JsonProperty("Личная встреча")
    MEETING("Личная встреча");

    private final String value;

    ConsultationType(String value) { this.value = value; }

    @JsonValue
    public String getValue() { return value; }
}
