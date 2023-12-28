package com.io.saas.controller;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.constant.Constant;
import com.io.saas.dto.request.ExchangeInfoRequest;
import com.io.saas.dto.request.GatheringInfoRequest;
import com.io.saas.dto.response.Pagination;
import com.io.saas.dto.response.ResponseData;
import com.io.saas.dto.response.ResponseDataPagination;
import com.io.saas.exception.BusinessException;
import com.io.saas.model.Item;
import com.io.saas.model.User;
import com.io.saas.service.ManagerService;
import com.io.saas.util.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(value = "/magic-post/v1/manager")
public class ManagerController {

    @Autowired
    private ManagerService managerService;



    private static final Logger LOGGER = LoggerFactory.getLogger(ManagerController.class);

    // exchange management api

    @PostMapping(value = "/add-new-exchange")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseData addNewExchange(
            @RequestHeader("Authorization") String bearer,
            @RequestBody ExchangeInfoRequest exchangeInfoRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            managerService.addNewExchange(exchangeInfoRequest);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }

    @PostMapping(value = "/delete-exchange")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseData deleteExchange(
            @RequestHeader("Authorization") String bearer,
            @RequestParam String exchangeId
    ) {
        try {

            managerService.deleteExchange(exchangeId);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }
    



    // gathering management
    @PostMapping(value = "/add-new-gathering")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseData addNewGathering(
            @RequestHeader("Authorization") String bearer,
            @RequestBody GatheringInfoRequest gatheringInfoRequest,
            BindingResult bindingResult
    ) {
        try {
            if (bindingResult.hasErrors()) {
                throw new BusinessException(BusinessExceptionConstant.VALIDATION_ERROR);
            }

            managerService.addNewGathering(gatheringInfoRequest);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }

    @PostMapping(value = "/delete-gathering")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseData deleteGathering(
            @RequestHeader("Authorization") String bearer,
            @RequestParam String gatheringId
    ) {
        try {

            managerService.deleteGathering(gatheringId);

            return new ResponseData(Constant.SUCCESS, "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }



    @GetMapping(value = "/get-list-leader")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseDataPagination getListLeader(
            @RequestHeader("Authorization") String bearer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String role
    ) {
        ResponseDataPagination responseDataPagination = new ResponseDataPagination();
        Pagination pagination = new Pagination();

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> userPage = managerService.getListLeader(pageable, role);
            List<User> userList = userPage.getContent();

            pagination.setCurrentPage(page);
            pagination.setPageSize(size);
            pagination.setTotalPage(userPage.getTotalPages());
            pagination.setTotalRecords(userPage.getTotalElements());

            responseDataPagination.setStatus(Constant.SUCCESS);
            responseDataPagination.setMessage("");
            responseDataPagination.setData(userList);
            responseDataPagination.setPagination(pagination);

        } catch (BusinessException businessException) {
            responseDataPagination.setStatus(Constant.ERROR);
            responseDataPagination.setMessage(businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            responseDataPagination.setStatus(Constant.ERROR);
            responseDataPagination.setMessage(Constant.SOMETHING_WRONG);
        }

        return responseDataPagination;
    }
}
