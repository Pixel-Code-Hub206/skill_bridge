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

// Global skills list
let availableSkills = [];

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

        // Always persist role and userId even if backend didn't return a token
        saveAuthData({ token, role: roleFromResp, userId });

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
// Fetch teacher profile from backend
async function fetchTeacherProfile() {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL not configured');
    }

    const storedId = localStorage.getItem('userId');
    const teacherId = storedId ? parseInt(storedId, 10) : 1;
    const url = `${API_BASE_URL}/teachers/${teacherId}`;
    
    console.log('🌐 Fetching teacher profile from:', url);
    const authHeaders = getAuthHeaders();
    
    const resp = await fetch(url, {
        method: 'GET',
        headers: Object.assign({ 'Accept': 'application/json' }, authHeaders)
    });

    console.log('📊 Teacher Profile API Response status:', resp.status, resp.statusText);

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        console.error('❌ Teacher profile fetch error:', resp.status, text);
        const err = new Error(`Failed to fetch teacher profile: ${resp.status} ${resp.statusText} ${text}`);
        err.status = resp.status;
        throw err;
    }

    const data = await resp.json();
    console.log('✅ Teacher profile data received:', data);
    return data;
}

function loadTeacherProfile() {
    const sidebarNameEl = document.getElementById('sidebarUserName') || document.querySelector('.user-profile h4');
    const sidebarAvatarEl = document.getElementById('sidebarAvatar') || document.querySelector('.user-avatar');

    (async () => {
        try {
            console.log('📋 Starting teacher profile load, API_BASE_URL:', API_BASE_URL);
            if (API_BASE_URL) {
                const teacher = await fetchTeacherProfile();
                const teacherName = teacher.name;
                console.log('✅ Teacher profile loaded:', teacherName);
                
                if (sidebarNameEl) {
                    if ('value' in sidebarNameEl) sidebarNameEl.value = teacherName;
                    else sidebarNameEl.textContent = teacherName;
                }
                
                if (sidebarAvatarEl) {
                    const initials = teacherName.split(' ').filter(Boolean).map(n => n[0].toUpperCase()).slice(0, 2).join('');
                    sidebarAvatarEl.textContent = initials;
                }
            }
        } catch (err) {
            console.error('❌ Failed to load teacher profile:', err.message);
        }
    })();
}

async function fetchAllSkills() {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL not configured');
    }

    const url = `${API_BASE_URL}/skills`;
    console.log('🌐 Fetching all skills from:', url);
    const authHeaders = getAuthHeaders();

    const resp = await fetch(url, {
        method: 'GET',
        headers: Object.assign({ 'Accept': 'application/json' }, authHeaders)
    });

    console.log('📊 Skills API Response status:', resp.status, resp.statusText);

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        console.error('❌ Skills fetch error:', resp.status, text);
        const err = new Error(`Failed to fetch skills: ${resp.status} ${resp.statusText} ${text}`);
        err.status = resp.status;
        throw err;
    }

    const data = await resp.json();
    console.log('✅ Skills data received:', data);
    return Array.isArray(data) ? data : data.skills || [];
}

async function loadAllSkills() {
    const dropdown = document.getElementById('skillName');
    if (!dropdown) return;
    
    try {
        const resp = await fetch(`${API_BASE_URL}/skills`, {
            method: 'GET',
            headers: Object.assign({ 'Accept': 'application/json' }, getAuthHeaders())
        });
        
        if (!resp.ok) throw new Error(`Failed to fetch skills: ${resp.status}`);
        
        availableSkills = await resp.json();
        dropdown.innerHTML = '<option value="">-- Select a skill --</option>';
        availableSkills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill.id;
            option.textContent = skill.name;
            dropdown.appendChild(option);
        });
    } catch (err) {
        console.error('Failed to load skills:', err);
    }
}

