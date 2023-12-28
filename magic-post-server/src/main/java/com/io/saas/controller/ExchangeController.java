package com.io.saas.controller;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.constant.Constant;
import com.io.saas.dto.request.ConfirmReceivedItemRequest;
import com.io.saas.dto.request.ExchangeInfoRequest;
import com.io.saas.dto.request.UpdateItemProcessRequest;
import com.io.saas.dto.request.UserRegisterRequest;
import com.io.saas.dto.response.DeliveryReceiptResponse;
import com.io.saas.dto.response.ResponseData;
import com.io.saas.exception.BusinessException;
import com.io.saas.service.ExchangeService;
import com.io.saas.util.Utils;
import com.io.saas.util.jwt.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/magic-post/v1/exchange")
public class ExchangeController {

    @Autowired
    private ExchangeService exchangeService;


    private static final Logger LOGGER = LoggerFactory.getLogger(ExchangeController.class);


    // api for LEADER_OF_COMMODITY_EXCHANGE

    @PostMapping(value = "/add-employee-account")
    @PreAuthorize("hasAnyAuthority('LEADER_OF_COMMODITY_EXCHANGE')")
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
            exchangeService.addEmployeeAccount(userId, userRegisterRequest);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }

    @PostMapping(value = "/edit-exchange-info")
    @PreAuthorize("hasAnyAuthority('LEADER_OF_COMMODITY_EXCHANGE')")
    public ResponseData editExchangeInfo(
            @RequestHeader("Authorization") String bearer,
            @RequestParam String exchangeId,
            @RequestBody ExchangeInfoRequest exchangeInfoRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            exchangeService.editExchangeInfo(exchangeId, exchangeInfoRequest);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }


    // api for EMPLOYEE_OF_COMMODITY_EXCHANGE
    @PostMapping(value = "/confirm-received-item")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE_OF_COMMODITY_EXCHANGE')")
    public ResponseData confirmReceivedItem(
            @RequestHeader("Authorization") String bearer,
            @RequestBody ConfirmReceivedItemRequest confirmReceivedItemRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            String userId = JwtUtils.getUserId(bearer);
            DeliveryReceiptResponse deliveryReceiptResponse = exchangeService.confirmReceivedItem(userId, confirmReceivedItemRequest);

            return new ResponseData(Constant.SUCCESS, deliveryReceiptResponse, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }


    @PostMapping(value = "/update-item-process-in-exchange")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE_OF_COMMODITY_EXCHANGE')")
    public ResponseData updateItemProcessInExchange(
            @RequestHeader("Authorization") String bearer,
            @RequestBody UpdateItemProcessRequest updateItemProcessRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            String userId = JwtUtils.getUserId(bearer);
            exchangeService.updateItemProcessInExchange(userId, updateItemProcessRequest);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }



}
