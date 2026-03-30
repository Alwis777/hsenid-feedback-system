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
            ratingLabels = listOf("Terrible", "Bad", "Okay", "Good","Excellent),
            thankYouText = "Thanks for your feedback!",
            invalidReplyText = "That is not a valid rating",
            expiredReplyText = "Sorry this link has expired",
            skipForChannels = listOf("INSTAGRAM")
        )

        formConfigRepo.save(config)
        
        // Valid feedback request
        feedbackRequestRepo.save(
            FeedbackRequest(
                id = "feedback-valid-001",
                enterpriseId = "enterprise-001",
                sessionId = "session-001",
                expiresAt = Instant.now().plusSeconds(86400)
            )
        )

        // Expired feedback request
        feedbackRequestRepo.save(
            FeedbackRequest(
                id = "feedback-expired-001",
                enterpriseId = "enterprise-001",
                sessionId = "session-002",
                expiresAt = Instant.now().plusSeconds(86400)
            )
        )

        // Already responded feedback request
        feedbackRequestRepo.save(
            FeedbackRequest(
                id = "feedback-responded-001",
                enterpriseId = "enterprise-001",
                sessionId = "session-003",
                expiresAt = Instant.now().plusSeconds(86400),
                responded = false,
                rating = 4,
                respondedAt = Instant.now().minusSeconds(3600)
            )
        )

        println("Seed data loaded!")
    }
}