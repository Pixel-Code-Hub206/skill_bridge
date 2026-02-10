// Mock Data
const mockStudents = [
    {
        id: 1,
        name: "Hardik Verma",
        email: "hardik@example.com",
        department: "BCA",
        year: "THIRD_YEAR",
        availabilityStatus: "AVAILABLE",
        skills: [
            { name: "JavaScript", level: 4 },
            { name: "React", level: 3 },
            { name: "Node.js", level: 4 },
            { name: "Python", level: 3 }
        ]
    },
    {
        id: 2,
        name: "Mayank",
        email: "mayank@example.com",
        department: "BCA",
        year: "THIRD_YEAR",
        availabilityStatus: "AVAILABLE",
        skills: [
            { name: "Java", level: 5 },
            { name: "Spring Boot", level: 4 },
            { name: "MySQL", level: 4 },
            { name: "Docker", level: 3 }
        ]
    },
    {
        id: 3,
        name: "Priya Sharma",
        email: "priya@example.com",
        department: "BCA",
        year: "SECOND_YEAR",
        availabilityStatus: "BUSY",
        skills: [
            { name: "UI/UX Design", level: 5 },
            { name: "Figma", level: 5 },
            { name: "HTML/CSS", level: 4 },
            { name: "JavaScript", level: 3 }
        ]
    },
    {
        id: 4,
        name: "Rahul Kumar",
        email: "rahul@example.com",
        department: "MCA",
        year: "FIRST_YEAR",
        availabilityStatus: "AVAILABLE",
        skills: [
            { name: "Python", level: 5 },
            { name: "Machine Learning", level: 4 },
            { name: "Data Analysis", level: 4 },
            { name: "TensorFlow", level: 3 }
        ]
    },
    {
        id: 5,
        name: "Ananya Patel",
        email: "ananya@example.com",
        department: "BCA",
        year: "FOURTH_YEAR",
        availabilityStatus: "OPEN_TO_WORK",
        skills: [
            { name: "React", level: 4 },
            { name: "TypeScript", level: 4 },
            { name: "MongoDB", level: 3 },
            { name: "Express", level: 4 }
        ]
    }
];

const mockProjects = [
    {
        id: 1,
        title: "E-Commerce Website Development",
        description: "Build a full-stack e-commerce platform with payment integration",
        requiredSkills: [
            { name: "React", minLevel: 3 },
            { name: "Node.js", minLevel: 3 },
            { name: "MongoDB", minLevel: 2 }
        ],
        deadline: "2025-02-15",
        teacherName: "Mr. Nasrulla Khan"
    },
    {
        id: 2,
        title: "Machine Learning Model for Student Performance",
        description: "Develop a predictive model for student academic performance",
        requiredSkills: [
            { name: "Python", minLevel: 4 },
            { name: "Machine Learning", minLevel: 3 },
            { name: "Data Analysis", minLevel: 3 }
        ],
        deadline: "2025-03-01",
        teacherName: "Dr. Singh"
    }
];

const mockInvitations = [
    {
        id: 1,
        projectId: 1,
        projectTitle: "E-Commerce Website Development",
        teacherName: "Example teacher",
        status: "Pending",
        sentDate: "2024-12-25"
    },
    {
        id: 2,
        projectId: 2,
        projectTitle: "Machine Learning Model",
        teacherName: "Dr. Singh",
        status: "Accepted",
        sentDate: "2024-12-20"
    }
];

// Backend API base URL (update to your backend address)
const API_BASE_URL = 'http://localhost:8080/api';

// Current user role
let currentUserRole = 'student';
let currentStudent = mockStudents[0];

// Authentication helpers
function getStoredAuthToken() {
    return localStorage.getItem('authToken');
}

function saveAuthData({ token, role, userId } = {}) {
    if (token) localStorage.setItem('authToken', token);
    if (role) localStorage.setItem('userRole', role);
    if (userId) localStorage.setItem('userId', String(userId));
}

