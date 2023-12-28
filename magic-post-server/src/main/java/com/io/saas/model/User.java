package com.io.saas.model;

import com.io.saas.dto.request.UserRegisterRequest;
import lombok.Data;
import org.springframework.data.annotation.Id;


@Data
public class User {

    @Id
    private String id;
    private String userId;
    private String name;
    private String email;
    private String password;
    private String role;
    private String phoneNumber;

    private int age;
    private String nickName;
    private String address;

    public User() {
    }

    public User(UserRegisterRequest userRegisterRequest) {
        this.name = userRegisterRequest.getName();
        this.email = userRegisterRequest.getEmail();
        this.role = userRegisterRequest.getRole();
        this.phoneNumber = userRegisterRequest.getPhoneNumber();
    }
}
