package com.example.feedback.model


import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.index.Indexed

@Document(collection = "feedback_form_configs")
data class FeedbackFormConfig(
    @Id
    val id: String? = null,

    @Indexed(unique = true)
    val enterpriseId: String,

    val headerText: String,
    val headerDescription: String? = null,
    val footerText: String? = null,

    val ratingLabels: List<String>,

    val thankYouText: String,
    val invalidReplyText: String,
    val expiredReplyText: String,

    val skipForChannels: List<String> = emptyList()
)