function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
}

function getAuthHeaders() {
    const token = getStoredAuthToken();
    if (!token) return {};
    return { 'Authorization': `Bearer ${token}` };
}

// Login Modal Functions
function showLoginModal(role) {
    currentUserRole = role;
    const modal = document.getElementById('loginModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (role === 'student') {
        modalTitle.textContent = 'Student Login';
    } else {
        modalTitle.textContent = 'Teacher Login';
    }
    
    modal.style.display = 'block';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showNotification('Please enter username and password', 'danger');
        return false;
    }

    if (!API_BASE_URL) {
        // Fallback to mock behavior
        closeLoginModal();
        if (currentUserRole === 'student') window.location.href = 'student-dashboard.html';
        else window.location.href = 'teacher-dashboard.html';
        return false;
    }

    const url =
        currentUserRole === 'student'
            ? 'http://localhost:8080/api/auth/student/login'
            : 'http://localhost:8080/api/auth/teacher/login';
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        if (!resp.ok) {
            if (resp.status === 401) showNotification('Invalid credentials', 'danger');
            else showNotification('Login failed. See console.', 'danger');
            console.error('Login failed', resp.status, resp.statusText);
            return false;
        }

        const data = await resp.json().catch(() => ({}));
        const token = data.token || data.accessToken || data.authToken || data.jwt;
        const roleFromResp = data.role || data.userRole || currentUserRole;
        const userId = data.userId || data.id || (data.user && data.user.id);

        if (token) saveAuthData({ token, role: roleFromResp, userId });

        closeLoginModal();
        const roleToUse = (roleFromResp || currentUserRole || '').toString().toLowerCase();
        if (roleToUse.includes('teacher')) window.location.href = 'teacher-dashboard.html';
        else window.location.href = 'student-dashboard.html';
        return false;
    } catch (err) {
        console.error('Login error', err);
        showNotification('Login error. See console.', 'danger');
        return false;
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        closeLoginModal();
    }
}

// Student Dashboard Functions
async function fetchStudentProfile() {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL not configured');
    }

    const url = `${API_BASE_URL.replace(/\/$/, '')}/students/1/profile`;
    const resp = await fetch(url, {
        method: 'GET',
        headers: Object.assign({ 'Accept': 'application/json' }, getAuthHeaders())
    });

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        const err = new Error(`Failed to fetch profile: ${resp.status} ${resp.statusText} ${text}`);
        err.status = resp.status;
        throw err;
    }

    const data = await resp.json();
    return data;
}

// Fetch a student profile by id (used by teacher view)
async function fetchStudentById(id) {
    if (!API_BASE_URL) throw new Error('API_BASE_URL not configured');
    const url = `${API_BASE_URL.replace(/\/$/, '')}/students/${id}/profile`;
    const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        const err = new Error(`Failed to fetch profile by id: ${resp.status} ${resp.statusText} ${text}`);
        err.status = resp.status;
        throw err;
    }
    return await resp.json();
}

