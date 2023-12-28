package com.io.saas.service;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.dto.response.UserLogInResponse;
import com.io.saas.dto.request.UserLoginRequest;
import com.io.saas.dto.request.UserRegisterRequest;
import com.io.saas.exception.BusinessException;
import com.io.saas.model.User;
import com.io.saas.repository.UserRepository;
import com.io.saas.util.Utils;
import com.io.saas.util.jwt.JwtUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailService userDetailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void register(UserRegisterRequest userRegisterRequest) {

        User user = userRepository.findByEmail(userRegisterRequest.getEmail());

        if (user != null) {
            throw new BusinessException(BusinessExceptionConstant.USER_EXIST);
        }

        User newUser = new User(userRegisterRequest);

        newUser.setPassword(passwordEncoder.encode(userRegisterRequest.getPassword()));
        newUser.setUserId(Utils.generateUUID());

        if (userRegisterRequest.getAge() != null) {
            newUser.setAge(userRegisterRequest.getAge());
        }

        if (StringUtils.isNotBlank(userRegisterRequest.getNickName())) {
            newUser.setNickName(userRegisterRequest.getNickName());
        }

        if (StringUtils.isNotBlank(userRegisterRequest.getAddress())) {
            newUser.setAddress(userRegisterRequest.getAddress());
        }

        userRepository.save(newUser);
    }

    public UserLogInResponse login(UserLoginRequest userLoginRequest) {
        String emailFromUser = userLoginRequest.getEmail();
        String passwordFromUser = userLoginRequest.getPassword();

        User user = userRepository.findByEmail(emailFromUser);

        if (user == null) {
            throw new BusinessException(BusinessExceptionConstant.USER_DOES_NOT_EXIST);
        }

        boolean logInSuccessfully = passwordEncoder.matches(passwordFromUser, user.getPassword());

        UserDetails userDetails = userDetailService.loadUserByUsername(user.getUserId());

        UserLogInResponse userLogInResponse = new UserLogInResponse();
        userLogInResponse.setLogInSuccessfully(logInSuccessfully);
        userLogInResponse.setUserId(user.getUserId());
        String accessToken = jwtUtils.generateAccessToken(userDetails);
        userLogInResponse.setAccessToken(accessToken);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);
        userLogInResponse.setRefreshToken(refreshToken);

        return userLogInResponse;
    }

    public User getUserInfo(String userId) {
        User user = userRepository.findByUserId(userId);
        return user;
    }

}