async function fetchStudentProfile() {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL not configured');
    }

    // prefer the logged-in userId saved during login
    const storedId = localStorage.getItem('userId');
    const studentId = storedId ? parseInt(storedId, 10) : 1;
    const url = `${API_BASE_URL.replace(/\/$/, '')}/students/${studentId}/profile`;
    
    console.log('🌐 Fetching student profile from:', url);
    const authHeaders = getAuthHeaders();
    console.log('🔐 Auth headers:', Object.keys(authHeaders).length > 0 ? 'Present' : 'None');
    
    const resp = await fetch(url, {
        method: 'GET',
        headers: Object.assign({ 'Accept': 'application/json' }, authHeaders)
    });

    console.log('📊 Profile API Response status:', resp.status, resp.statusText);

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        console.error('❌ Profile fetch error:', resp.status, text);
        const err = new Error(`Failed to fetch profile: ${resp.status} ${resp.statusText} ${text}`);
        err.status = resp.status;
        throw err;
    }

    const data = await resp.json();
    console.log('✅ Profile data received:', data);
    return data;
}

// Fetch a student profile by id (used by teacher view)
async function fetchStudentById(id) {
    if (!API_BASE_URL) throw new Error('API_BASE_URL not configured');
    const url = `${API_BASE_URL.replace(/\/$/, '')}/students/${id}/profile`;
    const resp = await fetch(url, { method: 'GET', headers: Object.assign({ 'Accept': 'application/json' }, getAuthHeaders()) });
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
        console.log('📋 Starting profile load, API_BASE_URL:', API_BASE_URL);
        const profile = API_BASE_URL ? await fetchStudentProfile() : null;
        if (profile && profile.id) {
            currentStudent = profile;
            console.log('✅ Profile loaded successfully:', currentStudent);
        } else {
            console.warn('⚠️ No profile or ID in response:', profile);
        }
    } catch (err) {
        console.error('❌ Failed to load profile from API:', err.message, err);
        if (err && err.status === 401) {
            console.warn('⚠️ Unauthorized - user not logged in');
            // Unauthorized - optionally redirect to login
            // window.location.href = 'index.html';
        } else {
            console.warn('Using mock data as fallback');
        }
    }

    if (!currentStudent) {
        console.error('❌ No student data available - profile load failed');
        if (nameEl && 'value' in nameEl) nameEl.value = 'Error loading profile';
        if (emailEl && 'value' in emailEl) emailEl.value = 'Please check console for details';
        return;
    }

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

    loadStudentSkills();
    try { populateSocialLinks(); } catch (e) {}
}

function renderStudentSkills(studentSkills = []) {
    const container = document.getElementById('skillsDisplay');
    if (!container) return;
    
    container.innerHTML = '';

    if (!Array.isArray(studentSkills)) studentSkills = [];
    
    studentSkills.forEach(studentSkill => {
        const skillId = studentSkill.id;
        const skillName = studentSkill.skill.name;
        const proficiency = studentSkill.proficiency;

        const card = document.createElement('div');
        card.className = 'skill-card';

        card.innerHTML = `
            <span>${skillName}</span>
            <span>${'●'.repeat(proficiency)}</span>
            <button onclick="deleteStudentSkill(${skillId})">×</button>
        `;

        container.appendChild(card);
    });

    const noSkillsMessage = document.getElementById('noSkillsMessage');
    if (noSkillsMessage) {
        noSkillsMessage.style.display = studentSkills.length === 0 ? 'block' : 'none';
    }
}

function createSkillTag(skill, showRemove = false) {
    const tag = document.createElement('div');
    tag.className = 'skill-tag';
    
    // Backend format: id is the StudentSkill ID, skillName and proficiency are properties
    const studentSkillId = skill.id ? parseInt(skill.id, 10) : null;
    const skillName = skill.skillName || 'Unknown';
    const proficiency = skill.proficiency || 1;
    
    const levels = Array.from({length: 5}, (_, i) => 
        `<span class="level-dot ${i < proficiency ? 'filled' : ''}"></span>`
    ).join('');
    
    tag.innerHTML = `
        <span>${skillName}</span>
        <span class="skill-level">${levels}</span>
        ${showRemove && studentSkillId ? '<button onclick="deleteStudentSkill(' + studentSkillId + ')">×</button>' : ''}
    `;
    
    return tag;
}

