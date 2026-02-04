package com.astro.backend.platform.livekit.service;

import com.astro.backend.platform.config.LiveKitProperties;
import com.astro.backend.platform.user.model.User;
import com.astro.backend.platform.user.model.UserRole;
import com.astro.backend.platform.user.service.UserService;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConsultationVideoServiceImpl implements ConsultationVideoService {

    private final LiveKitProperties liveKitProperties;

    private final UserService userService;

    @Override
    public String generateConnectionToken(String roomName, Integer userId) {
        User user = userService.findUserById(userId);

        AccessToken accessToken = new AccessToken(
                liveKitProperties.getKey(),
                liveKitProperties.getSecret()
        );

        accessToken.setIdentity(user.getId().toString());

        accessToken.setName(user.getName() + " " + user.getSurname());

        String metadata = String.format(
                "{\"role\": \"%s\", \"avatarId\": %d}",
                user.getRole(),
                user.getAvatarId()
        );

        accessToken.setMetadata(metadata);
        accessToken.addGrants(new RoomJoin(true), new RoomName(roomName));
        return accessToken.toJwt();
    }
}
