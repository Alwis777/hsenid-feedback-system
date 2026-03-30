package com.example.feedback.seed

import com.example.feedback.model.FeedbackFormConfig
import com.example.feedback.model.FeedbackRequest
import com.example.feedback.repository.FeedbackFormConfigRepository
import com.example.feedback.repository.FeedbackRequestRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class DataSeeder(
    private val formConfigRepo: FeedbackFormConfigRepository,
    private val feedbackRequestRepo: FeedbackRequestRepository
) : CommandLineRunner {

    override fun run(vararg args: String?) {

        formConfigRepo.deleteAll()
        feedbackRequestRepo.deleteAll()

        val config = FeedbackFormConfig(
            enterpriseId = "enterprise-001",
            headerText = "Rate Your Experience",
            headerDescription = "Tell us how your chat went today",
            footerText = "Thank you for using our service",
            ratingLabels = listOf("Terrible", "Bad", "Okay", "Good"),
            thankYouText = "Thanks for your feedback!",
            invalidReplyText = "That is not a valid rating",
            expiredReplyText = "Sorry this link has expired",
            skipForChannels = listOf("INSTAGRAM")
        )

        formConfigRepo.save(config)