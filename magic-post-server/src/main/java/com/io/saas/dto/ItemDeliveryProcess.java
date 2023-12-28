package com.io.saas.dto;

import lombok.Data;

@Data
public class ItemDeliveryProcess {
    private String locationId;
    private String locationType;
    private String employeeId;
    private Long commitTime;
    private String description;
}
