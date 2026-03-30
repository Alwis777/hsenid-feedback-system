package com.example.feedback.repository

import com.example.feedback.model.FeedbackRequest
import org.springframework.data.mongodb.repository.MongoRepository

interface FeedbackRequestRepository : MongoRepository<FeedbackRequest, String> {
    fun findBySessionId(sessionId: String): List<FeedbackRequest>
}