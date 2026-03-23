<div align="center">

# SkillBridge

**An AI-powered academic project collaboration platform connecting teachers with skilled students.**

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=flat&logo=google)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat)

</div>

---

## Overview

SkillBridge is a web platform that enables **teachers** to post academic projects and discover students whose skill sets match the project requirements. **Students** build rich profiles listing their technical skills with proficiency levels, accept or decline project invitations, and receive AI-generated skill assessments when viewed by teachers.

---
**An AI-powered academic project collaboration platform connecting teachers with skilled students.**

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=flat&logo=google)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat)

</div>

---

## Overview

SkillBridge is a web platform that enables **teachers** to post academic projects and discover students whose skill sets match the project requirements. **Students** build rich profiles listing their technical skills with proficiency levels, accept or decline project invitations, and receive AI-generated skill assessments when viewed by teachers.

---

## Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Stateless Bearer token auth for students and teachers |
| 🔒 **BCrypt Password Hashing** | All passwords hashed at rest via Spring Security |
| 🎯 **Skill-Based Matching** | Teachers search and filter students by required project skills |
| 📬 **Invitation System** | Teachers send invitations; students accept or reject |
| 🤖 **AI Skill Analysis** | Gemini 2.5 Flash analyses student skill profiles and recommends tech roles |
| 📊 **Live Dashboard Stats** | Real-time project, invitation, and skill metrics |
| 🔔 **Event Notifications** | DB-backed activity feed for all invitation and project events |
| 🖼️ **Avatar Uploads** | Profile picture uploads stored and served via Spring Boot |

---

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Stateless Bearer token auth for students and teachers |
| 🔒 **BCrypt Password Hashing** | All passwords hashed at rest via Spring Security |
| 🎯 **Skill-Based Matching** | Teachers search and filter students by required project skills |
| 📬 **Invitation System** | Teachers send invitations; students accept or reject |
| 🤖 **AI Skill Analysis** | Gemini 2.5 Flash analyses student skill profiles and recommends tech roles |
| 📊 **Live Dashboard Stats** | Real-time project, invitation, and skill metrics |
| 🔔 **Event Notifications** | DB-backed activity feed for all invitation and project events |
| 🖼️ **Avatar Uploads** | Profile picture uploads stored and served via Spring Boot |

---

## Tech Stack

### Backend
- **Java 21** + **Spring Boot 3.x**
- **Spring Security** (JWT stateless auth)
- **Spring Data JPA** + **Hibernate**
- **PostgreSQL 16**
- **BCryptPasswordEncoder**
- **JJWT** (io.jsonwebtoken)

### Frontend
- Vanilla **HTML / CSS / JavaScript**
- **Lucide** icon library (CDN)
- **Google Gemini 2.5 Flash API** for AI analysis

---

### Backend
- **Java 21** + **Spring Boot 3.x**
- **Spring Security** (JWT stateless auth)
- **Spring Data JPA** + **Hibernate**
- **PostgreSQL 16**
- **BCryptPasswordEncoder**
- **JJWT** (io.jsonwebtoken)

### Frontend
- Vanilla **HTML / CSS / JavaScript**
- **Lucide** icon library (CDN)
- **Google Gemini 2.5 Flash API** for AI analysis

---

## Project Structure

```

```
skill_bridge/
├── backend/
│   └── src/main/java/com/skillbridge/backend/
│       ├── auth/           # Login endpoints + change password
│       ├── student/        # Student entity, controller, repository, DTO
│       ├── teacher/        # Teacher entity, controller, repository
│       ├── project/        # Project CRUD + skill matching
│       ├── invitation/     # Invitation lifecycle
│       ├── activity/       # Event-driven notification feed
│       ├── skill/          # Skill catalogue
│       ├── upload/         # Avatar file upload
│       ├── security/       # JWT filter, utils, config, DataSeeder
│       └── config/         # WebMvc / CORS config
└── frontend/
    ├── index.html                  # Landing / login
    ├── student-dashboard.html
    ├── teacher-dashboard.html
    ├── student-profile.html
    ├── student-profile-view.html   # AI analysis card lives here
    ├── student-skills.html
    ├── student-invitations.html
    ├── teacher-projects.html
    ├── teacher-search.html
    ├── teacher-create-project.html
    ├── teacher-edit-project.html
    ├── project-candidates.html
    ├── script.js                   # All frontend logic
    ├── styles.css
    ├── config.js                   # 🔑 Gitignored — your Gemini API key
    └── config.example.js           # Template for contributors