async function loadStudentSkills() {
    const studentId = currentStudent?.id || parseInt(localStorage.getItem('userId'), 10) || 1;
    
    try {
        const resp = await fetch(`${API_BASE_URL}/student-skills/student/${studentId}`, {
            method: 'GET',
            headers: Object.assign({ 'Accept': 'application/json' }, getAuthHeaders())
        });
        
        if (!resp.ok) throw new Error(`Failed to fetch student skills: ${resp.status}`);
        
        const studentSkills = await resp.json();
        renderStudentSkills(studentSkills);
    } catch (err) {
        console.error('Failed to load student skills:', err);
        renderStudentSkills([]);
    }
}

function addSkill() {
    const skillId = parseInt(document.getElementById('skillName').value);
    const skillLevel = parseInt(document.getElementById('skillLevel').value);
    
    if (!skillId) {
        alert('Please select a skill');
        return;
    }
    
    // Find the skill from availableSkills
    const skill = availableSkills.find(s => s.id === skillId);
    if (!skill) {
        alert('Selected skill not found');
        return;
    }
    
    const skillName = skill.name;
    
    // Check if skill already exists
    const exists = currentStudent.skills.some(s => {
        return (s.id === skillId) || ((s.skillName || '').toLowerCase() === skillName.toLowerCase());
    });
    if (exists) {
        alert('This skill already exists in your profile');
        return;
    }
    
    const studentId = currentStudent && currentStudent.id ? currentStudent.id : 1;
    
    if (!API_BASE_URL) {
        // Local-only addition for mock data
        currentStudent.skills.push({ id: skillId, skillName: skillName, proficiency: skillLevel });
        displayStudentSkills();
        document.getElementById('skillName').value = '';
        document.getElementById('skillLevel').value = '3';
        showNotification('Skill added successfully!', 'success');
        return;
    }
    
    const url = `${API_BASE_URL}/student-skills?studentId=${studentId}&skillId=${skillId}&proficiency=${skillLevel}`;
    fetch(url, {
        method: 'POST',
        headers: Object.assign({ 'Accept': 'application/json' }, getAuthHeaders())
    }).then(async resp => {
        if (!resp.ok) {
            const txt = await resp.text().catch(() => '');
            throw new Error(`Add skill failed: ${resp.status} ${resp.statusText} ${txt}`);
        }
        
        showNotification('Skill added successfully!', 'success');
        
        // Clear inputs
        document.getElementById('skillName').value = '';
        document.getElementById('skillLevel').value = '3';
        
        // Reload student skills
        try {
            await loadStudentSkills();
        } catch (err) {
            console.error('Error reloading skills:', err);
        }
    }).catch(err => {
        console.error(err);
        showNotification('Failed to add skill. See console.', 'danger');
    });
}

async function deleteStudentSkill(id) {
    console.log('Deleting skill:', id);

    try {
        const resp = await fetch(`${API_BASE_URL}/student-skills/${id}`, {
            method: 'DELETE',
            headers: Object.assign({ 'Accept': 'application/json' }, getAuthHeaders())
        });

        if (!resp.ok) throw new Error(`Delete failed: ${resp.status}`);

        showNotification('Skill removed successfully!', 'success');
        await loadStudentSkills();
    } catch (err) {
        console.error('Delete error:', err);
        showNotification('Failed to remove skill. See console.', 'danger');
    }
}

