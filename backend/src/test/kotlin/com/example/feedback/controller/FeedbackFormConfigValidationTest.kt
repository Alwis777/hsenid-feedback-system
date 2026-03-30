package com.example.feedback.controller

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.put

@SpringBootTest
@AutoConfigureMockMvc
class FeedbackFormConfigValidationTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Test
    fun `should return 400 when headerText is blank`() {
        mockMvc.put("/api/admin/enterprises/ent-001/session-feedback-form") {
            contentType = MediaType.APPLICATION_JSON
            content = """
                {
                    "headerText": "",
                    "ratingLabels": ["1","2","3","4","5"],
                    "thankYouText": "Thanks!",
                    "invalidReplyText": "Invalid",
                    "expiredReplyText": "Expired"
                }
            """.trimIndent()
        }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `should return 400 when ratingLabels has less than 5 items`() {
        mockMvc.put("/api/admin/enterprises/ent-001/session-feedback-form") {
            contentType = MediaType.APPLICATION_JSON
            content = """
                {
                    "headerText": "Rate Us",
                    "ratingLabels": ["Bad","Good"],
                    "thankYouText": "Thanks!",
                    "invalidReplyText": "Invalid",
                    "expiredReplyText": "Expired"
                }
            """.trimIndent()
       }.andExpect {
            status { isBadRequest() }
        }
    }

    @Test
    fun `should return 400 when skipForChannels has duplicates`() {
        mockMvc.put("/api/admin/enterprises/ent-001/session-feedback-form") {
            contentType = MediaType.APPLICATION_JSON
            content = """
                {
                    "headerText": "Rate Us",
                    "ratingLabels": ["1","2","3","4","5"],
                    "thankYouText": "Thanks!",
                    "invalidReplyText": "Invalid",
                    "expiredReplyText": "Expired",
                    "skipForChannels": ["WHATSAPP","WHATSAPP"]
                }
            """.trimIndent()
        }.andExpect {
            status { isBadRequest() }
        }
    }
}