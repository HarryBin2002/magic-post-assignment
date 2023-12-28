package com.io.saas.controller;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.constant.Constant;
import com.io.saas.dto.request.ExchangeInfoRequest;
import com.io.saas.dto.request.GatheringInfoRequest;
import com.io.saas.dto.request.UpdateItemProcessRequest;
import com.io.saas.dto.request.UserRegisterRequest;
import com.io.saas.dto.response.ResponseData;
import com.io.saas.exception.BusinessException;
import com.io.saas.service.GatheringService;
import com.io.saas.util.Utils;
import com.io.saas.util.jwt.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/magic-post/v1/gathering")
public class GatheringController {

    @Autowired
    private GatheringService gatheringService;

    private static final Logger LOGGER = LoggerFactory.getLogger(GatheringController.class);

    // api for LEADER_OF_COMMODITY_GATHERING

    @PostMapping(value = "/add-employee-account")
    @PreAuthorize("hasAnyAuthority('LEADER_OF_COMMODITY_GATHERING')")
    public ResponseData addEmployeeAccount(
            @RequestHeader("Authorization") String bearer,
            @RequestBody UserRegisterRequest userRegisterRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            String userId = JwtUtils.getUserId(bearer);
            gatheringService.addEmployeeAccount(userId, userRegisterRequest);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }

    @PostMapping(value = "/edit-gathering-info")
    @PreAuthorize("hasAnyAuthority('LEADER_OF_COMMODITY_GATHERING')")
    public ResponseData editGatheringInfo(
            @RequestHeader("Authorization") String bearer,
            @RequestParam String gatheringId,
            @RequestBody GatheringInfoRequest gatheringInfoRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            gatheringService.editGatheringInfo(gatheringId, gatheringInfoRequest);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }


    // api for EMPLOYEE_OF_COMMODITY_GATHERING

    @PostMapping(value = "/update-item-process-in-gathering")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE_OF_COMMODITY_GATHERING')")
    public ResponseData updateItemProcessInGathering(
            @RequestHeader("Authorization") String bearer,
            @RequestBody UpdateItemProcessRequest updateItemProcessRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            String userId = JwtUtils.getUserId(bearer);
            gatheringService.updateItemProcessInGathering(userId, updateItemProcessRequest);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }

}
