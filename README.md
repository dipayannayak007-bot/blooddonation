<div align="center">
  <h1>PulseNode 🩸</h1>
  <p><em>The modern network for saving lives.</em></p>
  
  [![Frontend Status](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://pulse-node-frontend.vercel.app)
  [![Backend Status](https://img.shields.io/badge/Backend-Render-purple?style=for-the-badge&logo=render)](https://pulsenode-backend.onrender.com)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-brightgreen?style=for-the-badge&logo=spring)](https://spring.io/projects/spring-boot)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
</div>

<hr />

## 🌐 Live Deployments

- **Live Application (Frontend):** [pulse-node-frontend.vercel.app](https://pulse-node-frontend.vercel.app)
- **Live API Base (Backend):** [pulsenode-backend.onrender.com](https://pulsenode-backend.onrender.com)

---

## 📖 Overview

PulseNode is a real-time, algorithmic blood dispatch system connecting hospitals with eligible blood donors instantly. It acts as an emergency radar, minimizing the critical time between a hospital's SOS request and a donor's arrival, optimizing dispatch times to under **1 minute**.

---

## ⚙️ Backend Architecture (Core Focus)

This repository heavily emphasizes a strictly typed, highly scalable backend built on **Java** and **Spring Boot**. 

### System Design Highlights
- **Layered Architecture:** Strict separation of concerns using Controllers, Services, and JPA Repositories.
- **Relational Integrity:** Complex entity mappings using Hibernate (One-to-Many, Many-to-One constraints) to ensure atomic transactions between Hospitals, Donors, and Blood Requests.
- **Geospatial & Algorithmic Dispatch:** The matching engine utilizes Haversine-based distance calculations to broadcast SOS alerts exclusively to eligible donors within a 10km radius.
- **OAuth 2.0 Security:** Headless architecture that securely authenticates sessions using Google Identity Services, auto-generating UUID constraints to satisfy Postgres integrity.
- **Real-Time WebSockets:** Integration of STOMP over SockJS to push live SOS notifications and status updates directly to connected donor dashboards.
- **Global Exception Handling:** Custom @ControllerAdvice interceptors that guarantee standard JSON error envelopes instead of raw stack traces.

### 🗄️ Database Schema Model

`mermaid
erDiagram
    DONOR {
        Long donorId PK
        String contactEmail UK
        String name
        String bloodType
        Double latitude
        Double longitude
        String verificationStatus
    }
    REQUESTER {
        Long requesterId PK
        String contactEmail UK
        String name
        String accountType
    }
    BLOOD_REQUEST {
        Long requestId PK
        String bloodType
        String urgency
        String status
        Long requesterId FK
    }
    DONATION_RECORD {
        Long recordId PK
        Long donorId FK
        Long requestId FK
        String status
    }
    REQUESTER ||--o{ BLOOD_REQUEST : makes
    DONOR ||--o{ DONATION_RECORD : fulfills
    BLOOD_REQUEST ||--o{ DONATION_RECORD : tracked_by
`

---

## 🚀 Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google OAuth** | Secure, one-click login for donors and hospitals. |
| 📍 **Interactive Maps** | Live Leaflet maps showing real-time SOS requests. |
| ⚡ **Live WebSockets** | Instant matching alerts pushed directly to the UI. |
| 🏥 **Hospital Dashboards** | Command center for tracking dispatches and history. |
| 🛡️ **Admin Portal** | Unified view of all registered entities and analytics. |

---

## 💻 Local Development Setup

### 1. Backend (Spring Boot)
Ensure PostgreSQL is running locally on port 5432 with a database named lood_donation.

`ash
cd backend
./mvnw spring-boot:run
`
*The API will start on http://localhost:8080*

### 2. Frontend (React / Vite)
`ash
cd frontend
npm install
npm run dev
`
*The Application will start on http://localhost:5173*

---
<div align="center">
  <i>Developed for academic evaluation.</i>
</div>
