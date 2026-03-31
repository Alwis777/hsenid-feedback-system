
## Overview

Claude (claude.ai) was the primary AI tool used throughout this project. This was my first time working with Kotlin so I leaned on AI more heavily for language syntax and Spring Boot patterns than I would for something I already know well. The system design, validation rules, data modelling decisions and bug fixes were my own. Generated code was always read and tested before committing and I caught several mistakes in the output during this process which are documented below.

_______________________________________________

## Prompts Used

### Prompt 1 - Getting Started with Kotlin and Spring Boot
I had not worked with Kotlin before this project so I asked Claude to explain the differences between writing a Spring Boot application in Java vs Kotlin and to generate the initial project structure including models, repositories, service layer and controllers.

What was useful: Understanding Kotlin specific things like data classes, nullable types with the question mark syntax and how val vs var works. The generated structure was a solid starting point that I reorganised and adjusted as I built on top of it.

_______________________________________________

### Prompt 2 - Validation Logic in Kotlin
I asked how to collect all validation errors into a list in a Kotlin controller rather than stopping on the first failure, and to validate that ratingLabels had exactly 5 non blank items and skipForChannels had no duplicates.

What was useful: The mutable list pattern for collecting errors was clean and I kept it. The actual validation rules were my own decisions based on reading the spec carefully. I added several rules the AI did not think of including normalizing skipForChannels values to uppercase before saving.

_______________________________________________

### Prompt 3 - Kotlin Syntax I Was Unsure About
Throughout the backend I kept asking small Kotlin syntax questions. Things like how to use orElse on an Optional, how copy works on a data class, how to filter and map a list in one chain and how the when expression works as a return value.

What was useful: These were quick clarifications that helped me write idiomatic Kotlin rather than just writing Java style code in a Kotlin file. I understood what I wanted to do logically but needed to know the correct Kotlin way to express it.

_______________________________________________

### Prompt 4 - Handling Different Feedback States in the Service
I asked for a clean pattern for a service method that needs to return different outcomes depending on whether a feedback request is expired, already responded or has an invalid rating.

What was useful: The RespondResult enum and using a when expression in the controller to map each result to the correct HTTP status code was well structured. The actual logic decisions like what counts as expired and which HTTP status code to use for each state were mine.

_______________________________________________

### Prompt 5 - Next.js Public Feedback Page
I asked Claude to help write a Next.js App Router page that fetches feedback data by feedbackId using useParams and shows different UI based on whether the feedback is expired, already responded or still valid.

What was useful: The component structure with early returns for each state was a good approach. I had to fix the fetch error handling because the generated code was not correctly handling the 404 case. I also added the submitted state separately after testing the flow manually and realising it was missing.

_______________________________________________

### Prompt 6 - Java Build Failure Debugging
My Gradle build was failing with just the error message "25" and no useful stack trace. I asked Claude what was happening given I had Java 25 installed but the build.gradle.kts was configured for Java 21.

What was useful: Claude correctly identified that Gradle was printing the installed Java version because Java 25 is an early access release and not recognised as a stable toolchain. I decided to install Java 17 LTS instead since it is the recommended stable version for Spring Boot 3.x and this resolved the build immediately.

_______________________________________________

### Prompt 7 - Seed Data Setup
I asked for a Spring Boot CommandLineRunner in Kotlin that seeds MongoDB on startup with one enterprise config, one valid feedback request, one expired feedback request and one already responded feedback request.

What was useful: The CommandLineRunner structure was correct. However the generated seed data had both the expired and already responded requests using plusSeconds for expiresAt which was a copy paste mistake. I caught this by testing the API in the browser and reading the JSON response directly then fixed both with separate commits.

_______________________________________________

### Prompt 8 - Writing Tests in Kotlin with Mockito
I had not written tests in Kotlin before so I asked how to set up a JUnit 5 unit test using Mockito in Kotlin, specifically around the backtick syntax needed because when is a reserved keyword in Kotlin.

What was useful: The backtick test name syntax and the Mockito mock setup were both new to me. I had to add a missing required field to the FeedbackRequest constructor call in the generated test since it would not have compiled otherwise.

_______________________________________________

### Prompt 9 - Jest Setup for Next.js App Router
I asked how to configure Jest and React Testing Library for a Next.js App Router project after getting a document is not defined error when running tests.

What was useful: The jest.config.mjs approach using nextJest was the correct fix. The generated config had a typo in one of the option keys which I caught from the Jest validation warning in the terminal and removed.

_______________________________________________

### Prompt 10 - Feedback Statistics Endpoint
I asked for a simple stats endpoint that returns total requests, total responded, average rating and a breakdown of counts per rating value for a given enterpriseId.

What was useful: The in memory filtering and Kotlin collection functions approach was clean for the scale of this exercise. I decided to return averageRating as a formatted string with one decimal place rather than a raw double to keep the frontend display simpler.

_______________________________________________

### Prompt 11 - UI Layout and Tailwind Fixes
During the frontend work I ran into layout issues where elements were ending up outside the card container because of misplaced closing div tags. I used Claude to help spot where the structure was broken and to suggest Tailwind classes for things like disabled button states, focus ring styling and card shadows.

What was useful: Spotting unclosed div issues in JSX is tedious to do manually. Having Claude read the structure and point out where the closing tags were misplaced saved time. The Tailwind disabled and focus utility classes were also quick to confirm rather than dig through documentation.

_______________________________________________

### Prompt 12 - Smaller Reference Questions
Throughout development I used Claude for smaller lookups including correct CORS annotation placement in Spring Boot, TypeScript interface syntax for nullable fields and confirming the right HTTP status codes for 409 Conflict and 410 Gone. These were quick reference questions rather than code generation.

_______________________________________________

## What AI Generated That Was Useful

Kotlin boilerplate and Spring Boot patterns saved the most time given it was my first time using the language. The overall component structure for the Next.js pages was also a good starting point. For things I already understood well like the system design, API structure and validation rules I used AI mainly to write out what I had already decided rather than to figure out what to do.

_______________________________________________

## One AI Suggestion I Rejected and Why

Claude suggested using @Valid with javax validation annotations on the request body for the PUT endpoint. I rejected this because the spec explicitly asked me to define and document my own validation rules. Annotation based validation would have hidden the rules inside annotations and made them harder to read and explain in the README. Writing explicit validation logic with clear error messages kept everything visible and made the validation table in the README straightforward to write.

_______________________________________________

## How I Validated and Corrected AI Generated Code

I read every generated file before committing it and tested every endpoint manually in the browser before moving on. The most impactful correction was catching the seed data timestamp bug where both the expired and already responded requests had plusSeconds instead of minusSeconds. I caught this by reading the API response JSON directly in the browser.

I also caught a missing constructor field in the service test, a wrong assertion in a controller test and a typo in the Jest config all from reading the output rather than just running it and assuming it worked.

The git history shows this process properly.