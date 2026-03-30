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

@PostMapping("/{feedbackId}/respond")
    fun respond(
        @PathVariable feedbackId: String,
        @RequestBody body: RespondRequest
    ): ResponseEntity<Any> {

        if (body.rating < 1 || body.rating > 5) {
            return ResponseEntity.badRequest()
                .body(mapOf("error" to "Rating must be between 1 and 5"))
        }

        return when (feedbackRequestService.respond(feedbackId, body.rating)) {
            RespondResult.SUCCESS ->
                ResponseEntity.ok(mapOf("message" to "Thank you for your feedback!"))
            RespondResult.NOT_FOUND ->
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(mapOf("error" to "Feedback request not found"))
            RespondResult.EXPIRED ->
                ResponseEntity.status(HttpStatus.GONE)
                    .body(mapOf("error" to "This feedback link has expired"))
            RespondResult.ALREADY_RESPONDED ->
                ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(mapOf("error" to "Feedback has already been submitted"))
            RespondResult.INVALID_RATING ->
                ResponseEntity.badRequest()
                    .body(mapOf("error" to "Rating must be between 1 and 5"))
        }
    }

    data class RespondRequest(
    val rating: Int = 0
)