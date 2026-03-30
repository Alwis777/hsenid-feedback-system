package com.example.feedback.service

import com.example.feedback.model.FeedbackFormConfig
import com.example.feedback.repository.FeedbackFormConfigRepository
import org.springframework.stereotype.Service

@Service
class FeedbackFormConfigService(
    private val repository: FeedbackFormConfigRepository
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
}