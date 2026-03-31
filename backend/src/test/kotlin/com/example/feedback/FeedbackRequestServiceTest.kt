package com.example.feedback.service

import com.example.feedback.model.FeedbackRequest
import com.example.feedback.repository.FeedbackRequestRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import java.time.Instant
import java.time.temporal.ChronoUnit

class FeedbackRequestServiceTest {

    private val repository = mock(FeedbackRequestRepository::class.java)
    private val service = FeedbackRequestService(repository)

    @Test
    fun `should return EXPIRED when feedback request has expired`() {
        val pastDate = Instant.now().minus(1, ChronoUnit.DAYS)
        val expiredRequest = FeedbackRequest(
            id = "expired-123",
            enterpriseId = "ent-1",
            sessionId = "session-1",
            expiresAt = pastDate
        )

        `when`(repository.findById("expired-123")).thenReturn(java.util.Optional.of(expiredRequest))

        val result = service.respond("expired-123", 5)

        assertEquals(RespondResult.EXPIRED, result)
    }
}