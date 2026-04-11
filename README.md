<div align="center">

# SkillBridge

**An AI-powered academic project collaboration platform connecting teachers with skilled students.**

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=flat&logo=google)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat)

<br/>

<img width="1893" height="1014" alt="screenshot-2026-03-31_21-49-55" src="https://github.com/user-attachments/assets/858dde19-19ae-4ddc-8c50-c1ce5f89389e" />

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

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/71b9bd8f-cc2f-437b-b214-1fa8a946faca" />

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


## Project Structure

```text
skill_bridge/
├── backend/
│   └── src/main/java/com/skillbridge/backend/
│       ├── auth/           # Login endpoints + change password
│       ├── student/        # Student entity, controller, repository, DTO
│       ├── teacher/        # Teacher entity, controller, repository
│       ├── project/        # Project CRUD + skill matching
│       ├── invitation/     # Invitation lifecycle
│       ├── activity/       # Event-driven notification feed
│       ├── ai/             # Gemini API integration service
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
    └── styles.css
````

-----

## Getting Started

### Prerequisites

  - Java 21+
  - Maven 3.8+
  - PostgreSQL 16+

### 1\. Database Setup

```sql
CREATE DATABASE skillbridge;
```

### 2\. Configure Application

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/skillbridge
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 3\. Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API runs on **http://localhost:8080**

### 4\. Configure Gemini AI (optional)

Provide your Gemini API key via an environment variable when running the backend, or edit it directly in `backend/src/main/resources/application.properties`:

```bash
export GEMINI_API_KEY="your_actual_key_here"
# Get one free at: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
```

### 5\. Open the Frontend

Open `frontend/index.html` with a local server (e.g. VS Code Live Server on port 5500).

-----

## 🔑 Test Accounts (Demo Data)

*Note: For security and institutional integrity, public registration is currently disabled. Please use the following pre-configured demo credentials to explore the platform's features.*

### 🎓 Student Accounts

Log in as a student to view the dashboard, manage skills, and respond to project invitations.

| Name | Username | Password | Dept | Year | Status | Key Skills |
|---|---|---|---|---|---|---|
| Mayank | `pixel` | `test1234` | BCA | 3rd | Open to Work | Flutter, Spring Boot, Java |
| Arun Goyal | `Damo` | `design123`| BCA | 2nd | Available | — |
| Arun Goyal | `arun` | `demo123` | BCA | 2nd | Available | React, JS, CSS, Figma |
| Priya Sharma | `priya` | `demo123` | MCA | 1st | Open to Work | Python, ML, TensorFlow |
| Rahul Mehta | `rahul` | `demo123` | BCA | 3rd | Available | Java, Spring Boot, PostgreSQL |
| Sneha Patel | `sneha` | `demo123` | BSC | 2nd | Busy | Flutter, Kotlin, Git |
| Arjun Nair | `arjun` | `demo123` | MCA | 2nd | Available | Node.js, JS, MongoDB, Docker |
| Kavya Reddy | `kavya` | `demo123` | BCA | 4th | Open to Work | UI/UX, Figma, Adobe XD |
| Rohan Verma | `rohan` | `demo123` | BSC | 1st | Available | Python, Django, PostgreSQL |
| Anjali Singh | `anjali` | `demo123` | MCA | 3rd | Open to Work | Angular, TypeScript, HTML |
| Vikram Kumar | `vikram` | `demo123` | BCA | 2nd | Available | Java, Spring Boot, MySQL |
| Divya Menon | `divya` | `demo123` | BSC | 3rd | Busy | Vue.js, JS, Node.js |
| Siddharth Joshi| `sid` | `demo123` | MCA | 4th | Available | C++, Python, ML |
| Neha Gupta | `neha` | `demo123` | BCA | 1st | Open to Work | HTML, CSS, JS, Figma |
| Karan Malhotra | `karan` | `demo123` | BSC | 2nd | Available | PHP, Laravel, MySQL |


### 👨‍🏫 Teacher Accounts

Log in as a teacher to post projects, search for skilled students, trigger AI analysis, and send out invitations.

| Name | Username | Password |
|---|---|---|
| Dr. Rao | `rao` | `teach123` |
| Dr. Nasrulla Khan | `Nasrulla` | `teach123` |
| Prof. Anita Sharma | `anita` | `demo123` |
| Dr. Ramesh Iyer | `ramesh` | `demo123` |
| Prof. Sunita Verma | `sunita` | `demo123` |
| Dr. Karthik Menon | `karthik` | `demo123` |
| Prof. Deepa Nair | `deepa` | `demo123` |
| Dr. Suresh Patel | `suresh` | `demo123` |
| Prof. Lavanya Kumar | `lavanya` | `demo123` |
| Dr. Vivek Joshi | `vivek` | `demo123` |
| Prof. Meera Reddy | `meera` | `demo123` |
| Dr. Arun Krishnan | `akrishnan` | `demo123` |
| Prof. Pooja Malhotra | `pooja` | `demo123` |

-----

## API Overview

Full API documentation: see [`docs/api_documentation.md`](https://www.google.com/search?q=docs/api_documentation.md)

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

-----

## Security

  - All endpoints except `/api/auth/**`, `/api/students`, `/api/teachers`, and `/uploads/**` require a **Bearer JWT token** in the `Authorization` header.
  - Passwords are hashed with **BCrypt** (strength 10).
  - JWT tokens are valid for **24 hours**.
  - The Gemini API is managed purely on the backend. The API key is securely injected via the `GEMINI_API_KEY` environment variable inside `application.properties`, eliminating client-side exposure.

-----

## Contributing

1.  Fork the repository
2.  Create a feature branch: `git checkout -b feature/your-feature`
3.  Make your changes
4.  Run the backend and open the frontend
5.  Submit a pull request

-----

## License & Copyright

©️ This project is submitted as an academic project. All rights reserved.

**The TL;DR:** You are completely free to clone this, tear it apart, use the code, or turn it into your own project. Live and learn\! 🦔🌪️ Just leave my name on the original work, and please don't sue me if my late-night Spring Boot logic somehow crashes your server.
