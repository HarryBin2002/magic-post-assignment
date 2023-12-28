package com.io.saas.dto.response;

import com.io.saas.dto.ItemDeliveryProcess;
import com.io.saas.model.User;
import lombok.Data;

import java.util.List;

@Data
public class DeliveryReceiptResponse {
    private User sendingItemUser;
    private User receivingItemUser;
    private String itemName;
    private String itemDescription;
    private String itemType;
    private Long itemMass;
    private String itemLocationType;
    private String itemStatus;
    private List<ItemDeliveryProcess> itemProcess;

}
