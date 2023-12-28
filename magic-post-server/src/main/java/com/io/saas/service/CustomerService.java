package com.io.saas.service;

import com.io.saas.constant.Constant;
import com.io.saas.model.Item;
import com.io.saas.repository.ExchangeRepository;
import com.io.saas.repository.GatheringRepository;
import com.io.saas.repository.ItemRepository;
import com.io.saas.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ExchangeRepository exchangeRepository;

    @Autowired
    private GatheringRepository gatheringRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<Item> getListItemCustomer(Pageable pageable, String userId) {
        List<Item> itemList = itemRepository.getListItemCustomer(pageable, userId);

        long count = itemList.size();

        return PageableExecutionUtils.getPage(itemList, pageable, () -> count);
    }

    public Object getInfoObject(String objectType, String objectId) {
        if (StringUtils.equals(objectType, Constant.Item.EXCHANGE)) {
            return exchangeRepository.findByExchangeId(objectId);
        }

        if (StringUtils.equals(objectType, Constant.Item.GATHERING)) {
            return gatheringRepository.findByGathering(objectId);
        }

        if (StringUtils.equals(objectType, "EMPLOYEE")) {
            return userRepository.findByUserId(objectId);
        }

        return null;
    }
}
