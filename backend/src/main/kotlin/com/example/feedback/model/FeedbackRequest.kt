package com.example.feedback.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "feedback_requests")
data class FeedbackRequest(
    @Id
    val id: String? = null,

    val enterpriseId: String,
    val sessionId: String,
    val expiresAt: Instant,

    val responded: Boolean = false,
    val rating: Int? = null,
    val respondedAt: Instant? = null
)