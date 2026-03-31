# DECISIONS.md

## What I Prioritized

- Getting the core data flow right was the first priority. Before writing a single line of frontend code I made sure the backend models, validation and API responses were solid and returning exactly what the frontend needed. This saved a lot of back and forth later.

- I treated the seed data as a first class concern rather than an afterthought. Having realistic demo data available from the first backend startup meant I could verify every page state immediately without manually creating test records through the API.

- Within the backend I prioritized the public feedback endpoint over the admin configuration endpoint because it has more complex behavior to get right — expiry checks, duplicate submission prevention, and the correct HTTP status codes for each failure case all needed careful thought.

## Assumptions I Made

- The enterpriseId is hardcoded in the frontend as enterprise-001. In a real system this would be encoded in the feedback URL or derived from an authenticated session, but for this exercise hardcoding it keeps the focus on the core feedback mechanics rather than auth plumbing.

- I assumed that a feedback request which is both expired and already responded should show the expired state to the customer. The link is no longer valid either way and expired is the more informative message for the customer to see.

- For the skipForChannels field I decided to normalize all incoming values to uppercase on save. This means WHATSAPP and whatsapp are treated as the same channel which avoids subtle data inconsistencies across the system.

- I assumed MongoDB is running locally without authentication. In a real deployment this would be configured with credentials and TLS.

- I kept admin authentication completely mocked as the spec explicitly listed it as out of scope. A simple API key or JWT guard would be the first thing to add in a real system.

## What I Intentionally Left Out

- Production grade authentication and authorization. The spec listed this as out of scope and adding a half finished auth system would have been worse than a clean mock.

- Pagination on the feedback request endpoints. With the scope of this exercise it was not needed and adding it would have been over engineering.

- An audit trail for form configuration changes. In a real multi tenant SaaS product you would want to know which admin changed what and when but this was beyond the scope of the exercise.

- Exhaustive edge case handling on the frontend. I focused on the four states the spec asked for — success, already used, expired and not found — and made sure each one worked correctly rather than trying to handle every possible network failure scenario.

## What I Would Do Next With Another Half Day

- Add proper JWT based admin authentication. Even a simple implementation would make the system much more realistic and would protect the configuration endpoints from unauthorized changes.

- Improve the feedback statistics endpoint to support date range filtering so admins can see how ratings trend over time rather than just seeing all time totals. The data is already in MongoDB so this would just need an aggregation query with a date filter.

- Add Docker Compose support so the reviewer and any future developer can bring up MongoDB and the backend with a single command instead of installing and starting MongoDB separately.

- Expand frontend test coverage to include the public feedback page. The current test covers the admin page loading state but the public page has more complex behavior worth testing — the expired state, the already responded state and the submit flow.

- Add input debouncing to the admin form so the live preview updates smoothly as the admin types rather than on every single keystroke.