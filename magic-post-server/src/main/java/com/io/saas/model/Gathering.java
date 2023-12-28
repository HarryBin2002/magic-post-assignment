package com.io.saas.model;

import com.io.saas.dto.request.GatheringInfoRequest;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class Gathering {

    @Id
    private String id;
    private String gatheringName;
    private String gatheringAddress;
    private String gatheringLeaderId;

    public Gathering() {
    }

    public Gathering(GatheringInfoRequest gatheringInfoRequest) {
        this.gatheringName = gatheringInfoRequest.getGatheringName();
        this.gatheringAddress = gatheringInfoRequest.getGatheringAddress();
        this.gatheringLeaderId = gatheringInfoRequest.getGatheringLeaderId();
    }

}
