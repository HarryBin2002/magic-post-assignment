package com.io.saas.model;


import com.io.saas.dto.request.ExchangeInfoRequest;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class Exchange {

    @Id
    private String id;
    private String exchangeName;
    private String exchangeAddress;
    private String exchangeLeaderId;

    public Exchange() {
    }

    public Exchange(ExchangeInfoRequest exchangeInfoRequest) {
        this.exchangeName = exchangeInfoRequest.getExchangeName();
        this.exchangeAddress = exchangeInfoRequest.getExchangeAddress();
        this.exchangeLeaderId = exchangeInfoRequest.getExchangeLeaderId();
    }
}