```

---

## Getting Started

### Prerequisites
- Java 21+
- Maven 3.8+
- PostgreSQL 16+

### 1. Database Setup
```sql
CREATE DATABASE skillbridge;
```

### 2. Configure Application
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/skillbridge
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
The API runs on **http://localhost:8080**

### 4. Configure Gemini AI (optional)
```bash
cp frontend/config.example.js frontend/config.js
# Edit config.js and paste your Gemini API key
# Get one free at: https://aistudio.google.com/app/apikey
```

### 5. Open the Frontend
Open `frontend/index.html` with a local server (e.g. VS Code Live Server on port 5500).

---

## Default Accounts

After first startup, the DataSeeder automatically hashes any existing plaintext passwords. You can register new accounts via the UI.

---

## API Overview

Full API documentation: see [`docs/api_documentation.md`](docs/api_documentation.md)

Key base URL: `http://localhost:8080/api`

| Group | Prefix |
|---|---|
| Authentication | `/api/auth` |
| Students | `/api/students` |
| Teachers | `/api/teachers` |
| Projects | `/api/projects` |
| Invitations | `/api/invitations` |
| Skills | `/api/skills`, `/api/student-skills` |
| Activity Feed | `/api/activities` |
| Avatar Upload | `/api/upload` |

---

## Security

- All endpoints except `/api/auth/**`, `/api/students`, `/api/teachers`, and `/uploads/**` require a **Bearer JWT token** in the `Authorization` header.
- Passwords are hashed with **BCrypt** (strength 10).
- JWT tokens are valid for **24 hours**.
- `frontend/config.js` (containing the Gemini key) is **gitignored** — never committed.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Copy `frontend/config.example.js` → `frontend/config.js` and add your keys
4. Run the backend and open the frontend
5. Submit a pull request

---

## License

This project is submitted as an academic project. All rights reserved.
│   └── src/main/java/com/skillbridge/backend/
│       ├── auth/           # Login endpoints + change password
│       ├── student/        # Student entity, controller, repository, DTO
│       ├── teacher/        # Teacher entity, controller, repository
│       ├── project/        # Project CRUD + skill matching
│       ├── invitation/     # Invitation lifecycle
│       ├── activity/       # Event-driven notification feed
│       ├── skill/          # Skill catalogue
│       ├── upload/         # Avatar file upload
│       ├── security/       # JWT filter, utils, config, DataSeeder
│       └── config/         # WebMvc / CORS config
└── frontend/
    ├── index.html                  # Landing / login
    ├── student-dashboard.html
    ├── teacher-dashboard.html
    ├── student-profile.html
    ├── student-profile-view.html   # AI analysis card lives here
    ├── student-skills.html
    ├── student-invitations.html
    ├── teacher-projects.html
    ├── teacher-search.html
    ├── teacher-create-project.html
    ├── teacher-edit-project.html
    ├── project-candidates.html
    ├── script.js                   # All frontend logic
    ├── styles.css
    ├── config.js                   # 🔑 Gitignored — your Gemini API key
    └── config.example.js           # Template for contributors
```

---

## Getting Started

### Prerequisites
- Java 21+
- Maven 3.8+
- PostgreSQL 16+

### 1. Database Setup
```sql
CREATE DATABASE skillbridge;
```

### 2. Configure Application
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/skillbridge
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
The API runs on **http://localhost:8080**

### 4. Configure Gemini AI (optional)
```bash
cp frontend/config.example.js frontend/config.js
# Edit config.js and paste your Gemini API key
# Get one free at: https://aistudio.google.com/app/apikey
```

### 5. Open the Frontend
Open `frontend/index.html` with a local server (e.g. VS Code Live Server on port 5500).

---

## Default Accounts

After first startup, the DataSeeder automatically hashes any existing plaintext passwords. You can register new accounts via the UI.

---

## API Overview

Full API documentation: see [`docs/api_documentation.md`](docs/api_documentation.md)

Key base URL: `http://localhost:8080/api`

| Group | Prefix |
|---|---|
| Authentication | `/api/auth` |
| Students | `/api/students` |
| Teachers | `/api/teachers` |
| Projects | `/api/projects` |
| Invitations | `/api/invitations` |
| Skills | `/api/skills`, `/api/student-skills` |
| Activity Feed | `/api/activities` |
| Avatar Upload | `/api/upload` |

---

## Security

- All endpoints except `/api/auth/**`, `/api/students`, `/api/teachers`, and `/uploads/**` require a **Bearer JWT token** in the `Authorization` header.
- Passwords are hashed with **BCrypt** (strength 10).
- JWT tokens are valid for **24 hours**.
- `frontend/config.js` (containing the Gemini key) is **gitignored** — never committed.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Copy `frontend/config.example.js` → `frontend/config.js` and add your keys
4. Run the backend and open the frontend
5. Submit a pull request

---

## License

This project is submitted as an academic project. All rights reserved.
