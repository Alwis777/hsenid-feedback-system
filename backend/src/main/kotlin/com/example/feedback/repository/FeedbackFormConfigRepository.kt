package com.example.feedback.repository

import com.example.feedback.model.FeedbackFormConfig
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.Optional

interface FeedbackFormConfigRepository : MongoRepository<FeedbackFormConfig, String> {
    fun findByEnterpriseId(enterpriseId: String): Optional<FeedbackFormConfig>
}