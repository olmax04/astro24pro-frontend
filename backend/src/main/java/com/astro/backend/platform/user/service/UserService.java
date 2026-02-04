package com.astro.backend.platform.user.service;

import com.astro.backend.platform.user.model.User;

public interface UserService {

    User findUserById(Integer id);
}