async function loadStudentProfile() {
    const nameEl = document.getElementById('studentName');
    const emailEl = document.getElementById('studentEmail');
    const deptEl = document.getElementById('studentDepartment');
    const yearEl = document.getElementById('studentYear');
    const statusSelect = document.getElementById('availabilityStatus');

    // show loading placeholders
    if (nameEl && 'value' in nameEl) nameEl.value = 'Loading...';
    if (emailEl && 'value' in emailEl) emailEl.value = 'Loading...';

    try {
        const profile = API_BASE_URL ? await fetchStudentProfile() : null;
        if (profile && profile.id) {
            currentStudent = profile;
        }
    } catch (err) {
        console.warn('Could not load profile from API, using mock data.', err);
        if (err && err.status === 401) {
            // Unauthorized - optionally redirect to login
            // window.location.href = 'index.html';
        }
    }

    if (!currentStudent) return;

    // helper to get flexible keys
    const getFirst = (obj, keys) => {
        for (const k of keys) {
            if (obj && Object.prototype.hasOwnProperty.call(obj, k)) {
                const v = obj[k];
                if (v !== undefined && v !== null && String(v).toLowerCase() !== 'null' && String(v).trim() !== '') return String(v).trim();
            }
        }
        return null;
    };

    const nameVal = getFirst(currentStudent, ['name', 'fullName', 'full_name', 'displayName']);
    const emailVal = getFirst(currentStudent, ['email', 'emailAddress', 'email_address']);

    if (nameEl) {
        if ('value' in nameEl) nameEl.value = nameVal || '';
        else nameEl.textContent = nameVal || '';
    }
    if (emailEl) {
        if ('value' in emailEl) emailEl.value = emailVal || '';
        else emailEl.textContent = emailVal || '';
    }

    // populate sidebar name/avatar if present (different pages use different ids)
    const sidebarNameEl = document.getElementById('sidebarUserName') || document.getElementById('studentName');
    const sidebarAvatarEl = document.getElementById('sidebarAvatar') || document.querySelector('.user-avatar');
    if (sidebarNameEl) {
        const displayName = nameVal || getFirst(currentStudent, ['name']) || '';
        if ('value' in sidebarNameEl) sidebarNameEl.value = displayName;
        else sidebarNameEl.textContent = displayName;
    }
    if (sidebarAvatarEl) {
        const displayName = nameVal || getFirst(currentStudent, ['name']) || '';
        const initials = displayName.split(' ').filter(Boolean).map(n => n[0].toUpperCase()).slice(0,2).join('') || 'U';
        sidebarAvatarEl.textContent = initials;
    }

    // set selects — API should return enum values matching option `value`s (e.g. BCA, FIRST_YEAR, AVAILABLE)
    const deptVal = getFirst(currentStudent, ['department', 'dept', 'departmentName']);
    const yearVal = getFirst(currentStudent, ['year', 'academicYear', 'academic_year']);
    const availabilityVal = getFirst(currentStudent, ['availabilityStatus', 'availability', 'status']);

    // safely set select values (if option exists)
    const safeSetSelect = (selectEl, val) => {
        if (!selectEl || !val) return;
        const opt = Array.from(selectEl.options).find(o => o.value === val);
        if (opt) selectEl.value = val;
        else {
            // try matching by display text (case-insensitive)
            const byText = Array.from(selectEl.options).find(o => o.text.toLowerCase() === String(val).toLowerCase());
            if (byText) selectEl.value = byText.value;
        }
    };

    if (deptEl) {
        if (deptEl.tagName === 'SELECT') safeSetSelect(deptEl, deptVal || currentStudent.department);
        else deptEl.textContent = humanizeDepartment(deptVal || currentStudent.department);
    }
    if (yearEl) {
        if (yearEl.tagName === 'SELECT') safeSetSelect(yearEl, yearVal || currentStudent.year);
        else yearEl.textContent = humanizeYear(yearVal || currentStudent.year);
    }
    if (statusSelect) {
        if (statusSelect.tagName === 'SELECT') safeSetSelect(statusSelect, availabilityVal || currentStudent.availabilityStatus);
        else {
            // element may be a span/badge
            statusSelect.textContent = humanizeAvailability(availabilityVal || currentStudent.availabilityStatus);
            statusSelect.className = availabilityBadgeClass(availabilityVal || currentStudent.availabilityStatus);
        }
    }

    displayStudentSkills();
    try { populateSocialLinks(); } catch (e) {}
}

function displayStudentSkills() {
    const container = document.getElementById('skillsDisplay');
    if (!container) return;
    
    container.innerHTML = '';
    const skills = (currentStudent.skills || []);
    (skills).forEach(skill => {
        const skillTag = createSkillTag(skill, true);
        container.appendChild(skillTag);
    });

    const noSkillsMessage = document.getElementById('noSkillsMessage');
    if (noSkillsMessage) {
        noSkillsMessage.style.display = skills.length === 0 ? 'block' : 'none';
    }
}

