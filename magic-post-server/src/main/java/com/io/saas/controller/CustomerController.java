package com.io.saas.controller;

import com.io.saas.constant.BusinessExceptionConstant;
import com.io.saas.constant.Constant;
import com.io.saas.dto.response.Pagination;
import com.io.saas.dto.response.ResponseData;
import com.io.saas.dto.response.ResponseDataPagination;
import com.io.saas.exception.BusinessException;
import com.io.saas.model.Item;
import com.io.saas.service.CustomerService;
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
@RequestMapping(value = "/magic-post/v1/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomerController.class);

    @PostMapping(value = "/get-list-sent-item-by-customer")
    @PreAuthorize("hasAnyAuthority('USER_NORMAL')")
    public ResponseDataPagination getListItemCustomer(
            @RequestHeader("Authorization") String bearer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        ResponseDataPagination responseDataPagination = new ResponseDataPagination();
        Pagination pagination = new Pagination();

        try {
            String userId = JwtUtils.getUserId(bearer);

            Pageable pageable = PageRequest.of(page, size);
            Page<Item> itemPage = customerService.getListItemCustomer(pageable, userId);
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

    @GetMapping(value = "get-info-object")
    @PreAuthorize("hasAnyAuthority('USER_NORMAL')")
    public ResponseData getInfoObject(
            @RequestHeader("Authorization") String bearer,
            @RequestParam String objectType,
            @RequestParam String objectId
    ) {
        try {
            return new ResponseData(Constant.SUCCESS, customerService.getInfoObject(objectType, objectId), "");
        } catch (BusinessException businessException) {
            return new ResponseData(Constant.ERROR, businessException.getMessage());
        } catch (Exception exception) {
            LOGGER.error(Utils.printLogStackTrace(exception));
            return new ResponseData(Constant.ERROR, Constant.SOMETHING_WRONG);
        }
    }

}
