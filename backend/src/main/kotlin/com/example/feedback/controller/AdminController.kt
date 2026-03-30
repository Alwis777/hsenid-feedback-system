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