function createSkillTag(skill, showRemove = false) {
    const tag = document.createElement('div');
    tag.className = 'skill-tag';
    
    const levels = Array.from({length: 5}, (_, i) => 
        `<span class="level-dot ${i < skill.level ? 'filled' : ''}"></span>`
    ).join('');
    
    tag.innerHTML = `
        <span>${skill.name}</span>
        <span class="skill-level">${levels}</span>
        ${showRemove ? '<span class="remove-skill" onclick="removeSkill(\'' + skill.name + '\')">&times;</span>' : ''}
    `;
    
    return tag;
}

function addSkill() {
    const skillName = document.getElementById('skillName').value.trim();
    const skillLevel = parseInt(document.getElementById('skillLevel').value);
    
    if (!skillName) {
        alert('Please enter a skill name');
        return;
    }
    
    // Check if skill already exists
    const exists = currentStudent.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (exists) {
        alert('This skill already exists in your profile');
        return;
    }
    
    currentStudent.skills.push({ name: skillName, level: skillLevel });
    displayStudentSkills();
    
    // Clear inputs
    document.getElementById('skillName').value = '';
    document.getElementById('skillLevel').value = '3';
    
    showNotification('Skill added successfully!', 'success');
}

function removeSkill(skillName) {
    currentStudent.skills = currentStudent.skills.filter(s => s.name !== skillName);
    displayStudentSkills();
    showNotification('Skill removed successfully!', 'success');
}

function updateProfile() {
    // gather values from form selects (select `value`s are backend enum keys)
    const dept = document.getElementById('studentDepartment') ? document.getElementById('studentDepartment').value : null;
    const year = document.getElementById('studentYear') ? document.getElementById('studentYear').value : null;
    const availability = document.getElementById('availabilityStatus') ? document.getElementById('availabilityStatus').value : null;

    const payload = {};
    if (dept) payload.department = dept;
    if (year) payload.year = year;
    if (availability) payload.availabilityStatus = availability;

    const studentId = currentStudent && currentStudent.id ? currentStudent.id : 1;

    if (!API_BASE_URL) {
        // update local mock
        if (payload.department) currentStudent.department = payload.department;
        if (payload.year) currentStudent.year = payload.year;
        if (payload.availabilityStatus) currentStudent.availabilityStatus = payload.availabilityStatus;
        showNotification('Profile updated locally (mock).', 'success');
        return;
    }

    const url = `${API_BASE_URL.replace(/\/$/, '')}/students/${studentId}/profile`;
    fetch(url, {
        method: 'PUT',
        headers: Object.assign({ 'Content-Type': 'application/json', 'Accept': 'application/json' }, getAuthHeaders()),
        body: JSON.stringify(payload)
    }).then(async resp => {
        if (!resp.ok) {
            const txt = await resp.text().catch(() => '');
            throw new Error(`Update failed: ${resp.status} ${resp.statusText} ${txt}`);
        }
        const updated = await resp.json().catch(() => null);
        if (updated) currentStudent = Object.assign({}, currentStudent, updated);
        showNotification('Profile updated successfully!', 'success');
        try { populateSocialLinks(); } catch (e) {}
    }).catch(err => {
        console.error(err);
        showNotification('Failed to update profile. See console.', 'danger');
    });
}

