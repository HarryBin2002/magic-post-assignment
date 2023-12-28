package com.io.saas.service;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.constant.Constant;
import com.io.saas.dto.request.ExchangeFilterRequest;
import com.io.saas.dto.request.GatheringFilterRequest;
import com.io.saas.dto.request.NormalUserInfoRequest;
import com.io.saas.exception.BusinessException;
import com.io.saas.model.Exchange;
import com.io.saas.model.Gathering;
import com.io.saas.model.Item;
import com.io.saas.model.User;
import com.io.saas.repository.ExchangeRepository;
import com.io.saas.repository.GatheringRepository;
import com.io.saas.repository.ItemRepository;
import com.io.saas.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ListingService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private GatheringRepository gatheringRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<Item> getListItemExchangeOrGathering(Pageable pageable, String userId, String locationType, String itemStatus) {
        if (StringUtils.equals(locationType, Constant.Item.EXCHANGE)) {
            Exchange exchange = exchangeRepository.findByExchangeLeaderId(userId);
            String exchangeId = exchange.getId();
            return itemRepository.getListItemExchange(pageable, exchangeId, itemStatus);
        } else if (StringUtils.equals(locationType, Constant.Item.GATHERING)) {
            Gathering gathering = gatheringRepository.findByGatheringLeaderId(userId);
            String gatheringId = gathering.getId();
            return itemRepository.getListItemGathering(pageable, gatheringId, itemStatus);
        } else if (StringUtils.equals(locationType, Constant.Item.ALL_LOCATION)) {
            return itemRepository.getListItemByStatus(pageable, itemStatus);
        } else {
            return null;
        }
    }

    public Page<Exchange> getListExchange(Pageable pageable, ExchangeFilterRequest exchangeFilterRequest) {
        return exchangeRepository.getListExchange(pageable, exchangeFilterRequest);
    }

    public Page<Gathering> getListGathering(Pageable pageable, GatheringFilterRequest gatheringFilterRequest) {
        return gatheringRepository.getListGathering(pageable, gatheringFilterRequest);
    }

    public Page<User> getListNormalUser(String userId, Pageable pageable, NormalUserInfoRequest normalUserInfoRequest) {
        User user = userRepository.findByUserId(userId);

        if (!StringUtils.equals(user.getRole(), Constant.UserRole.EMPLOYEE_OF_COMMODITY_EXCHANGE)) {
            throw new BusinessException(BusinessExceptionConstant.VALIDATION_ROLE);
        }

        return userRepository.getListNormalUser(pageable, normalUserInfoRequest);
    }

    public Page<Item> getListItemInExchangeOrGathering(Pageable pageable, String itemLocationType) {
        return itemRepository.getListItemInExchangeOrGathering(pageable, itemLocationType);
    }

    public Page<Item> getListItemSuccessfulOrFailed(Pageable pageable, String itemLocationType, String itemStatus) {
        return itemRepository.getListItemSuccessfulOrFailed(pageable, itemLocationType, itemStatus);
    }
}
