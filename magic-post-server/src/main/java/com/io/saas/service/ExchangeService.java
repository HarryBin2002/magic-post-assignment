package com.io.saas.service;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.constant.Constant;
import com.io.saas.dto.ItemDeliveryProcess;
import com.io.saas.dto.request.*;
import com.io.saas.dto.response.DeliveryReceiptResponse;
import com.io.saas.exception.BusinessException;
import com.io.saas.model.Exchange;
import com.io.saas.model.Item;
import com.io.saas.model.User;
import com.io.saas.repository.ExchangeRepository;
import com.io.saas.repository.ItemRepository;
import com.io.saas.repository.UserRepository;
import com.io.saas.util.MapperUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExchangeService {

    @Autowired
    private UserService userService;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ExchangeRepository exchangeRepository;


    public void addEmployeeAccount(String userId, UserRegisterRequest userRegisterRequest) {
        User user = userRepository.findByUserId(userId);

        if (user == null) {
            throw new BusinessException(BusinessExceptionConstant.USER_DOES_NOT_EXIST);
        }

        if (!StringUtils.equals(user.getRole(), Constant.UserRole.LEADER_OF_COMMODITY_EXCHANGE)) {
            throw new BusinessException(BusinessExceptionConstant.VALIDATION_ROLE);
        }

        userRegisterRequest.setRole(Constant.UserRole.EMPLOYEE_OF_COMMODITY_EXCHANGE);

        userService.register(userRegisterRequest);
    }

    public void editExchangeInfo(String exchangeId, ExchangeInfoRequest exchangeInfoRequest) {
        Exchange exchange = exchangeRepository.findByExchangeId(exchangeId);

        if (StringUtils.isNotBlank(exchangeInfoRequest.getExchangeName())) {
            exchange.setExchangeName(exchangeInfoRequest.getExchangeName());
        }

        if (StringUtils.isNotBlank(exchangeInfoRequest.getExchangeAddress())) {
            exchange.setExchangeAddress(exchangeInfoRequest.getExchangeAddress());
        }

        exchangeRepository.save(exchange);
    }


    public DeliveryReceiptResponse confirmReceivedItem(String userId, ConfirmReceivedItemRequest confirmReceivedItemRequest) {
        Item newItem = new Item(confirmReceivedItemRequest);

        User sendingItemUser = userRepository.findByUserId(confirmReceivedItemRequest.getSendingItemUserId());
        User receivingItemUser = userRepository.findByUserId(confirmReceivedItemRequest.getReceivingItemUserId());

        newItem.setSendingItemUser(sendingItemUser);
        newItem.setReceivingItemUser(receivingItemUser);
        newItem.setItemLocationType(Constant.Item.EXCHANGE);
        newItem.setItemStatus(Constant.Item.USER_SENT_TO_EXCHANGE);

        List<ItemDeliveryProcess> itemProcess = new ArrayList<>();
        ItemDeliveryProcess itemDeliveryProcess = new ItemDeliveryProcess();
        itemDeliveryProcess.setLocationId(confirmReceivedItemRequest.getExchangeId());
        itemDeliveryProcess.setLocationType(Constant.Item.EXCHANGE);
        itemDeliveryProcess.setEmployeeId(userId);
        itemDeliveryProcess.setCommitTime(System.currentTimeMillis() / 1000);
        itemDeliveryProcess.setDescription(Constant.Item.USER_SENT_TO_EXCHANGE);
        itemProcess.add(itemDeliveryProcess);

        newItem.setItemProcess(itemProcess);

        itemRepository.save(newItem);

        DeliveryReceiptResponse deliveryReceiptResponse = MapperUtil.map(newItem, DeliveryReceiptResponse.class);

        return deliveryReceiptResponse;
    }

    public void updateItemProcessInExchange(String userId, UpdateItemProcessRequest updateItemProcessRequest) {
        Item item = itemRepository.findByItemId(updateItemProcessRequest.getItemId());


        if (StringUtils.isNotBlank(updateItemProcessRequest.getGatheringId())) {
            item.setItemLocationType(Constant.Item.GATHERING);
            item.setItemStatus(Constant.Item.EXCHANGE_SENT_TO_GATHERING);

            List<ItemDeliveryProcess> itemProcess = item.getItemProcess();
            ItemDeliveryProcess itemDeliveryProcess = new ItemDeliveryProcess();
            itemDeliveryProcess.setLocationId(updateItemProcessRequest.getGatheringId());
            itemDeliveryProcess.setLocationType(Constant.Item.GATHERING);
            itemDeliveryProcess.setEmployeeId(userId);
            itemDeliveryProcess.setCommitTime(System.currentTimeMillis() / 1000);
            itemDeliveryProcess.setDescription(Constant.Item.EXCHANGE_SENT_TO_GATHERING);
            itemProcess.add(itemDeliveryProcess);
        }


        if (StringUtils.isNotBlank(updateItemProcessRequest.getExchangeId())) {
            item.setItemLocationType(Constant.Item.EXCHANGE);
            item.setItemStatus(Constant.Item.GATHERING_SENT_TO_EXCHANGE);

            List<ItemDeliveryProcess> itemProcess = item.getItemProcess();
            ItemDeliveryProcess itemDeliveryProcess = new ItemDeliveryProcess();
            itemDeliveryProcess.setLocationId(updateItemProcessRequest.getExchangeId());
            itemDeliveryProcess.setLocationType(Constant.Item.EXCHANGE);
            itemDeliveryProcess.setEmployeeId(userId);
            itemDeliveryProcess.setCommitTime(System.currentTimeMillis() / 1000);
            itemDeliveryProcess.setDescription(Constant.Item.GATHERING_SENT_TO_EXCHANGE);
            itemProcess.add(itemDeliveryProcess);

        }


        if (StringUtils.isNotBlank(updateItemProcessRequest.getUserReceivedStatus())) {

            if (StringUtils.equals(updateItemProcessRequest.getUserReceivedStatus(), Constant.Item.USER_RECEIVED_SUCCESSFUL)) {
                item.setItemLocationType(Constant.Item.USER_RECEIVED_SUCCESSFUL);
                item.setItemStatus(Constant.Item.EXCHANGE_SENT_TO_USER);

                List<ItemDeliveryProcess> itemProcess = item.getItemProcess();
                ItemDeliveryProcess itemDeliveryProcess = new ItemDeliveryProcess();
                User receivingItemUser = item.getReceivingItemUser();
                itemDeliveryProcess.setLocationId(receivingItemUser.getUserId());
                itemDeliveryProcess.setLocationType(Constant.Item.USER_RECEIVED_SUCCESSFUL);
                itemDeliveryProcess.setEmployeeId(userId);
                itemDeliveryProcess.setCommitTime(System.currentTimeMillis() / 1000);
                itemDeliveryProcess.setDescription(Constant.Item.EXCHANGE_SENT_TO_USER + " and " + Constant.Item.USER_RECEIVED_SUCCESSFUL);
                itemProcess.add(itemDeliveryProcess);
            } else if (StringUtils.equals(updateItemProcessRequest.getUserReceivedStatus(), Constant.Item.USER_RECEIVED_FAILED)) {
                item.setItemLocationType(Constant.Item.USER_RECEIVED_FAILED);
                item.setItemStatus(Constant.Item.EXCHANGE_SENT_TO_USER);

                List<ItemDeliveryProcess> itemProcess = item.getItemProcess();

                ItemDeliveryProcess itemDeliveryProcess1 = new ItemDeliveryProcess();
                User receivingItemUser = item.getReceivingItemUser();
                itemDeliveryProcess1.setLocationId(receivingItemUser.getUserId());
                itemDeliveryProcess1.setLocationType(Constant.Item.USER_RECEIVED_FAILED);
                itemDeliveryProcess1.setEmployeeId(userId);
                itemDeliveryProcess1.setCommitTime(System.currentTimeMillis() / 1000);
                itemDeliveryProcess1.setDescription(Constant.Item.EXCHANGE_SENT_TO_USER + " and " + Constant.Item.USER_RECEIVED_FAILED);
                itemProcess.add(itemDeliveryProcess1);

                item.setItemLocationType(Constant.Item.EXCHANGE);
                item.setItemStatus(Constant.Item.USER_SENT_TO_EXCHANGE_AGAIN);

                ItemDeliveryProcess itemDeliveryProcess2 = new ItemDeliveryProcess();
                itemDeliveryProcess2.setLocationId(updateItemProcessRequest.getExchangeId());
                itemDeliveryProcess2.setLocationType(Constant.Item.EXCHANGE);
                itemDeliveryProcess2.setEmployeeId(userId);
                itemDeliveryProcess2.setCommitTime(System.currentTimeMillis() / 1000);
                itemDeliveryProcess2.setDescription(Constant.Item.EXCHANGE_SENT_TO_USER + " and " + Constant.Item.USER_SENT_TO_EXCHANGE_AGAIN);
                itemProcess.add(itemDeliveryProcess2);
            }
        }

        itemRepository.save(item);
    }

}
