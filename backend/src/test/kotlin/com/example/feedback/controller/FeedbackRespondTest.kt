package com.example.feedback.controller

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
class FeedbackRespondTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Test
    fun `should return 404 for unknown feedbackId`() {
        mockMvc.post("/api/public/feedback/nonexistent-id/respond") {
            contentType = MediaType.APPLICATION_JSON
            content = """{ "rating": 3 }"""
        }.andExpect {
            status { isNotFound() }
        }
    }

    @Test
    fun `should return 400 for rating below 1`() {
        mockMvc.post("/api/public/feedback/feedback-valid-001/respond") {
            contentType = MediaType.APPLICATION_JSON
            content = """{ "rating": 0 }"""
        }.andExpect {
            status { isBadRequest() }
        }
    }
}