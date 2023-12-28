package com.io.saas.dto.request;

import com.io.saas.model.User;
import lombok.Data;

@Data
public class ConfirmReceivedItemRequest {

    private String sendingItemUserId;
    private String receivingItemUserId;
    private String itemName;
    private String itemDescription;
    private String itemType;
    private Long itemMass;

    private String exchangeId;



}
