package com.io.saas.dto.request;

import lombok.Data;

@Data
public class ExchangeInfoRequest {
    private String exchangeName;
    private String exchangeAddress;
    private String exchangeLeaderId;
}
