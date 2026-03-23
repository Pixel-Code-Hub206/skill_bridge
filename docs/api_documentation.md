# SkillBridge API Documentation

**Base URL:** `http://localhost:8080/api`

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication — `/api/auth`

### POST `/api/auth/student/login`
Login as a student.

**Body:**
```json
{ "username": "hardik", "password": "pass123" }
```
**Response 200:**
```json
{ "id": 1, "role": "STUDENT", "name": "Hardik Verma", "token": "eyJ..." }
```
**Response 401:** `Invalid username or password`

---

### POST `/api/auth/teacher/login`
Login as a teacher.

**Body:** same as student login  
**Response 200:**
```json
{ "id": 1, "role": "TEACHER", "name": "Dr. Rao", "token": "eyJ..." }
```

---

### POST `/api/auth/password/change` 🔒
Change the authenticated user's password.

**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{ "oldPassword": "oldpass", "newPassword": "newpass" }
```
**Response 200:** `{ "message": "Password updated successfully" }`  
**Response 400:** `Invalid old password`

---

## Students — `/api/students`

### GET `/api/students` *(public)*
List all students.

**Response 200:** `[{ "id": 1, "name": "Hardik Verma", "email": "...", "department": "BCA", ... }]`

---

### POST `/api/students` *(public)*
Register a new student.

**Body:**
```json
{
  "name": "Hardik Verma",
  "username": "hardik",
  "password": "pass123",
  "email": "hardik@example.com",
  "department": "BCA",
  "year": "SECOND_YEAR",
  "availabilityStatus": "AVAILABLE"
}
```
**Response 200:** Created student object.

---

### GET `/api/students/{id}` 🔒
Get student profile by ID.

**Response 200:** Full student DTO including `skills[]` and `avatarUrl`.

---

### PUT `/api/students/{id}` 🔒
Update student profile fields.

**Body:** Partial or full student object.  
**Response 200:** Updated student object.

---

## Teachers — `/api/teachers`

### GET `/api/teachers` *(public)*
List all teachers.

### POST `/api/teachers` *(public)*
Register a new teacher.

**Body:**
```json
{
  "name": "Dr. Rao",
  "username": "drrao",
  "password": "pass123",
  "email": "rao@example.com",
  "department": "CS"
}
```

### GET `/api/teachers/{id}` 🔒
Get teacher by ID.

### PUT `/api/teachers/{id}` 🔒
Update teacher profile.

---

## Projects — `/api/projects`

### GET `/api/projects` 🔒
List all projects.

**Response 200:** `[{ "id": 1, "title": "...", "description": "...", "teacher": {...}, "requiredSkills": [...], "status": "ACTIVE" }]`

---

### GET `/api/projects/teacher/{teacherId}` 🔒
List projects for a specific teacher.

---

### POST `/api/projects` 🔒
Create a new project.

**Body:**
```json
{
  "title": "E-Commerce Website",
  "description": "Build a full-stack e-commerce site.",
  "deadline": "2025-08-01",
  "teacherId": 1,
  "requiredSkillIds": [2, 5, 8]
}
```
**Response 200:** Created project object.  
**Side effect:** Logs `"Project created"` activity for the teacher.

---

### PUT `/api/projects/{id}` 🔒
Update a project.

**Body:** Partial project fields.

---

### DELETE `/api/projects/{id}` 🔒
Delete a project.

**Response 204:** No content.

---

### GET `/api/projects/{id}/matching-students` 🔒
Get students whose skills match the project's required skills.

**Response 200:** `[{ "student": {...}, "matchScore": 3, "matchingSkills": [...] }]`

---

## Invitations — `/api/invitations`

### POST `/api/invitations` 🔒
Send an invitation from a teacher to a student.

**Body:**
```json
{ "projectId": 1, "studentId": 3 }
```
**Response 200:** Created invitation object.  
**Side effect:** Logs `"Invitation sent"` for teacher and `"New Project Invitation"` for student.

---

### GET `/api/invitations/student/{studentId}` 🔒
Get all invitations for a student.

---

### GET `/api/invitations/teacher/{teacherId}` 🔒
Get all invitations sent by a teacher.

---

### PUT `/api/invitations/{invitationId}/status` 🔒
Accept or reject an invitation.

**Body:**
```json
{ "status": "ACCEPTED" }
```
Valid values: `ACCEPTED`, `REJECTED`, `PENDING`  
**Side effect:** Logs acceptance/rejection activities for both teacher and student.

---

### GET `/api/invitations/project/{projectId}/accepted` 🔒
Get all accepted candidates for a specific project.

---

## Skills — `/api/skills`

### GET `/api/skills`
List the global skill catalogue.

### POST `/api/skills`
Add a new skill to the catalogue.

**Body:** `{ "name": "React" }`

---

## Student Skills — `/api/student-skills`

### GET `/api/student-skills/student/{studentId}` 🔒
Get all skills for a student (with proficiency levels).

### POST `/api/student-skills` 🔒
Assign a skill to a student.

**Body:**
```json
{ "studentId": 1, "skillId": 3, "proficiency": 4 }
```

### DELETE `/api/student-skills/{id}` 🔒
Remove a skill from a student's profile.

---

## Activity Feed — `/api/activities`

### GET `/api/activities/{role}/{userId}?limit=5` 🔒
Get recent activities for a user.

**Path params:** `role` = `student` or `teacher`, `userId` = numeric ID  
**Query param:** `limit` (default 5, max recommended 5)

**Response 200:**
```json
[
  {
    "id": 12,
    "userId": 1,
    "userRole": "STUDENT",
    "title": "New Project Invitation",
    "description": "You were invited to \"E-Commerce\" by Dr. Rao",
    "cssType": "INFO",
    "timestamp": "2025-03-23T15:30:00"
  }
]
```

---

## Avatar Upload — `/api/upload`

### POST `/api/upload/avatar/{role}/{id}` 🔒
Upload a profile picture.

**Content-Type:** `multipart/form-data`  
**Form field:** `file` (PNG, JPG, JPEG)

**Response 200:** `{ "avatarUrl": "/uploads/avatars/teacher_1_1742123456789.jpg" }`

Uploaded files are served at: `http://localhost:8080/uploads/avatars/<filename>`
