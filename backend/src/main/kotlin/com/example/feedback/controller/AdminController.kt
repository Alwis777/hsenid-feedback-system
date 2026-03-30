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
}

@PutMapping("/{enterpriseId}/session-feedback-form")
    fun saveForm(
        @PathVariable enterpriseId: String,
        @RequestBody request: FeedbackFormConfigRequest
    ): ResponseEntity<Any> {
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