function removeSkill(studentSkillId) {
    if (!studentSkillId) {
        showNotification('Cannot remove skill: ID missing.', 'danger');
        return;
    }

    if (!API_BASE_URL) {
        // Local-only removal for mock data
        currentStudent.skills = currentStudent.skills.filter(s => s.id !== studentSkillId);
        if (currentStudent.skills) {
            renderStudentSkills(currentStudent.skills);
        }
        showNotification('Skill removed successfully!', 'success');
        return;
    }

    const url = `${API_BASE_URL}/student-skills/${studentSkillId}`;
    fetch(url, {
        method: 'DELETE',
        headers: Object.assign({ 'Accept': 'application/json' }, getAuthHeaders())
    }).then(async resp => {
        if (!resp.ok) {
            const txt = await resp.text().catch(() => '');
            throw new Error(`Delete failed: ${resp.status} ${resp.statusText} ${txt}`);
        }
        showNotification('Skill removed successfully!', 'success');
        // Fetch fresh data from API
        try {
            const updatedStudent = await fetchStudentProfile();
            if (updatedStudent) {
                currentStudent = updatedStudent;
                if (currentStudent.skills) {
                    renderStudentSkills(currentStudent.skills);
                }
            }
        } catch (err) {
            console.error('Error reloading skills:', err);
        }
    }).catch(err => {
        console.error(err);
        showNotification('Failed to remove skill. See console.', 'danger');
    });
}

function updateProfile() {
    // gather values from form selects (select `value`s are backend enum keys)
    const dept = document.getElementById('studentDepartment') ? document.getElementById('studentDepartment').value : null;
    const year = document.getElementById('studentYear') ? document.getElementById('studentYear').value : null;
    const availability = document.getElementById('availabilityStatus') ? document.getElementById('availabilityStatus').value : null;
    const githubUrl = document.getElementById('studentGithubUrl') ? document.getElementById('studentGithubUrl').value.trim() : '';
    const linkedinUrl = document.getElementById('studentLinkedinUrl') ? document.getElementById('studentLinkedinUrl').value.trim() : '';
    const portfolioUrl = document.getElementById('studentPortfolioUrl') ? document.getElementById('studentPortfolioUrl').value.trim() : '';
    const behanceUrl = document.getElementById('studentBehanceUrl') ? document.getElementById('studentBehanceUrl').value.trim() : '';

    const payload = {};
    if (dept) payload.department = dept;
    if (year) payload.academicYear = year;
    if (availability) payload.availabilityStatus = availability;
    // Include social URLs even if empty (optional fields)
    payload.githubUrl = githubUrl || null;
    payload.linkedinUrl = linkedinUrl || null;
    payload.portfolioUrl = portfolioUrl || null;
    payload.behanceUrl = behanceUrl || null;

    const studentId = currentStudent && currentStudent.id ? currentStudent.id : 1;

    if (!API_BASE_URL) {
        // update local mock
        if (payload.department) currentStudent.department = payload.department;
        if (payload.academicYear) currentStudent.year = payload.academicYear;
        if (payload.availabilityStatus) currentStudent.availabilityStatus = payload.availabilityStatus;
        showNotification('Profile updated locally (mock).', 'success');
        return;
    }

    const url = `${API_BASE_URL}/students/${studentId}`;
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
        try { loadStudentProfile(); } catch (e) {}
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

    // Map display elements to form input elements
    const formFieldMap = {
        socialGithub: 'studentGithubUrl',
        socialLinkedIn: 'studentLinkedinUrl',
        socialPortfolio: 'studentPortfolioUrl',
        socialBehance: 'studentBehanceUrl'
    };

    Object.keys(FIELDS).forEach(elId => {
        const el = document.getElementById(elId);
        const formFieldId = formFieldMap[elId];
        const formInput = formFieldId ? document.getElementById(formFieldId) : null;

        if (!el) return;
        const keys = FIELDS[elId];
        let val = null;
        for (const k of keys) {
            const v = currentStudent[k];
            if (v !== undefined && v !== null && String(v).toLowerCase() !== 'null' && String(v).trim() !== '') { val = String(v).trim(); break; }
        }
        
        // Update form input field
        if (formInput) {
            formInput.value = val || '';
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

async function fetchStudentInvitations() {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL not configured');
    }

    const storedId = localStorage.getItem('userId');
    const studentId = storedId ? parseInt(storedId, 10) : 1;
    const url = `${API_BASE_URL.replace(/\/$/, '')}/invitations/student/${studentId}`;
    
    console.log('🌐 Calling API:', url);
    
    const resp = await fetch(url, {
        method: 'GET',
        headers: Object.assign({ 'Accept': 'application/json' }, getAuthHeaders())
    });

    console.log('📊 API Response status:', resp.status);

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        const err = new Error(`Failed to fetch invitations: ${resp.status} ${resp.statusText} ${text}`);
        err.status = resp.status;
        throw err;
    }

    const data = await resp.json();
    console.log('✨ Invitations data:', data);
    return data;
}

function loadStudentInvitations() {
    console.log("🔥 loadStudentInvitations called");
    const tbody = document.getElementById('invitationsTableBody');
    
    if (!tbody) {
        console.error('❌ invitationsTableBody element not found on the page');
        return;
    }
    
    console.log('✅ invitationsTableBody found, starting to load invitations');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Loading invitations...</td></tr>';
    
    if (!API_BASE_URL) {
        console.log('⚠️ No API_BASE_URL configured, using mock data');
        // fallback to mock data if no API configured
        tbody.innerHTML = '';
        mockInvitations.forEach(invitation => {
            renderInvitationRow(tbody, invitation);
        });
        return;
    }

    console.log('📡 Fetching invitations from API:', API_BASE_URL);
    fetchStudentInvitations()
        .then(invitations => {
            console.log('📥 Invitations received:', invitations);
            tbody.innerHTML = '';
            if (!invitations || invitations.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No invitations yet</td></tr>';
                return;
            }
            invitations.forEach(invitation => {
                renderInvitationRow(tbody, invitation);
            });
        })
        .catch(err => {
            console.error('❌ Error loading invitations:', err);
            if (err.status === 401) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Please login to view invitations</td></tr>';
            } else {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--danger-color);">Failed to load invitations. See console for details.</td></tr>';
            }
        });
}

