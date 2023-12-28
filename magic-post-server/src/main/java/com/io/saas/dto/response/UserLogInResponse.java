package com.io.saas.dto.response;

import lombok.Data;

@Data
public class UserLogInResponse {

    private boolean logInSuccessfully;
    private String userId;
    private String accessToken;
    private String refreshToken;

}
