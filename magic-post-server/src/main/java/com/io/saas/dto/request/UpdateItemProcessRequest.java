package com.io.saas.dto.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateItemProcessRequest {

    @NotNull
    private String itemId;
    private String exchangeId;
    private String gatheringId;
    private String userReceivedStatus;

}