function renderInvitationRow(tbody, invitation) {
    const tr = document.createElement('tr');
    const status = invitation.status || 'PENDING';
    const statusUpper = String(status).toUpperCase();
    const badgeClass = statusUpper === 'PENDING' ? 'warning' : statusUpper === 'ACCEPTED' ? 'success' : 'rejected' === statusUpper ? 'danger' : 'secondary';
    
    const projectTitle = invitation.project?.title || 'N/A';
    const teacherName = invitation.project?.teacher?.name || 'N/A';
    const deadline = invitation.project?.deadline || 'N/A';
    
    tr.innerHTML = `
        <td>${projectTitle}</td>
        <td>${teacherName}</td>
        <td>${deadline}</td>
        <td><span class="badge badge-${badgeClass}">${status}</span></td>
        <td>
            ${statusUpper === 'PENDING' ? `
                <button class="btn btn-success btn-sm" onclick="respondToInvitation(${invitation.id}, 'ACCEPTED')">Accept</button>
                <button class="btn btn-danger btn-sm" onclick="respondToInvitation(${invitation.id}, 'REJECTED')">Reject</button>
            ` : '-'}
        </td>
    `;
    tbody.appendChild(tr);
}

async function respondToInvitation(invitationId, response) {
    if (!API_BASE_URL) {
        // fallback for mock data
        const invitation = mockInvitations.find(inv => inv.id === invitationId);
        if (invitation) {
            invitation.status = response;
            loadStudentInvitations();
            showNotification(`Invitation ${response === 'ACCEPTED' ? 'accepted' : 'rejected'}!`, 'success');
        }
        return;
    }

    const endpoint = response === 'ACCEPTED' ? 'accept' : 'reject';
    const url = `${API_BASE_URL.replace(/\/$/, '')}/invitations/${invitationId}/${endpoint}`;
    
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json', 'Accept': 'application/json' }, getAuthHeaders())
        });

        if (!resp.ok) {
            const text = await resp.text().catch(() => '');
            throw new Error(`Failed to ${endpoint} invitation: ${resp.status} ${resp.statusText} ${text}`);
        }

        showNotification(`Invitation ${response === 'ACCEPTED' ? 'accepted' : 'rejected'}!`, 'success');
        loadStudentInvitations();
    } catch (err) {
        console.error(`Error ${endpoint}ing invitation:`, err);
        showNotification(`Failed to ${response === 'ACCEPTED' ? 'accept' : 'reject'} invitation. See console.`, 'danger');
    }
}

