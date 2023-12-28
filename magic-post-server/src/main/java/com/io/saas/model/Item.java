package com.io.saas.model;

import com.io.saas.dto.ItemDeliveryProcess;
import com.io.saas.dto.request.ConfirmReceivedItemRequest;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
public class Item {
    @Id
    private String id;
    private User sendingItemUser;
    private User receivingItemUser;
    private String itemName;
    private String itemDescription;
    private String itemType;
    private Long itemMass;
    private String itemLocationType;
    private String itemStatus;
    private List<ItemDeliveryProcess> itemProcess;

    public Item() {
    }

    public Item(ConfirmReceivedItemRequest confirmReceivedItemRequest) {
        this.itemName = confirmReceivedItemRequest.getItemName();
        this.itemDescription = confirmReceivedItemRequest.getItemDescription();
        this.itemType = confirmReceivedItemRequest.getItemType();
        this.itemMass = confirmReceivedItemRequest.getItemMass();
    }
}
