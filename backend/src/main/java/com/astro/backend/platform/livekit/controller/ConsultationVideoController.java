package com.astro.backend.platform.livekit.controller;
import com.astro.backend.platform.constants.ApiPaths;
import com.astro.backend.platform.livekit.service.ConsultationVideoService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(ApiPaths.VIDEO_ENDPOINT)
@RequiredArgsConstructor
public class ConsultationVideoController {

    private final ConsultationVideoService videoService;

    @GetMapping("/join")
    public ResponseEntity<Map<String, Object>> joinConsultation(@RequestParam @NotBlank String roomName,
                                                        @RequestParam @NotNull Integer userId) {
        String token = videoService.generateConnectionToken(roomName, userId);
        return ResponseEntity.ok(Map.of("token", token));
    }


}
