package com.io.saas.dto.request;

import lombok.Data;

@Data
public class GatheringInfoRequest {

    private String gatheringName;
    private String gatheringAddress;
    private String gatheringLeaderId;
}
