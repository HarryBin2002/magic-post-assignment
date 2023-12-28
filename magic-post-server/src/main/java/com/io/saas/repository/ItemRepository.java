package com.io.saas.repository;

import com.io.saas.constant.Constant;
import com.io.saas.model.Exchange;
import com.io.saas.model.Item;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.Fields;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.repository.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ItemRepository {

    @Autowired
    private MongoTemplate mongoTemplate;



    public Item findByItemId(String itemId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(itemId));

        return mongoTemplate.findOne(query, Item.class);
    }

    public void save(Item item) {
        mongoTemplate.save(item);
    }


    public Page<Item> getListItem(Pageable pageable, String locationType) {
        Query query = this.buildQuery(locationType);

        long count = mongoTemplate.count(query, Item.class);

        int startRecord = pageable.getPageNumber() * pageable.getPageSize();
        query.skip(startRecord);
        query.limit(pageable.getPageSize());

        List<Item> itemList = mongoTemplate.find(query, Item.class);

        return PageableExecutionUtils.getPage(itemList, pageable, () -> count);
    }

    private Query buildQuery(String locationType) {
        Query query = new Query();

        if (StringUtils.equals(locationType, Constant.Item.ALL_LOCATION)) {
            query.addCriteria(Criteria.where("itemLocationType").is(Constant.Item.ALL_LOCATION));
        } else {
            query.addCriteria(Criteria.where("itemLocationType").is(locationType));
        }

        return query;
    }

    public Page<Item> getListItemExchange(Pageable pageable, String exchangeId, String itemStatus) {
        List<Item> itemList = this.buildQueryExchange(pageable, exchangeId, itemStatus);

        long count = itemList.size();

        return PageableExecutionUtils.getPage(itemList, pageable, () -> count);
    }

    public Page<Item> getListItemGathering(Pageable pageable, String gatheringId, String itemStatus) {
        List<Item> itemList = this.buildQueryExchange(pageable, gatheringId, itemStatus);

        long count = itemList.size();

        return PageableExecutionUtils.getPage(itemList, pageable, () -> count);
    }

    private List<Item> buildQueryExchange(Pageable pageable, String locationId, String itemStatus) {

        int startRecord = pageable.getPageNumber() * pageable.getPageSize();

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("itemProcess.locationId").is(locationId)),
                Aggregation.match(Criteria.where("itemStatus").is(itemStatus)),
                Aggregation.skip(startRecord),
                Aggregation.limit(pageable.getPageSize())
        );

        List<Item> itemList = mongoTemplate.aggregate(aggregation, "item", Item.class).getMappedResults();

        return itemList;
    }

    public Page<Item> getListItemByStatus(Pageable pageable, String itemStatus) {
        Query query = new Query();
        query.addCriteria(Criteria.where("itemStatus").is(itemStatus));

        long count = mongoTemplate.count(query, Item.class);

        int startRecord = pageable.getPageNumber() * pageable.getPageSize();
        query.skip(startRecord);
        query.limit(pageable.getPageSize());

        List<Item> itemList = mongoTemplate.find(query, Item.class);

        return PageableExecutionUtils.getPage(itemList, pageable, () -> count);
    }

    public List<Item> getListItemCustomer(Pageable pageable, String userId) {
        int startRecord = pageable.getPageNumber() * pageable.getPageSize();

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("sendingItemUser.userId").is(userId)),
                Aggregation.skip(startRecord),
                Aggregation.limit(pageable.getPageSize())
        );

        List<Item> itemList = mongoTemplate.aggregate(aggregation, "item", Item.class).getMappedResults();

        return itemList;
    }

    public Page<Item> getListItemInExchangeOrGathering(Pageable pageable, String itemLocationType) {
        Query query = new Query();
        query.addCriteria(Criteria.where("itemLocationType").is(itemLocationType));

        long count = mongoTemplate.count(query, Item.class);

        int startRecord = pageable.getPageNumber() * pageable.getPageSize();
        query.skip(startRecord);
        query.limit(pageable.getPageSize());

        List<Item> itemList = mongoTemplate.find(query, Item.class);

        return PageableExecutionUtils.getPage(itemList, pageable, () -> count);
    }

    public Page<Item> getListItemSuccessfulOrFailed(Pageable pageable, String itemLocationType, String itemStatus) {
        Query query = new Query();
        query.addCriteria(Criteria.where("itemLocationType").is(itemLocationType));
        query.addCriteria(Criteria.where("itemStatus").is(itemStatus));

        long count = mongoTemplate.count(query, Item.class);

        int startRecord = pageable.getPageNumber() * pageable.getPageSize();
        query.skip(startRecord);
        query.limit(pageable.getPageSize());

        List<Item> itemList = mongoTemplate.find(query, Item.class);

        return PageableExecutionUtils.getPage(itemList, pageable, () -> count);
    }

}
