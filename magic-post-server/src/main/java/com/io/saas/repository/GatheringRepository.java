package com.io.saas.repository;

import com.io.saas.dto.request.GatheringFilterRequest;
import com.io.saas.model.Gathering;
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
public class GatheringRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public Gathering findByGathering(String gatheringId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(gatheringId));

        return mongoTemplate.findOne(query, Gathering.class);
    }

    public Gathering findByGatheringLeaderId(String gatheringLeaderId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("gatheringLeaderId").is(gatheringLeaderId));

        return mongoTemplate.findOne(query, Gathering.class);
    }

    public void save(Gathering gathering) {
        mongoTemplate.save(gathering);
    }

    public void delete(Gathering gathering) {
        mongoTemplate.remove(gathering);
    }

    public Page<Gathering> getListGathering(Pageable pageable, GatheringFilterRequest gatheringFilterRequest) {
        Query query = this.buildQuery(gatheringFilterRequest);

        long count = mongoTemplate.count(query, Gathering.class);

        int startRecord = pageable.getPageNumber() * pageable.getPageSize();
        query.skip(startRecord);
        query.limit(pageable.getPageSize());

        List<Gathering> gatheringList = mongoTemplate.find(query, Gathering.class);

        return PageableExecutionUtils.getPage(gatheringList, pageable, () -> count);
    }

    private Query buildQuery(GatheringFilterRequest gatheringFilterRequest) {
        Query query = new Query();

        if (StringUtils.isNotBlank(gatheringFilterRequest.getGatheringName())) {
            query.addCriteria(Criteria.where("gatheringName").is(gatheringFilterRequest.getGatheringName()));
        }

        if (StringUtils.isNotBlank(gatheringFilterRequest.getGatheringAddress())) {
            query.addCriteria(Criteria.where("gatheringAddress").is(gatheringFilterRequest.getGatheringAddress()));
        }

        return query;
    }

}
