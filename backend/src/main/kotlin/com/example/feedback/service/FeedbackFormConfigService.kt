
package com.example.feedback.service


import com.example.feedback.model.FeedbackFormConfig
import com.example.feedback.repository.FeedbackFormConfigRepository
import com.example.feedback.repository.FeedbackRequestRepository
import org.springframework.stereotype.Service

@Service
class FeedbackFormConfigService(
    private val repository: FeedbackFormConfigRepository,
    private val feedbackRequestRepository: FeedbackRequestRepository
) {

    fun getConfig(enterpriseId: String): FeedbackFormConfig? {
        return repository.findByEnterpriseId(enterpriseId).orElse(null)
    }

    fun saveConfig(enterpriseId: String, config: FeedbackFormConfig): FeedbackFormConfig {
        val existing = repository.findByEnterpriseId(enterpriseId).orElse(null)
        val toSave = config.copy(
            id = existing?.id,
            enterpriseId = enterpriseId
        )
        return repository.save(toSave)
    }
     fun getStats(enterpriseId: String): Map<String, Any> {
        val requests = feedbackRequestRepository.findAll()
            .filter { it.enterpriseId == enterpriseId }

        val responded = requests.filter { it.responded }
        val total = requests.size
        val totalResponded = responded.size
        val averageRating = if (responded.isEmpty()) 0.0
            else responded.mapNotNull { it.rating }.average()

        val ratingBreakdown = mapOf(
            "1" to responded.count { it.rating == 1 },
            "2" to responded.count { it.rating == 2 },
            "3" to responded.count { it.rating == 3 },
            "4" to responded.count { it.rating == 4 },
            "5" to responded.count { it.rating == 5 }
        )

        return mapOf(
            "enterpriseId" to enterpriseId,
            "totalRequests" to total,
            "totalResponded" to totalResponded,
            "averageRating" to String.format("%.1f", averageRating),
            "ratingBreakdown" to ratingBreakdown
        )
    }
}

