package com.io.saas.controller;

import com.io.saas.constant.Constant;
import com.io.saas.dto.request.ExchangeFilterRequest;
import com.io.saas.dto.request.GatheringFilterRequest;
import com.io.saas.dto.request.NormalUserInfoRequest;
import com.io.saas.dto.response.Pagination;
import com.io.saas.dto.response.ResponseDataPagination;
import com.io.saas.exception.BusinessException;
import com.io.saas.model.Exchange;
import com.io.saas.model.Gathering;
import com.io.saas.model.Item;
import com.io.saas.model.User;
import com.io.saas.service.ListingService;
import com.io.saas.util.Utils;
import com.io.saas.util.jwt.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/magic-post/v1/listing")
public class ListingController {

    @Autowired
    private ListingService listingService;



    private static final Logger LOGGER = LoggerFactory.getLogger(ListingController.class);


    @GetMapping(value = "/get-list-item-exchange-or-gathering")
    @PreAuthorize("hasAuthority('MANAGER')" +
            "|| hasAuthority('LEADER_OF_COMMODITY_EXCHANGE')" +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_EXCHANGE') " +
            "|| hasAuthority('LEADER_OF_COMMODITY_GATHERING') " +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_GATHERING')")
    public ResponseDataPagination getListItemExchangeOrGathering(
            @RequestHeader("Authorization") String bearer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String locationType,
            @RequestParam String itemStatus
    ) {
        ResponseDataPagination responseDataPagination = new ResponseDataPagination();
        Pagination pagination = new Pagination();

        try {
            String userId = JwtUtils.getUserId(bearer);

            Pageable pageable = PageRequest.of(page, size);
            Page<Item> itemPage = listingService.getListItemExchangeOrGathering(pageable, userId, locationType, itemStatus);
            List<Item> itemList = itemPage.getContent();

            pagination.setCurrentPage(page);
            pagination.setPageSize(size);
            pagination.setTotalPage(itemPage.getTotalPages());
            pagination.setTotalRecords(itemPage.getTotalElements());

            responseDataPagination.setStatus(Constant.SUCCESS);
            responseDataPagination.setMessage("");
            responseDataPagination.setData(itemList);
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

    @PostMapping(value = "/get-list-exchange")
    @PreAuthorize("hasAuthority('MANAGER')" +
            "|| hasAuthority('LEADER_OF_COMMODITY_EXCHANGE')" +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_EXCHANGE') " +
            "|| hasAuthority('LEADER_OF_COMMODITY_GATHERING') " +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_GATHERING')")
    public ResponseDataPagination getListExchange(
            @RequestHeader("Authorization") String bearer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestBody ExchangeFilterRequest exchangeFilterRequest
            ) {
        ResponseDataPagination responseDataPagination = new ResponseDataPagination();
        Pagination pagination = new Pagination();

        try {

            Pageable pageable = PageRequest.of(page, size);
            Page<Exchange> exchangePage = listingService.getListExchange(pageable, exchangeFilterRequest);
            List<Exchange> exchangeList = exchangePage.getContent();

            pagination.setCurrentPage(page);
            pagination.setPageSize(size);
            pagination.setTotalPage(exchangePage.getTotalPages());
            pagination.setTotalRecords(exchangePage.getTotalElements());

            responseDataPagination.setStatus(Constant.SUCCESS);
            responseDataPagination.setMessage("");
            responseDataPagination.setData(exchangeList);
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


    @PostMapping(value = "/get-list-gathering")
    @PreAuthorize("hasAuthority('MANAGER')" +
            "|| hasAuthority('LEADER_OF_COMMODITY_EXCHANGE')" +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_EXCHANGE') " +
            "|| hasAuthority('LEADER_OF_COMMODITY_GATHERING') " +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_GATHERING')")
    public ResponseDataPagination getListGathering(
            @RequestHeader("Authorization") String bearer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestBody GatheringFilterRequest gatheringFilterRequest
    ) {
        ResponseDataPagination responseDataPagination = new ResponseDataPagination();
        Pagination pagination = new Pagination();

        try {

            Pageable pageable = PageRequest.of(page, size);
            Page<Gathering> gatheringPage = listingService.getListGathering(pageable, gatheringFilterRequest);
            List<Gathering> gatheringList = gatheringPage.getContent();

            pagination.setCurrentPage(page);
            pagination.setPageSize(size);
            pagination.setTotalPage(gatheringPage.getTotalPages());
            pagination.setTotalRecords(gatheringPage.getTotalElements());

            responseDataPagination.setStatus(Constant.SUCCESS);
            responseDataPagination.setMessage("");
            responseDataPagination.setData(gatheringList);
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

    @PostMapping(value = "/get-list-normal-user")
    @PreAuthorize("hasAuthority('EMPLOYEE_OF_COMMODITY_EXCHANGE')" +
            "|| hasAuthority('LEADER_OF_COMMODITY_EXCHANGE')" +
            "|| hasAuthority('LEADER_OF_COMMODITY_GATHERING')")
    public ResponseDataPagination getListNormalUser(
            @RequestHeader("Authorization") String bearer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestBody NormalUserInfoRequest normalUserInfoRequest
    ) {
        ResponseDataPagination responseDataPagination = new ResponseDataPagination();
        Pagination pagination = new Pagination();

        try {

            String userId = JwtUtils.getUserId(bearer);

            Pageable pageable = PageRequest.of(page, size);
            Page<User> userPage = listingService.getListNormalUser(userId, pageable, normalUserInfoRequest);
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

    @PostMapping(value = "/get-list-item-in-exchange-or-gathering")
    @PreAuthorize("hasAuthority('EMPLOYEE_OF_COMMODITY_EXCHANGE') " +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_GATHERING')")
    public ResponseDataPagination getListItemInExchangeOrGathering(
            @RequestHeader("Authorization") String bearer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String itemLocationType
    ) {
        ResponseDataPagination responseDataPagination = new ResponseDataPagination();
        Pagination pagination = new Pagination();

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Item> itemPage = listingService.getListItemInExchangeOrGathering(pageable, itemLocationType);
            List<Item> itemList = itemPage.getContent();

            pagination.setCurrentPage(page);
            pagination.setPageSize(size);
            pagination.setTotalPage(itemPage.getTotalPages());
            pagination.setTotalRecords(itemPage.getTotalElements());

            responseDataPagination.setStatus(Constant.SUCCESS);
            responseDataPagination.setMessage("");
            responseDataPagination.setData(itemList);
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

    @GetMapping(value = "/get-list-item-successful-or-failed")
    @PreAuthorize("hasAuthority('MANAGER')" +
            "|| hasAuthority('LEADER_OF_COMMODITY_EXCHANGE')" +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_EXCHANGE') " +
            "|| hasAuthority('LEADER_OF_COMMODITY_GATHERING') " +
            "|| hasAuthority('EMPLOYEE_OF_COMMODITY_GATHERING')")
    public ResponseDataPagination getListItemSuccessfulOrFailed(
            @RequestHeader("Authorization") String bearer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String itemLocationType,
            @RequestParam String itemStatus
    ) {
        ResponseDataPagination responseDataPagination = new ResponseDataPagination();
        Pagination pagination = new Pagination();

        try {

            Pageable pageable = PageRequest.of(page, size);
            Page<Item> itemPage = listingService.getListItemSuccessfulOrFailed(pageable, itemLocationType, itemStatus);
            List<Item> itemList = itemPage.getContent();

            pagination.setCurrentPage(page);
            pagination.setPageSize(size);
            pagination.setTotalPage(itemPage.getTotalPages());
            pagination.setTotalRecords(itemPage.getTotalElements());

            responseDataPagination.setStatus(Constant.SUCCESS);
            responseDataPagination.setMessage("");
            responseDataPagination.setData(itemList);
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