// Teacher Dashboard Functions
async function createProject(event) {
    event.preventDefault();

    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const deadline = document.getElementById('projectDeadline').value;

    // Get required skills
    const requiredSkills = [];
    const requiredSkillIds = [];
    const skillInputs = document.querySelectorAll('.required-skill-item');
    skillInputs.forEach(item => {
        const skillSelect = item.querySelector('.skill-name-input');
        const skillId = skillSelect.value;
        const minLevel = parseInt(item.querySelector('.skill-level-input').value);
        if (skillId) {
            requiredSkillIds.push(parseInt(skillId));
            const skill = availableSkills.find(s => s.id == skillId);
            const skillName = skill ? skill.name : skillId;
            requiredSkills.push({ id: skillId, name: skillName, minLevel: minLevel });
        }
    });

    const teacherId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId'), 10) : null;

    if (!API_BASE_URL) {
        showNotification('API base URL not configured.', 'danger');
        return;
    }
    if (!teacherId) {
        showNotification('Teacher not authenticated. Please login.', 'danger');
        return;
    }

    const payload = {
        title,
        description,
        deadline: deadline || null,
        requiredSkills,
        requiredSkillIds,
        teacherId
    };

    const url = `${API_BASE_URL.replace(/\/$/, '')}/projects`;
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json', 'Accept': 'application/json' }, getAuthHeaders()),
            body: JSON.stringify(payload)
        });

        if (!resp.ok) {
            const txt = await resp.text().catch(() => '');
            console.error('Create project failed', resp.status, resp.statusText, txt);
            showNotification('Failed to create project. See console.', 'danger');
            return;
        }

        const created = await resp.json().catch(() => null);
        document.getElementById('createProjectForm').reset();
        showNotification('Project created successfully!', 'success');
        setTimeout(() => { window.location.href = 'teacher-search.html'; }, 1200);
    } catch (err) {
        console.error('Create project error', err);
        showNotification('Error creating project. See console.', 'danger');
    }
}

