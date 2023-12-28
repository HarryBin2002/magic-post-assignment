package com.io.saas.repository;


import com.io.saas.constant.Constant;
import com.io.saas.dto.request.ExchangeFilterRequest;
import com.io.saas.model.Exchange;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.repository.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ExchangeRepository {

    @Autowired
    private MongoTemplate mongoTemplate;



    public Exchange findByExchangeId(String exchangeId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(exchangeId));

        return mongoTemplate.findOne(query, Exchange.class);
    }

    public Exchange findByExchangeLeaderId(String exchangeLeaderId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("exchangeLeaderId").is(exchangeLeaderId));

        return mongoTemplate.findOne(query, Exchange.class);
    }

    public void save(Exchange exchange) {
        mongoTemplate.save(exchange);
    }

    public void delete(Exchange exchange) {
        mongoTemplate.remove(exchange);
    }


    public Page<Exchange> getListExchange(Pageable pageable, ExchangeFilterRequest exchangeFilterRequest) {
        Query query = this.buildQuery(exchangeFilterRequest);

        long count = mongoTemplate.count(query, Exchange.class);

        int startRecord = pageable.getPageNumber() * pageable.getPageSize();
        query.skip(startRecord);
        query.limit(pageable.getPageSize());

        List<Exchange> exchangeList = mongoTemplate.find(query, Exchange.class);

        return PageableExecutionUtils.getPage(exchangeList, pageable, () -> count);
    }

    private Query buildQuery(ExchangeFilterRequest exchangeFilterRequest) {
        Query query = new Query();

        if (StringUtils.isNotBlank(exchangeFilterRequest.getExchangeName())) {
            query.addCriteria(Criteria.where("exchangeName").regex("(?i)" + exchangeFilterRequest.getExchangeName()));
        }

        if (StringUtils.isNotBlank(exchangeFilterRequest.getExchangeAddress())) {
            query.addCriteria(Criteria.where("exchangeAddress").regex("(?i)" + exchangeFilterRequest.getExchangeAddress()));
        }

        return query;
    }



}
