package com.io.saas.service;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.dto.request.ExchangeFilterRequest;
import com.io.saas.dto.request.ExchangeInfoRequest;
import com.io.saas.dto.request.GatheringFilterRequest;
import com.io.saas.dto.request.GatheringInfoRequest;
import com.io.saas.dto.response.Pagination;
import com.io.saas.exception.BusinessException;
import com.io.saas.model.Exchange;
import com.io.saas.model.Gathering;
import com.io.saas.model.Item;
import com.io.saas.model.User;
import com.io.saas.repository.ExchangeRepository;
import com.io.saas.repository.GatheringRepository;
import com.io.saas.repository.ItemRepository;
import com.io.saas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private GatheringRepository gatheringRepository;

    @Autowired
    private ItemRepository itemRepository;


    public void addNewExchange(ExchangeInfoRequest exchangeInfoRequest) {

        Exchange exchangeObj = exchangeRepository.findByExchangeLeaderId(exchangeInfoRequest.getExchangeLeaderId());

        if (exchangeObj != null) {
            throw new BusinessException(BusinessExceptionConstant.LEADER_OF_COMMODITY_EXCHANGE_USED);
        }

        Exchange exchange = new Exchange(exchangeInfoRequest);

        exchangeRepository.save(exchange);
    }

    public void deleteExchange(String exchangeId) {
        Exchange exchange = exchangeRepository.findByExchangeId(exchangeId);

        exchangeRepository.delete(exchange);
    }




    public void addNewGathering(GatheringInfoRequest gatheringInfoRequest) {

        Gathering gatheringObj = gatheringRepository.findByGatheringLeaderId(gatheringInfoRequest.getGatheringLeaderId());

        if (gatheringObj != null) {
            throw new BusinessException(BusinessExceptionConstant.LEADER_OF_COMMODITY_GATHERING_USED);
        }

        Gathering gathering = new Gathering(gatheringInfoRequest);

        gatheringRepository.save(gathering);
    }

    public void deleteGathering(String gatheringId) {
        Gathering gathering = gatheringRepository.findByGathering(gatheringId);

        gatheringRepository.delete(gathering);
    }




    public Page<User> getListLeader(Pageable pageable, String role) {
        return userRepository.findByRole(pageable, role);
    }

    public Page<Item> getListItem(Pageable pageable, String locationType) {
        return itemRepository.getListItem(pageable, locationType);
    }
}
