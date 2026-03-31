# hSenid Feedback System

A chat session feedback mini-system built with Spring Boot (Kotlin), Next.js and MongoDB.

When a chat session ends, customers receive a unique feedback link where they can rate their interaction from 1 to 5. Enterprises can configure how that feedback form looks through an admin interface.

## Project Structure
```
hsenid-feedback-system/
├── backend/    # Spring Boot + Kotlin REST API
└── frontend/   # Next.js admin and public feedback pages
```

## Prerequisites

- Java 17
- Node.js 22 or higher
- MongoDB running on localhost:27017

## How To Run

### Step 1 - Start MongoDB
```bash
net start MongoDB
```

### Step 2 - Run the Backend
```bash
cd backend
.\gradlew bootRun
```

The backend starts on http://localhost:8080

When the backend starts it automatically seeds the database with demo data so you can test everything right away. The following records are created:

- enterprise-001 is a fully configured enterprise
- feedback-valid-001 is a valid pending feedback request
- feedback-expired-001 is a feedback request that has already expired
- feedback-responded-001 is a feedback request that was already submitted

### Step 3 - Run the Frontend

Open a second terminal and run:
```bash
cd frontend
npm install
npm run dev
```

The frontend starts on http://localhost:3000

## Pages

| Page | URL |
|------|-----|
| Admin config page | http://localhost:3000/admin |
| Valid feedback page | http://localhost:3000/feedback/feedback-valid-001 |
| Expired feedback page | http://localhost:3000/feedback/feedback-expired-001 |
| Already responded page | http://localhost:3000/feedback/feedback-responded-001 |

## Running Tests

### Backend
```bash
cd backend
.\gradlew test
```

### Frontend
```bash
cd frontend
npm test
```

## API Reference

### GET /api/admin/enterprises/{enterpriseId}/session-feedback-form

Returns the feedback form configuration for an enterprise.

Response 200:
```json
{
  "enterpriseId": "enterprise-001",
  "headerText": "Rate Your Experience",
  "headerDescription": "Tell us how your chat went today",
  "footerText": "Thank you for using our service",
  "ratingLabels": ["Terrible", "Bad", "Okay", "Good", "Excellent"],
  "thankYouText": "Thanks for your feedback!",
  "invalidReplyText": "That is not a valid rating",
  "expiredReplyText": "Sorry this link has expired",
  "skipForChannels": ["INSTAGRAM"]
}
```

Response 404 is returned when the enterprise config is not found.

---

### PUT /api/admin/enterprises/{enterpriseId}/session-feedback-form

Creates or updates the feedback form configuration for an enterprise.

Request body:
```json
{
  "headerText": "Rate Your Experience",
  "headerDescription": "Tell us how your chat went today",
  "footerText": "Thank you for using our service",
  "ratingLabels": ["Terrible", "Bad", "Okay", "Good", "Excellent"],
  "thankYouText": "Thanks for your feedback!",
  "invalidReplyText": "That is not a valid rating",
  "expiredReplyText": "Sorry this link has expired",
  "skipForChannels": ["INSTAGRAM"]
}
```

Response 200 means the config was saved successfully.
Response 400 returns a list of validation error messages.

---

### GET /api/public/feedback/{feedbackId}

Returns the feedback page data for a given feedback request.

Response 200:
```json
{
  "feedbackId": "feedback-valid-001",
  "enterpriseId": "enterprise-001",
  "responded": false,
  "expired": false,
  "headerText": "Rate Your Experience",
  "ratingLabels": ["Terrible", "Bad", "Okay", "Good", "Excellent"],
  "thankYouText": "Thanks for your feedback!",
  "expiredReplyText": "Sorry this link has expired"
}
```

Response 404 is returned when the feedback request is not found.

---

### POST /api/public/feedback/{feedbackId}/respond

Submits a customer rating for a feedback request.

Request body:
```json
{
  "rating": 4
}
```

Response 200 means the rating was submitted successfully.
Response 400 means the rating was not between 1 and 5.
Response 404 means the feedback request was not found.
Response 409 means feedback was already submitted for this request.
Response 410 means the feedback link has expired.

## Validation Rules

| Field | Rules |
|-------|-------|
| headerText | Required, max 100 characters |
| headerDescription | Optional, max 255 characters |
| footerText | Optional, max 100 characters |
| ratingLabels | Exactly 5 items, no blank values |
| thankYouText | Required, max 255 characters |
| invalidReplyText | Required, cannot be blank |
| expiredReplyText | Required, cannot be blank |
| skipForChannels | No duplicates, allowed values are WHATSAPP, INSTAGRAM, MESSENGER and WEB |

## Assumptions

Admin authentication is mocked as it is out of scope for this exercise. The enterpriseId is hardcoded in the frontend as enterprise-001 for demo purposes. Feedback links are assumed to be pre-created by an external service since the link sending mechanism is out of scope. MongoDB is assumed to be running locally without authentication.

## Bonus Features Implemented

Three bonus items from the optional scope were completed.

Duplicate submit protection was added to the public feedback page. The submit button is disabled until a rating is selected, preventing accidental double submissions.

A feedback statistics view was added to the admin page showing total requests, total responses, average rating and a visual rating breakdown with progress bars per rating value.

Basic accessibility improvements were made across both pages including aria-label attributes on all interactive buttons and inputs so the interface works correctly with screen readers.