function addRequiredSkill() {
    const container = document.getElementById('requiredSkillsContainer');
    const skillItem = document.createElement('div');
    skillItem.className = 'required-skill-item';
    skillItem.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr auto; gap: 1rem; margin-bottom: 1rem; align-items: end;';
    
    const skillOptions = availableSkills.map(skill => 
        `<option value="${skill.id}" data-skill-name="${skill.name}">${skill.name}</option>`
    ).join('');
    
    skillItem.innerHTML = `
        <div class="form-group" style="margin: 0;">
            <label>Skill Name</label>
            <select class="skill-name-input" style="padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; font-family: inherit;">
                <option value="">-- Select a skill --</option>
                ${skillOptions}
            </select>
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
        const matchesSkill = !skillFilter || student.skills.some(s => {
            // Backend format: skillName and proficiency
            const skillName = s.skillName || '';
            return skillName.toLowerCase().includes(skillFilter);
        });
        
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
            // Backend format: skillName and proficiency
            const skillName = skill.skillName || 'Unknown';
            const proficiency = skill.proficiency || 1;
            const levels = Array.from({length: 5}, (_, i) => 
                `<span class="level-dot ${i < proficiency ? 'filled' : ''}"></span>`
            ).join('');
            return `
                <div class="skill-tag">
                    <span>${skillName}</span>
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

window.sendInvitation = async function(projectId, studentId, buttonEl) {
    alert("INVITATION SENT!");
    console.log("INVITE CLICKED", projectId, studentId);

    if (buttonEl) {
        buttonEl.disabled = true;
        buttonEl.textContent = "Sending...";
    }

    try {
        const resp = await fetch("http://localhost:8080/api/invitations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                projectId: projectId,
                studentId: studentId
            })
        });

        console.log("Response status:", resp.status);

        if (!resp.ok) {
            const text = await resp.text();
            console.error("Backend error:", text);
            throw new Error(text);
        }

        showNotification("Invitation sent successfully!", "success");

        if (buttonEl) {
            buttonEl.textContent = "Invited";
        }

    } catch (err) {
        console.error("Invite failed:", err);
        showNotification("Failed to send invitation", "danger");

        if (buttonEl) {
            buttonEl.disabled = false;
            buttonEl.textContent = "Send Invitation";
        }
    }
}

async function loadMatchedStudents(projectId) {
    const container = document.getElementById('matchedStudentsContainer');
    if (!container) return;

    container.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading matched students...</p>';

    try {
        const resp = await fetch(`${API_BASE_URL}/projects/${projectId}/matched-students`, {
            method: 'GET',
            headers: Object.assign({ 'Accept': 'application/json' }, getAuthHeaders())
        });

        if (!resp.ok) throw new Error(`Failed to fetch matched students: ${resp.status}`);

        const students = await resp.json();
        renderMatchedStudents(students, projectId);
    } catch (err) {
        console.error('Error loading matched students:', err);
        container.innerHTML = '<p style="color: var(--danger-color); padding: 2rem;">Failed to load matched students. See console.</p>';
    }
}

function renderMatchedStudents(students = [], projectId) {
    const container = document.getElementById('matchedStudentsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!Array.isArray(students) || students.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No matched students found.</p>';
        return;
    }

    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'transition: all 0.3s ease;';
        card.onmouseover = function() { this.style.boxShadow = 'var(--shadow-md)'; };
        card.onmouseout = function() { this.style.boxShadow = 'var(--shadow-sm)'; };

        const humanDept = humanizeDepartment(student.department);
        const humanYear = humanizeYear(student.academicYear);
        const humanAvailability = humanizeAvailability(student.availabilityStatus);

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1.1rem; margin-bottom: 0.5rem;">${student.name}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">${student.email}</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">${humanDept} - ${humanYear}</p>
                </div>
                <span class="${availabilityBadgeClass(student.availabilityStatus)}">
                    ${humanAvailability}
                </span>
            </div>
            <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                <button class="btn btn-primary btn-sm" onclick="viewStudentProfile(${student.id})">View Profile</button>
                <button class="btn btn-success btn-sm" onclick="sendInvitation(${projectId}, ${student.id}, this)">Send Invitation</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// Fetch teacher's projects from backend
async function fetchTeacherProjects() {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL not configured');
    }

    // Get the teacher ID from localStorage
    const storedId = localStorage.getItem('userId');
    const teacherId = storedId ? parseInt(storedId, 10) : null;
    
    if (!teacherId) {
        throw new Error('Teacher ID not found - user not logged in');
    }

    const url = `${API_BASE_URL.replace(/\/$/, '')}/projects/teacher/${teacherId}`;
    
    console.log('🌐 Fetching teacher projects from:', url);
    const authHeaders = getAuthHeaders();
    console.log('🔐 Auth headers:', Object.keys(authHeaders).length > 0 ? 'Present' : 'None');
    
    const resp = await fetch(url, {
        method: 'GET',
        headers: Object.assign({ 'Accept': 'application/json' }, authHeaders)
    });

    console.log('📊 Projects API Response status:', resp.status, resp.statusText);

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        console.error('❌ Projects fetch error:', resp.status, text);
        const err = new Error(`Failed to fetch projects: ${resp.status} ${resp.statusText} ${text}`);
        err.status = resp.status;
        throw err;
    }

    const data = await resp.json();
    console.log('✅ Projects data received:', data);
    return Array.isArray(data) ? data : data.projects || [];
}

