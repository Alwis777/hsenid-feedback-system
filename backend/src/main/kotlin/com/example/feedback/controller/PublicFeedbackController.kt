package com.example.feedback.controller

import com.example.feedback.service.FeedbackFormConfigService
import com.example.feedback.service.FeedbackRequestService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/public/feedback")
@CrossOrigin(origins = ["http://localhost:3000"])
class PublicFeedbackController(
    private val feedbackRequestService: FeedbackRequestService,
    private val feedbackFormConfigService: FeedbackFormConfigService
) {

    @GetMapping("/{feedbackId}")
    fun getFeedbackPage(@PathVariable feedbackId: String): ResponseEntity<Any> {
        val request = feedbackRequestService.getRequest(feedbackId)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Feedback request not found"))

        val config = feedbackFormConfigService.getConfig(request.enterpriseId)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Enterprise configuration not found"))

        return ResponseEntity.ok(mapOf(
            "feedbackId" to feedbackId,
            "enterpriseId" to request.enterpriseId,
            "responded" to request.responded,
            "expired" to request.expiresAt.isBefore(java.time.Instant.now()),
            "headerText" to config.headerText,
            "headerDescription" to config.headerDescription,
            "footerText" to config.footerText,
            "ratingLabels" to config.ratingLabels,
            "thankYouText" to config.thankYouText,
            "expiredReplyText" to config.expiredReplyText,
            "invalidReplyText" to config.invalidReplyText
        ))
    }
}