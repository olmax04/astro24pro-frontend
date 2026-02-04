package com.astro.backend.platform.livekit.service;

public interface ConsultationVideoService {

    String generateConnectionToken(String roomName, Integer userId);
}
