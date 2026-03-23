# SkillBridge — Postman Test Cases

Import these as individual requests into a Postman collection.  
Set the `baseUrl` variable to `http://localhost:8080/api`.  
After login, set `studentToken` / `teacherToken` variables from the response.

---

## TC-01: Student Registration
- **Method:** `POST`
- **URL:** `{{baseUrl}}/students`
- **Body (JSON):**
```json
{
  "name": "Test Student",
  "username": "teststudent",
  "password": "test123",
  "email": "test@student.com",
  "department": "BCA",
  "year": "SECOND_YEAR",
  "availabilityStatus": "AVAILABLE"
}
```
- **Expected:** `200 OK` with student object containing `id`, `name`, `username`
- **Assert:** `response.id > 0`

---

## TC-02: Teacher Registration
- **Method:** `POST`
- **URL:** `{{baseUrl}}/teachers`
- **Body (JSON):**
```json
{
  "name": "Test Teacher",
  "username": "testteacher",
  "password": "test123",
  "email": "test@teacher.com",
  "department": "CS"
}
```
- **Expected:** `200 OK` with teacher object

---

## TC-03: Student Login — Valid Credentials
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/student/login`
- **Body:** `{ "username": "teststudent", "password": "test123" }`
- **Expected:** `200 OK`, response contains `token` field
- **Post-action:** `pm.environment.set("studentToken", pm.response.json().token)`

---

## TC-04: Student Login — Invalid Password
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/student/login`
- **Body:** `{ "username": "teststudent", "password": "wrongpass" }`
- **Expected:** `401 Unauthorized`
- **Assert:** `response.status === 401`

---

## TC-05: Teacher Login — Valid Credentials
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/teacher/login`
- **Body:** `{ "username": "testteacher", "password": "test123" }`
- **Expected:** `200 OK`, response contains `token`
- **Post-action:** `pm.environment.set("teacherToken", pm.response.json().token)`

---

## TC-06: Access Protected Endpoint Without Token
- **Method:** `GET`
- **URL:** `{{baseUrl}}/students/1`
- **Headers:** *(no Authorization)*
- **Expected:** `403 Forbidden`

---

## TC-07: Get Student Profile (Authenticated)
- **Method:** `GET`
- **URL:** `{{baseUrl}}/students/{{studentId}}`
- **Headers:** `Authorization: Bearer {{studentToken}}`
- **Expected:** `200 OK` with full student DTO including `skills[]`

---

## TC-08: Create Project (Teacher)
- **Method:** `POST`
- **URL:** `{{baseUrl}}/projects`
- **Headers:** `Authorization: Bearer {{teacherToken}}`
- **Body:**
```json
{
  "title": "Test Project",
  "description": "A test project for QA",
  "deadline": "2025-12-31",
  "teacherId": {{teacherId}},
  "requiredSkillIds": [1]
}
```
- **Expected:** `200 OK`, response has `id`, `status: "ACTIVE"`
- **Post-action:** `pm.environment.set("projectId", pm.response.json().id)`

---

## TC-09: Send Invitation
- **Method:** `POST`
- **URL:** `{{baseUrl}}/invitations`
- **Headers:** `Authorization: Bearer {{teacherToken}}`
- **Body:** `{ "projectId": {{projectId}}, "studentId": {{studentId}} }`
- **Expected:** `200 OK`, response has `status: "PENDING"`
- **Post-action:** `pm.environment.set("invitationId", pm.response.json().id)`

---

## TC-10: Student Views Invitations
- **Method:** `GET`
- **URL:** `{{baseUrl}}/invitations/student/{{studentId}}`
- **Headers:** `Authorization: Bearer {{studentToken}}`
- **Expected:** `200 OK`, array containing the sent invitation

---

## TC-11: Accept Invitation
- **Method:** `PUT`
- **URL:** `{{baseUrl}}/invitations/{{invitationId}}/status`
- **Headers:** `Authorization: Bearer {{studentToken}}`
- **Body:** `{ "status": "ACCEPTED" }`
- **Expected:** `200 OK`, `invitation.status === "ACCEPTED"`

---

## TC-12: Activity Feed — Student (After Accepting)
- **Method:** `GET`
- **URL:** `{{baseUrl}}/activities/student/{{studentId}}?limit=5`
- **Headers:** `Authorization: Bearer {{studentToken}}`
- **Expected:** `200 OK`, array contains at least one entry with `title: "Project Invitation Accepted"`

---

## TC-13: Activity Feed — Teacher (After Project Created + Invitation)
- **Method:** `GET`
- **URL:** `{{baseUrl}}/activities/teacher/{{teacherId}}?limit=5`
- **Headers:** `Authorization: Bearer {{teacherToken}}`
- **Expected:** Array includes entries for `"Project created"`, `"Invitation sent"`, `"Invitation Accepted"`

---

## TC-14: Change Password
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/password/change`
- **Headers:** `Authorization: Bearer {{studentToken}}`
- **Body:** `{ "oldPassword": "test123", "newPassword": "newpass456" }`
- **Expected:** `200 OK`, `{ "message": "Password updated successfully" }`

---

## TC-15: Change Password — Wrong Old Password
- **Method:** `POST`
- **URL:** `{{baseUrl}}/auth/password/change`
- **Headers:** `Authorization: Bearer {{studentToken}}`
- **Body:** `{ "oldPassword": "wrongpass", "newPassword": "newpass456" }`
- **Expected:** `400 Bad Request`
