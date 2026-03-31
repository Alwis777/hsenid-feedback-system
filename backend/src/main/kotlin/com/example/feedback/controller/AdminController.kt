package com.example.feedback.controller

import com.example.feedback.model.FeedbackFormConfig
import com.example.feedback.service.FeedbackFormConfigService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/enterprises")
@CrossOrigin(origins = ["http://localhost:3000"])
class AdminController(
    private val service: FeedbackFormConfigService
) {

    @GetMapping("/{enterpriseId}/session-feedback-form")
    fun getForm(@PathVariable enterpriseId: String): ResponseEntity<Any> {
        val config = service.getConfig(enterpriseId)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(config)
    }

    @PutMapping("/{enterpriseId}/session-feedback-form")
    fun saveForm(
        @PathVariable enterpriseId: String,
        @RequestBody request: FeedbackFormConfigRequest
    ): ResponseEntity<Any> {

        val errors = mutableListOf<String>()

        // The Missing Validation Logic!
        if (request.headerText.isBlank()) errors.add("headerText is required and cannot be blank")
        if (request.headerText.length > 100) errors.add("headerText must not exceed 100 characters")
        if (request.headerDescription != null && request.headerDescription.length > 255)
            errors.add("headerDescription must not exceed 255 characters")
        if (request.footerText != null && request.footerText.length > 100)
            errors.add("footerText must not exceed 100 characters")
        if (request.ratingLabels.size != 5) errors.add("ratingLabels must contain exactly 5 items")
        if (request.ratingLabels.any { it.isBlank() }) errors.add("ratingLabels must not contain blank values")
        if (request.thankYouText.isBlank()) errors.add("thankYouText is required and cannot be blank")
        if (request.thankYouText.length > 255) errors.add("thankYouText must not exceed 255 characters")
        if (request.invalidReplyText.isBlank()) errors.add("invalidReplyText is required and cannot be blank")
        if (request.expiredReplyText.isBlank()) errors.add("expiredReplyText is required and cannot be blank")

        val allowedChannels = setOf("WHATSAPP", "INSTAGRAM", "MESSENGER", "WEB")
        val invalidChannels = request.skipForChannels.filter {
            it.uppercase() !in allowedChannels
        }
        if (invalidChannels.isNotEmpty()) errors.add("Invalid channels: $invalidChannels. Allowed: $allowedChannels")
        if (request.skipForChannels.size != request.skipForChannels.distinct().size)
            errors.add("skipForChannels must not contain duplicates")

        if (errors.isNotEmpty()) {
            return ResponseEntity.badRequest().body(mapOf("errors" to errors))
        }

        val config = FeedbackFormConfig(
            enterpriseId = enterpriseId,
            headerText = request.headerText,
            headerDescription = request.headerDescription,
            footerText = request.footerText,
            ratingLabels = request.ratingLabels,
            thankYouText = request.thankYouText,
            invalidReplyText = request.invalidReplyText,
            expiredReplyText = request.expiredReplyText,
            skipForChannels = request.skipForChannels.map { it.uppercase() }
        )

        val saved = service.saveConfig(enterpriseId, config)
        return ResponseEntity.ok(saved)
    }
}

data class FeedbackFormConfigRequest(
    val headerText: String = "",
    val headerDescription: String? = null,
    val footerText: String? = null,
    val ratingLabels: List<String> = emptyList(),
    val thankYouText: String = "",
    val invalidReplyText: String = "",
    val expiredReplyText: String = "",
    val skipForChannels: List<String> = emptyList()
)