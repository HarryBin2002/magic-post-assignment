package com.io.saas.service;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.constant.Constant;
import com.io.saas.dto.ItemDeliveryProcess;
import com.io.saas.dto.request.GatheringInfoRequest;
import com.io.saas.dto.request.UpdateItemProcessRequest;
import com.io.saas.dto.request.UserRegisterRequest;
import com.io.saas.exception.BusinessException;
import com.io.saas.model.Gathering;
import com.io.saas.model.Item;
import com.io.saas.model.User;
import com.io.saas.repository.GatheringRepository;
import com.io.saas.repository.ItemRepository;
import com.io.saas.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GatheringService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GatheringRepository gatheringRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserService userService;

    public void addEmployeeAccount(String userId, UserRegisterRequest userRegisterRequest) {
        User user = userRepository.findByUserId(userId);

        if (user == null) {
            throw new BusinessException(BusinessExceptionConstant.USER_DOES_NOT_EXIST);
        }

        if (!StringUtils.equals(user.getRole(), Constant.UserRole.LEADER_OF_COMMODITY_GATHERING)) {
            throw new BusinessException(BusinessExceptionConstant.VALIDATION_ROLE);
        }

        userRegisterRequest.setRole(Constant.UserRole.EMPLOYEE_OF_COMMODITY_GATHERING);

        userService.register(userRegisterRequest);
    }

    public void editGatheringInfo(String gatheringId, GatheringInfoRequest gatheringInfoRequest) {
        Gathering gathering = gatheringRepository.findByGathering(gatheringId);

        if (StringUtils.isNotBlank(gatheringInfoRequest.getGatheringName())) {
            gathering.setGatheringName(gatheringInfoRequest.getGatheringName());
        }

        if (StringUtils.isNotBlank(gatheringInfoRequest.getGatheringAddress())) {
            gathering.setGatheringAddress(gatheringInfoRequest.getGatheringAddress());
        }

        gatheringRepository.save(gathering);
    }

    public void updateItemProcessInGathering(String userId, UpdateItemProcessRequest updateItemProcessRequest) {
        Item item = itemRepository.findByItemId(updateItemProcessRequest.getItemId());

        if (StringUtils.isNotBlank(updateItemProcessRequest.getExchangeId()) && StringUtils.isNotBlank(updateItemProcessRequest.getGatheringId())) {
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

        if (StringUtils.isNotBlank(updateItemProcessRequest.getGatheringId())) {
            item.setItemLocationType(Constant.Item.GATHERING);
            item.setItemStatus(Constant.Item.OLD_GATHERING_SENT_TO_NEW_GATHERING);

            List<ItemDeliveryProcess> itemProcess = item.getItemProcess();
            ItemDeliveryProcess itemDeliveryProcess = new ItemDeliveryProcess();
            itemDeliveryProcess.setLocationId(updateItemProcessRequest.getGatheringId());
            itemDeliveryProcess.setLocationType(Constant.Item.GATHERING);
            itemDeliveryProcess.setEmployeeId(userId);
            itemDeliveryProcess.setCommitTime(System.currentTimeMillis() / 1000);
            itemDeliveryProcess.setDescription(Constant.Item.OLD_GATHERING_SENT_TO_NEW_GATHERING);
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

        itemRepository.save(item);
    }

}