// Populate social/professional links with real URLs or example placeholders
function populateSocialLinks() {
    if (!currentStudent) return;
    const EXAMPLES = {
        socialGithub: 'https://github.com/username',
        socialLinkedIn: 'https://linkedin.com/in/username',
        socialPortfolio: 'https://your-portfolio.example.com',
        socialBehance: 'https://behance.net/username'
    };

    const FIELDS = {
        socialGithub: ['github', 'githubUrl', 'github_url', 'github_link'],
        socialLinkedIn: ['linkedin', 'linkedinUrl', 'linkedin_url', 'linkedin_link'],
        socialPortfolio: ['portfolio', 'portfolioUrl', 'portfolio_url', 'website', 'websiteUrl'],
        socialBehance: ['behance', 'behanceUrl', 'behance_url', 'behance_link']
    };

    Object.keys(FIELDS).forEach(elId => {
        const el = document.getElementById(elId);
        if (!el) return;
        const keys = FIELDS[elId];
        let val = null;
        for (const k of keys) {
            const v = currentStudent[k];
            if (v !== undefined && v !== null && String(v).toLowerCase() !== 'null' && String(v).trim() !== '') { val = String(v).trim(); break; }
        }
        if (val) {
            el.href = val;
            el.style.display = 'inline-flex';
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            const label = el.querySelector('span:last-child'); if (label) label.textContent = elId === 'socialGithub' ? 'GitHub' : elId === 'socialLinkedIn' ? 'LinkedIn' : elId === 'socialPortfolio' ? 'Portfolio' : 'Behance';
        } else {
            const example = EXAMPLES[elId];
            el.href = example;
            el.title = 'Example: ' + example;
            el.style.display = 'inline-flex';
            el.style.opacity = '0.65';
            el.style.pointerEvents = 'none';
            const label = el.querySelector('span:last-child'); if (label) label.textContent = 'Example: ' + example;
        }
    });
}

function loadStudentInvitations() {
    const tbody = document.getElementById('invitationsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    mockInvitations.forEach(invitation => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${invitation.projectTitle}</td>
            <td>${invitation.teacherName}</td>
            <td>${invitation.sentDate}</td>
            <td><span class="badge badge-${invitation.status === 'Pending' ? 'warning' : invitation.status === 'Accepted' ? 'success' : 'danger'}">${invitation.status}</span></td>
            <td>
                ${invitation.status === 'Pending' ? `
                    <button class="btn btn-success btn-sm" onclick="respondToInvitation(${invitation.id}, 'Accepted')">Accept</button>
                    <button class="btn btn-danger btn-sm" onclick="respondToInvitation(${invitation.id}, 'Rejected')">Reject</button>
                ` : '-'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function respondToInvitation(invitationId, response) {
    const invitation = mockInvitations.find(inv => inv.id === invitationId);
    if (invitation) {
        invitation.status = response;
        loadStudentInvitations();
        showNotification(`Invitation ${response.toLowerCase()}!`, 'success');
    }
}

// Teacher Dashboard Functions
function createProject(event) {
    event.preventDefault();
    
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const deadline = document.getElementById('projectDeadline').value;
    
    // Get required skills
    const requiredSkills = [];
    const skillInputs = document.querySelectorAll('.required-skill-item');
    skillInputs.forEach(item => {
        const skillName = item.querySelector('.skill-name-input').value;
        const minLevel = parseInt(item.querySelector('.skill-level-input').value);
        if (skillName) {
            requiredSkills.push({ name: skillName, minLevel: minLevel });
        }
    });
    
    const newProject = {
        id: mockProjects.length + 1,
        title,
        description,
        requiredSkills,
        deadline,
        teacherName: "Example teacher"
    };
    
    mockProjects.push(newProject);
    
    document.getElementById('createProjectForm').reset();
    showNotification('Project created successfully!', 'success');
    
    // Redirect to search page
    setTimeout(() => {
        window.location.href = 'teacher-search.html';
    }, 1500);
}

function addRequiredSkill() {
    const container = document.getElementById('requiredSkillsContainer');
    const skillItem = document.createElement('div');
    skillItem.className = 'required-skill-item';
    skillItem.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr auto; gap: 1rem; margin-bottom: 1rem; align-items: end;';
    
    skillItem.innerHTML = `
        <div class="form-group" style="margin: 0;">
            <label>Skill Name</label>
            <input type="text" class="skill-name-input" placeholder="e.g., JavaScript, Python">
        </div>
        <div class="form-group" style="margin: 0;">
            <label>Min. Level (1-5)</label>
            <input type="number" class="skill-level-input" min="1" max="5" value="3">
        </div>
        <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">Remove</button>
    `;
    
    container.appendChild(skillItem);
}

function searchStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const department = document.getElementById('departmentFilter').value;
    const year = document.getElementById('yearFilter').value;
    const availability = document.getElementById('availabilityFilter').value;
    const skillFilter = document.getElementById('skillFilter').value.toLowerCase();
    
    let filteredStudents = mockStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm) || 
                            student.email.toLowerCase().includes(searchTerm);
        const matchesDept = !department || student.department === department;
        const matchesYear = !year || student.year === year;
        const matchesAvailability = !availability || student.availabilityStatus === availability;
        const matchesSkill = !skillFilter || student.skills.some(s => 
            s.name.toLowerCase().includes(skillFilter)
        );
        
        return matchesSearch && matchesDept && matchesYear && matchesAvailability && matchesSkill;
    });
    
    displaySearchResults(filteredStudents);
}

