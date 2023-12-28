package com.io.saas.controller;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.constant.Constant;
import com.io.saas.dto.response.UserLogInResponse;
import com.io.saas.dto.request.UserLoginRequest;
import com.io.saas.dto.request.UserRegisterRequest;
import com.io.saas.dto.response.ResponseData;
import com.io.saas.exception.BusinessException;
import com.io.saas.model.User;
import com.io.saas.service.UserService;
import com.io.saas.util.Utils;
import com.io.saas.util.jwt.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/magic-post/v1/user")
public class UserController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;


    @PostMapping(value = "/register")
    public ResponseData register(
            @Valid @RequestBody UserRegisterRequest userRegisterRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            userService.register(userRegisterRequest);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }

    @PostMapping(value = "/login")
    public ResponseData login(
            @Valid @RequestBody UserLoginRequest userLoginRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            UserLogInResponse userLogInResponse = userService.login(userLoginRequest);

            return new ResponseData(Constant.SUCCESS, userLogInResponse, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }


    @GetMapping(value = "/get-user-info")
    @PreAuthorize("hasAuthority('MANAGER')" +
            "|| hasAuthority('LEADER_OF_COMMODITY_EXCHANGE')" +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_EXCHANGE') " +
            "|| hasAuthority('LEADER_OF_COMMODITY_GATHERING') " +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_GATHERING')")
    public ResponseData getUserInfo(
            @RequestHeader("Authorization") String bearer
    ) {
        try {
            String userId = JwtUtils.getUserId(bearer);
            User user = userService.getUserInfo(userId);
            return new ResponseData(Constant.SUCCESS, user, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }

}
