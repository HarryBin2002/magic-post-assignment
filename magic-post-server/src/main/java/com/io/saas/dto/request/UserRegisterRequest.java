package com.io.saas.dto.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UserRegisterRequest {

    @NotNull
    private String name;
    @NotNull
    private String email;
    @NotNull
    private String password;
    @NotNull
    private String role;
    @NotNull
    private String phoneNumber;

    private Integer age;
    private String nickName;
    private String address;

}