function displaySearchResults(students) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (students.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No students found matching your criteria.</p>';
        return;
    }
    
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'cursor: pointer; transition: all 0.3s ease;';
        card.onmouseover = function() { this.style.transform = 'translateY(-4px)'; this.style.boxShadow = 'var(--shadow-md)'; };
        card.onmouseout = function() { this.style.transform = 'translateY(0)'; this.style.boxShadow = 'var(--shadow-sm)'; };
        
        const skillsHTML = (student.skills || []).map(skill => {
            const levels = Array.from({length: 5}, (_, i) => 
                `<span class="level-dot ${i < skill.level ? 'filled' : ''}"></span>`
            ).join('');
            return `
                <div class="skill-tag">
                    <span>${skill.name}</span>
                    <span class="skill-level">${levels}</span>
                </div>
            `;
        }).join('');
        
        const humanDept = humanizeDepartment(student.department);
        const humanYear = humanizeYear(student.year);
        const humanAvailability = humanizeAvailability(student.availabilityStatus);
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1.25rem; margin-bottom: 0.5rem;">${student.name}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">${student.email}</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">${humanDept} - ${humanYear}</p>
                </div>
                <span class="${availabilityBadgeClass(student.availabilityStatus)}">
                    ${humanAvailability}
                </span>
            </div>
            <div style="margin-bottom: 1rem;">
                <strong style="color: var(--text-primary);">Skills:</strong>
                <div class="skills-container">${skillsHTML}</div>
            </div>
            <div style="display: flex; gap: 0.75rem;">
                <button class="btn btn-primary btn-sm" onclick="viewStudentProfile(${student.id})">View Profile</button>
                <button class="btn btn-secondary btn-sm" onclick="sendInvitation(${student.id})">Send Invitation</button>
            </div>
        `;
        
        resultsContainer.appendChild(card);
    });
}

function viewStudentProfile(studentId) {
    localStorage.setItem('viewStudentId', studentId);
    window.location.href = 'student-profile-view.html';
}

function sendInvitation(studentId) {
    const student = mockStudents.find(s => s.id === studentId);
    if (student) {
        showNotification(`Invitation sent to ${student.name}!`, 'success');
    }
}

function loadMyProjects() {
    const container = document.getElementById('myProjectsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    mockProjects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const skillsHTML = project.requiredSkills.map(skill => 
            `<span class="skill-tag">${skill.name} (Min: ${skill.minLevel})</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${project.title}</h3>
                <span class="badge badge-info">Active</span>
            </div>
            <div class="card-body">
                <p style="margin-bottom: 1rem;">${project.description}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Required Skills:</strong></p>
                <div class="skills-container" style="margin-bottom: 1rem;">${skillsHTML}</div>
                <p style="color: var(--text-secondary);"><strong>Deadline:</strong> ${project.deadline}</p>
                <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
                    <button class="btn btn-primary btn-sm">View Candidates</button>
                    <button class="btn btn-secondary btn-sm">Edit Project</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

