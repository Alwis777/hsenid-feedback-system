package com.example.feedback.service

import com.example.feedback.model.FeedbackRequest
import com.example.feedback.repository.FeedbackRequestRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class FeedbackRequestService(
    private val repository: FeedbackRequestRepository
) {

    fun getRequest(feedbackId: String): FeedbackRequest? {
        return repository.findById(feedbackId).orElse(null)
    }

    fun respond(feedbackId: String, rating: Int): RespondResult {
        val request = repository.findById(feedbackId).orElse(null)
            ?: return RespondResult.NOT_FOUND

        if (request.expiresAt.isBefore(Instant.now())) {
            return RespondResult.EXPIRED
        }

        if (request.responded) {
            return RespondResult.ALREADY_RESPONDED
        }

        if (rating < 1 || rating > 5) {
            return RespondResult.INVALID_RATING
        }

        val updated = request.copy(
            responded = true,
            rating = rating,
            respondedAt = Instant.now()
        )
        repository.save(updated)
        return RespondResult.SUCCESS
    }
}

enum class RespondResult {
    SUCCESS,
    NOT_FOUND,
    EXPIRED,
    ALREADY_RESPONDED,
    INVALID_RATING
}