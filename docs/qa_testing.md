# SkillBridge — QA Test Plan

---

## Module 1: Authentication

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| QA-01 | Student Login — Valid | Navigate to index.html → Login as Student → Enter valid credentials | Dashboard loads, sidebar shows student name |
| QA-02 | Teacher Login — Valid | Login as Teacher | Teacher dashboard loads with correct name |
| QA-03 | Wrong Password | Enter incorrect password | Error message shown, no redirect |
| QA-04 | Empty Fields | Submit login with empty fields | Form validation prevents submission |
| QA-05 | Logout | Click Logout button | Custom styled modal appears; confirm clears session and returns to index |
| QA-06 | JWT Persistence | Login → Close tab → Reopen | Session still active (token in localStorage) |
| QA-07 | Change Password | Profile → Account Settings → Enter old + new password → Submit | Success notification shown; old password no longer works |
| QA-08 | Change Password — Wrong Old | Enter incorrect old password | Error notification, password unchanged |

---

## Module 2: Student Profile

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| QA-09 | Profile Load | Navigate to student-profile.html | All fields populated from backend |
| QA-10 | Edit Profile | Change name/department → Save Changes | Changes persisted and reflected after refresh |
| QA-11 | Avatar Upload | Click sidebar avatar → Select image file | Image replaces green initials circle immediately |
| QA-12 | Avatar Persistence | Upload image → Refresh page | Uploaded image still shown |
| QA-13 | Profile Completion | Dashboard metric | Percentage reflects actual filled fields |

---

## Module 3: Student Skills

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| QA-14 | Add Skill | student-skills.html → Type skill name → Set proficiency → Add | Skill card appears with correct dot indicators |
| QA-15 | Delete Skill | Click × on skill card | Skill removed, dashboard metric updates |
| QA-16 | Skill Display on Dashboard | Add 3+ skills | Dashboard "My Skills" section shows them |

---

## Module 4: Teacher Projects

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| QA-17 | Create Project | teacher-create-project.html → Fill all fields → Create | Project appears under "My Projects" |
| QA-18 | Edit Project | My Projects → Edit → Modify title → Save | Updated title shown in list |
| QA-19 | Delete Project | My Projects → Delete | Project removed; confirmation modal |
| QA-20 | Project Status | Created project | Default status is `ACTIVE` |

---

## Module 5: Search & Invitations

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| QA-21 | Search Students | teacher-search.html → Select project with required skills | Only students with matching skills returned |
| QA-22 | View Student Profile | Click student from search results | student-profile-view.html loads with their details |
| QA-23 | Send Invitation | View student → Invite to Project → Select project → Send | Invitation appears in student's invitation list |
| QA-24 | Prevent Duplicate Invite | Send invitation to same student twice | Second invite handled gracefully |
| QA-25 | Accept Invitation | student-invitations.html → Accept | Status changes to ACCEPTED; shows in teacher's accepted candidates |
| QA-26 | Reject Invitation | student-invitations.html → Reject | Status changes to REJECTED |
| QA-27 | View Accepted Candidates | Teacher → My Projects → View Candidates | Only accepted students shown |

---

## Module 6: AI Skill Analysis (Project Suitability)

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| QA-28 | AI Cards Load | Open student-profile-view.html (student with skills) | 3–5 suitability cards rendered with green/yellow borders |
| QA-29 | Strong Area Card | Student has skill at level 4+ in a domain | Card shows green border + checkmark icon |
| QA-30 | Weak Area Card | Student has no skills in a domain | Card shows yellow border + warning icon |
| QA-31 | No Skills Edge Case | View student with zero skills | "No skills data available" message shown |
| QA-32 | Missing Config Key | Remove/blank config.js API key | Friendly "add your key" message shown, no crash |

---

## Module 7: Activity / Notification Feed

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| QA-33 | Project Created Event | Teacher creates new project | Event appears in teacher's Recent Activity feed |
| QA-34 | Invitation Sent Event | Teacher sends invitation | Activity logged for teacher AND student |
| QA-35 | Acceptance Event | Student accepts | Both teacher and student feeds updated |
| QA-36 | Rejection Event | Student rejects | Both feeds updated with warning-colored card |
| QA-37 | Feed Limit | Generate 10+ events | Only latest 5 shown in dashboard |
| QA-38 | Bell Icon Scroll | Click bell icon on any dashboard | Page scrolls smoothly to Recent Activity section |

---

## Module 8: Dashboard Metrics

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| QA-39 | Student Stats | View student dashboard | Total skills, active invitations, accepted projects, profile % are live values |
| QA-40 | Teacher Stats | View teacher dashboard | Active projects, total platform students, invitations sent, accepted count shown |
| QA-41 | Recent Projects | Teacher dashboard | Last 3 projects displayed with correct titles |

---

## Regression Checklist (Run after any change)

- [ ] Login works for both roles
- [ ] JWT token included in all API calls
- [ ] Skills load on student profile
- [ ] Invitation status updates persist
- [ ] Activity feed shows correct events
- [ ] AI analysis renders without console errors
- [ ] Avatar persists after page refresh
