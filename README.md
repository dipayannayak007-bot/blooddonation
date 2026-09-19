# PulseNode - Blood Donation Platform 🩸

PulseNode is a real-time, algorithmic dispatch system connecting hospitals with eligible blood donors instantly. It operates as a modern network for saving lives, optimizing dispatch times to under 1 minute.

## 🚀 Features

- **Automated Dispatch Engine:** Algorithmic matching based on real-time location and blood type compatibility.
- **Google OAuth Integration:** Secure, seamless authentication for hospitals, donors, and administrators.
- **Real-Time WebSockets:** Live SOS broadcast system connecting nearby donors instantly.
- **Interactive Mapping:** Geographic radar showing real-time SOS requests, active donors, and fulfilled donations.
- **Admin Command Center:** Complete oversight of the platform, managing verified hospitals and active donors.
- **Analytics & History:** Comprehensive tracking of donation history and hospital blood utilization.

## 🛠 Tech Stack

### Backend (Java / Spring Boot)
- **Framework:** Spring Boot 3.3.x
- **Database:** PostgreSQL (with Spring Data JPA / Hibernate)
- **Authentication:** Google Identity Services (OAuth 2.0)
- **Real-time:** Spring WebSockets (STOMP over SockJS)
- **Build Tool:** Maven

### Frontend (React / Vite)
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS (Dark/Light glassmorphism themes)
- **Maps:** Leaflet & React-Leaflet
- **HTTP Client:** Axios

## 📂 Project Structure

`	ext
blooddonation/
├── backend/                  # Spring Boot REST API & WebSocket Server
│   ├── src/main/java/...     # Core Business Logic (Controllers, Services, Models, Repositories)
│   └── src/main/resources/   # Application Configuration (application.properties)
└── frontend/                 # React SPA
    ├── src/                  # React Components, State Management, and Views
    └── public/               # Static assets
`

## ⚙️ Backend Architecture (Focus)

The backend is strictly typed and built around a robust relational model. Key design decisions include:
- **Repository Pattern:** Decoupling database operations using JpaRepository for Entities like Donor, BloodRequest, and DonationRecord.
- **Entity Integrity:** Advanced JPA annotations managing strict constraints, cascading updates, and relationship mapping (One-to-Many, Many-to-One).
- **Graceful Error Handling:** Global exception interception returning standardized JSON error payloads.
- **Location-Aware Queries:** Integration of Haversine formulas/spatial queries to restrict SOS dispatches to a 10km radius.
- **Security:** Headless API design ensuring standard REST statelessness while seamlessly validating OAuth 2.0 tokens from Google.

## 🚀 Getting Started

### 1. Clone the repository

`ash
git clone https://github.com/dipayannayak007-bot/blooddonation.git
cd blooddonation
`

### 2. Backend Setup

`ash
cd backend
# Ensure PostgreSQL is running on localhost:5432 or update application.properties
./mvnw spring-boot:run
`
*The API will be available at http://localhost:8080*

### 3. Frontend Setup

`ash
cd frontend
npm install
npm run dev
`
*The UI will be available at http://localhost:5173*

## 🤝 Contributing
Contributions are welcome. Fork the repository, create a new branch, make your changes, and submit a pull request.

## 📝 License
This project is currently for educational and academic project purposes.