function loadMyProjects() {
    const container = document.getElementById('myProjectsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Try to fetch from API, fall back to mock data
    (async () => {
        let projects = [];
        
        try {
            console.log('📋 Starting projects load, API_BASE_URL:', API_BASE_URL);
            if (API_BASE_URL) {
                projects = await fetchTeacherProjects();
                console.log('✅ Projects loaded successfully from API:', projects);
            } else {
                console.warn('⚠️ API_BASE_URL not configured, using mock data');
                projects = mockProjects;
            }
        } catch (err) {
            console.error('❌ Failed to load projects from API:', err.message, err);
            if (err && err.status === 401) {
                console.warn('⚠️ Unauthorized - user not logged in');
            } else {
                console.warn('⚠️ Using mock data as fallback');
            }
            projects = mockProjects;
        }

        if (!projects || projects.length === 0) {
            const noProjectsMessage = document.getElementById('noProjectsMessage');
            if (noProjectsMessage) {
                noProjectsMessage.style.display = 'block';
            }
            return;
        }

        container.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const skillsHTML = (project.requiredSkills || []).map(skill => 
                `<span class="project-skill-badge">${skill.name}</span>`
            ).join("");
            
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

        const noProjectsMessage = document.getElementById('noProjectsMessage');
        if (noProjectsMessage) {
            noProjectsMessage.style.display = 'none';
        }
    })();
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
    // Detect page context using DOM element presence
    const hasStudentName = document.getElementById('studentName');
    const hasInvitationsTable = document.getElementById('invitationsTableBody');
    const hasSearchResults = document.getElementById('searchResults');
    const hasMyProjects = document.getElementById('myProjectsContainer');
    const hasViewStudent = document.getElementById('viewStudentName');
    const hasTeacherPage = document.getElementById('teacherPage');
    const hasRequiredSkillsContainer = document.getElementById('requiredSkillsContainer');
    const hasSkillsDisplay = document.getElementById('skillsDisplay');

    if (hasInvitationsTable) {
        console.log('📧 Invitations page detected - loading data');
        loadStudentProfile();
        loadStudentInvitations();
    } else if (hasSkillsDisplay) {
        console.log('⚡ Student skills page detected - loading profile and skills');
        loadStudentProfile();
        loadAllSkills();
    } else if (hasStudentName) {
        console.log('👤 Student profile/dashboard page detected - loading profile');
        loadStudentProfile();
    } else if (hasSearchResults) {
        console.log('🔍 Teacher search page detected - loading teacher profile and displaying results');
        loadTeacherProfile();
        displaySearchResults(mockStudents);
    } else if (hasMyProjects) {
        console.log('📋 Teacher projects page detected - loading projects and teacher profile');
        loadTeacherProfile();
        loadMyProjects();
    } else if (hasViewStudent) {
        console.log('👀 Student profile view page detected - loading student data');
        loadTeacherProfile();
        loadStudentProfileView();
    } else if (hasRequiredSkillsContainer) {
        console.log('➕ Create project page detected - loading teacher profile and skills');
        loadTeacherProfile();
        loadAllSkills();
    } else if (hasTeacherPage) {
        console.log('👨‍🏫 Teacher page detected - loading teacher profile');
        loadTeacherProfile();
    }
});