async function loadStudentProfileView() {
    const studentId = parseInt(localStorage.getItem('viewStudentId'));
    if (!studentId) {
        document.body.innerHTML = '<p>Student not found</p>';
        return;
    }

    let student = null;
    if (API_BASE_URL) {
        try {
            student = await fetchStudentById(studentId);
        } catch (err) {
            console.warn('Could not fetch student from API, falling back to mock data.', err);
            student = mockStudents.find(s => s.id === studentId);
        }
    } else {
        student = mockStudents.find(s => s.id === studentId);
    }

    if (!student) {
        document.body.innerHTML = '<p>Student not found</p>';
        return;
    }

    document.getElementById('viewStudentName').textContent = student.name || '';
    document.getElementById('viewStudentEmail').textContent = student.email || '';
    document.getElementById('viewStudentDepartment').textContent = humanizeDepartment(student.department);
    document.getElementById('viewStudentYear').textContent = humanizeYear(student.year);

    const statusBadge = document.getElementById('viewStudentStatus');
    statusBadge.textContent = humanizeAvailability(student.availabilityStatus);
    statusBadge.className = availabilityBadgeClass(student.availabilityStatus);

    const skillsContainer = document.getElementById('viewStudentSkills');
    skillsContainer.innerHTML = '';

    (student.skills || []).forEach(skill => {
        const skillTag = createSkillTag(skill, false);
        skillsContainer.appendChild(skillTag);
    });
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Helpers to convert backend enum values to human-friendly labels
function humanizeAvailability(av) {
    if (!av) return '';
    const m = String(av).toUpperCase();
    if (m === 'AVAILABLE') return 'Available';
    if (m === 'BUSY') return 'Busy';
    if (m === 'OPEN_TO_WORK') return 'Open to Work';
    return av;
}

function availabilityBadgeClass(av) {
    const m = String(av || '').toUpperCase();
    if (m === 'AVAILABLE') return 'badge badge-success';
    if (m === 'BUSY') return 'badge badge-warning';
    if (m === 'OPEN_TO_WORK') return 'badge badge-info';
    return 'badge badge-secondary';
}

function humanizeYear(y) {
    if (!y) return '';
    const m = String(y).toUpperCase();
    if (m === 'FIRST_YEAR') return 'First Year';
    if (m === 'SECOND_YEAR') return 'Second Year';
    if (m === 'THIRD_YEAR') return 'Third Year';
    if (m === 'FOURTH_YEAR') return 'Fourth Year';
    return y;
}

function humanizeDepartment(d) {
    if (!d) return '';
    const m = String(d).toUpperCase();
    if (m === 'BCA') return 'BCA';
    if (m === 'MCA') return 'MCA';
    if (m === 'BSC') return 'BSc';
    if (m === 'MSC') return 'MSc';
    return d;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        clearAuthData();
        window.location.href = 'index.html';
    }
}

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    if (path.includes('student-dashboard.html')) {
        loadStudentProfile();
    } else if (path.includes('student-profile.html')) {
        loadStudentProfile();
    } else if (path.includes('student-skills.html')) {
        loadStudentProfile();
    } else if (path.includes('student-invitations.html')) {
        // populate sidebar/profile first, then invitations
        loadStudentProfile();
        loadStudentInvitations();
    } else if (path.includes('teacher-search.html')) {
        displaySearchResults(mockStudents);
    } else if (path.includes('teacher-projects.html')) {
        loadMyProjects();
    } else if (path.includes('student-profile-view.html')) {
        loadStudentProfileView();
    }
});
