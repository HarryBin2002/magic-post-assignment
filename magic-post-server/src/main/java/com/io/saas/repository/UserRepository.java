package com.io.saas.repository;

import com.io.saas.constant.Constant;
import com.io.saas.dto.request.NormalUserInfoRequest;
import com.io.saas.model.User;
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
public class UserRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public User findByName(String name) {
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));

        return mongoTemplate.findOne(query, User.class);
    }

    public User findByUserId(String userId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId));

        return mongoTemplate.findOne(query, User.class);
    }

    public User findByEmail(String email) {
        Query query = new Query();
        query.addCriteria(Criteria.where("email").is(email));

        return mongoTemplate.findOne(query, User.class);
    }

    public Page<User> findByRole(Pageable pageable, String role) {
        Query query = new Query();
        query.addCriteria(Criteria.where("role").is(role));

        long count = mongoTemplate.count(query, User.class);

        int startRecord = pageable.getPageNumber() * pageable.getPageSize();
        query.skip(startRecord);
        query.limit(pageable.getPageSize());

        List<User> userList = mongoTemplate.find(query, User.class);

        return PageableExecutionUtils.getPage(userList, pageable, () -> count);
    }

    public User save(User user) {
        return mongoTemplate.save(user);
    }

    public Page<User> getListNormalUser(Pageable pageable, NormalUserInfoRequest normalUserInfoRequest) {
        Query query = this.buildQuery(normalUserInfoRequest);

        long count = mongoTemplate.count(query, User.class);

        int startRecord = pageable.getPageNumber() * pageable.getPageSize();
        query.skip(startRecord);
        query.limit(pageable.getPageSize());

        List<User> userList = mongoTemplate.find(query, User.class);

        return PageableExecutionUtils.getPage(userList, pageable, () -> count);
    }

    private Query buildQuery(NormalUserInfoRequest normalUserInfoRequest) {
        Query query = new Query();

        query.addCriteria(Criteria.where("role").is(Constant.UserRole.USER_NORMAL));

        if (StringUtils.isNotBlank(normalUserInfoRequest.getNormalUserName())) {
            query.addCriteria(Criteria.where("name").is(normalUserInfoRequest.getNormalUserName()));
        }

        if (StringUtils.isNotBlank(normalUserInfoRequest.getNormalUserEmail())) {
            query.addCriteria(Criteria.where("email").is(normalUserInfoRequest.getNormalUserEmail()));
        }

        return query;
    }
}
