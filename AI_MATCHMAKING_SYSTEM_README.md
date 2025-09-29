# AI-Powered Internship Matchmaking System

## Overview

This document describes the comprehensive AI-powered internship matchmaking system implemented for the CareerCraft platform. The system replaces the previous simple rule-based matching with an advanced solution that combines multiple AI techniques for optimal student-internship matching.

## System Architecture

### Core Components

1. **SBERT Embeddings Service** (`SBERTEmbeddingService`)
   - Uses sentence-transformers for semantic similarity
   - Encodes student skills and internship requirements into vector embeddings
   - Calculates cosine similarity between skill sets and job descriptions

2. **Policy-Aware Scoring** (`PolicyAwareScoring`)
   - Implements equity and fairness policies
   - Considers social categories, family income, participation history
   - Location-based scoring with detailed explanations

3. **LinUCB Contextual Bandit** (`LinUCBContextualBandit`)
   - Adaptive learning from student interactions
   - Updates recommendations based on application success
   - Balances exploration vs exploitation

4. **Advanced Matchmaking System** (`AdvancedMatchmakingSystem`)
   - Orchestrates all components
   - Combines scores with weighted averages
   - Provides transparent explanations

## Features

### 🧠 AI-Powered Matching
- **SBERT Semantic Similarity**: 40% weight for skill matching
- **Policy-Aware Scoring**: 40% weight for equity and fairness
- **Adaptive Learning**: 20% weight for LinUCB contextual bandit

### 🎯 Policy & Equity Features
- **Social Category Support**: SC/ST/OBC/EWS/PwD priority
- **Location Matching**: City, district, state-based scoring
- **Income-Based Scoring**: Higher priority for lower-income families
- **Participation History**: First-time vs returning participant support
- **CGPA Eligibility**: Automatic eligibility checking

### 📊 Transparent Explanations
- Detailed breakdown of each score component
- Skill match explanations
- Location match reasoning
- Equity boost explanations
- Confidence intervals

### 🔄 Adaptive Learning
- Learns from student applications and admin approvals
- Updates recommendation algorithms over time
- Improves accuracy with more data

## API Endpoints

### Get Recommendations
```http
POST /api/recommendations
Content-Type: application/json

{
  "student_profile": {
    "id": "student-123",
    "full_name": "John Doe",
    "skills": ["Python", "Machine Learning"],
    "social_category": "Scheduled Caste (SC)",
    "participation_type": "first-time",
    // ... other profile fields
  },
  "internships": [
    {
      "id": "internship-456",
      "title": "ML Intern",
      "skills_required": ["Python", "TensorFlow"],
      // ... other internship fields
    }
  ],
  "top_k": 10
}
```

### Record Feedback
```http
POST /api/feedback
Content-Type: application/json

{
  "student_id": "student-123",
  "internship_id": "internship-456",
  "student_profile": { /* student data */ },
  "internship": { /* internship data */ },
  "applied": true,
  "approved": true
}
```

### Health Check
```http
GET /api/matchmaking-health
```

## Installation & Setup

### Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

Required packages:
- `sentence-transformers>=2.2.2`
- `scikit-learn>=1.3.0`
- `numpy>=1.24.0`
- `torch>=2.0.0`
- `transformers>=4.30.0`

### Running the Backend
```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Integration
The frontend automatically integrates with the new system through the `matchmakingService`:

```typescript
import { matchmakingService } from '@/services/matchmakingService';

// Get recommendations
const recommendations = await matchmakingService.getRecommendations(
  studentProfile, 
  internships, 
  10
);

// Record feedback
await matchmakingService.recordFeedback({
  student_id: 'student-123',
  internship_id: 'internship-456',
  student_profile: studentProfile,
  internship: internship,
  applied: true,
  approved: true
});
```

## Testing

Run the test script to verify the system works:

```bash
python test_matchmaking_system.py
```

This will:
1. Create test student profile and internships
2. Run the matchmaking algorithm
3. Display detailed recommendations with explanations
4. Test feedback recording

## Configuration

### Scoring Weights
The system uses configurable weights for different components:

```python
self.weights = {
    'sbert': 0.4,      # 40% for semantic similarity
    'policy': 0.4,     # 40% for policy/equity factors
    'linucb': 0.2      # 20% for adaptive learning
}
```

### Policy Scoring Weights
```python
self.weights = {
    'location': 0.25,
    'social_category': 0.20,
    'participation_type': 0.15,
    'family_income': 0.10,
    'cgpa_eligibility': 0.15,
    'stipend_expectation': 0.10,
    'available_duration': 0.05
}
```

## Database Schema

The system uses SQLite for storing learning data:

### Interactions Table
```sql
CREATE TABLE interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    internship_id TEXT,
    context_vector TEXT,
    reward REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Arm Parameters Table
```sql
CREATE TABLE arm_parameters (
    internship_id TEXT PRIMARY KEY,
    A_matrix TEXT,
    b_vector TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Considerations

- **SBERT Model Loading**: First request may be slower due to model loading
- **Embedding Caching**: Consider caching embeddings for frequently accessed skills
- **Database Optimization**: Index on student_id and internship_id for faster queries
- **Batch Processing**: Process multiple recommendations in batches for efficiency

## Monitoring & Analytics

### Health Check Response
```json
{
  "status": "healthy",
  "sbert_model": "loaded",
  "policy_scorer": "ready",
  "linucb_bandit": "ready",
  "test_sbert_score": 0.85,
  "message": "AI-powered matchmaking system is ready"
}
```

### Recommendation Explanation
Each recommendation includes detailed explanations:
- SBERT semantic similarity score
- Policy-aware equity score
- LinUCB adaptive learning score
- Skill matches found
- Location match explanation
- Equity boost reasoning
- CGPA eligibility status
- Confidence interval

## Future Enhancements

1. **Multi-Model Ensemble**: Combine multiple embedding models
2. **Real-Time Learning**: Update models in real-time
3. **A/B Testing**: Compare different recommendation strategies
4. **Fairness Metrics**: Monitor and ensure fairness across groups
5. **Performance Optimization**: GPU acceleration for large-scale matching

## Troubleshooting

### Common Issues

1. **SBERT Model Loading Error**
   - Ensure internet connection for first-time model download
   - Check available disk space (models are ~400MB)

2. **Memory Issues**
   - Reduce batch size for large datasets
   - Consider using smaller embedding models

3. **API Connection Errors**
   - Verify backend is running on correct port
   - Check CORS settings for frontend-backend communication

### Debug Mode
Enable debug logging by setting:
```python
logging.basicConfig(level=logging.DEBUG)
```

## Support

For issues or questions about the matchmaking system:
1. Check the health endpoint: `GET /api/matchmaking-health`
2. Review logs for error messages
3. Run the test script to verify functionality
4. Check database connectivity and schema

---

**Note**: This system replaces the previous simple rule-based matching. The old system has been commented out with clear documentation about the replacement.
