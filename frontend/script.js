// Mock Data
const mockStudents = [
    {
        id: 1,
        name: "Hardik Verma",
        email: "hardik@example.com",
        department: "BCA",
        year: "VI Semester",
        availabilityStatus: "Available",
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
        year: "VI Semester",
        availabilityStatus: "Available",
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
        year: "IV Semester",
        availabilityStatus: "Busy",
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
        year: "II Semester",
        availabilityStatus: "Available",
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
        year: "VI Semester",
        availabilityStatus: "Open to Work",
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

// Current user role
let currentUserRole = 'student';
let currentStudent = mockStudents[0];

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

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in production, this would be API call)
    if (email && password) {
        closeLoginModal();
        if (currentUserRole === 'student') {
            window.location.href = 'student-dashboard.html';
        } else {
            window.location.href = 'teacher-dashboard.html';
        }
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
function loadStudentProfile() {
    if (!currentStudent) return;
    
    document.getElementById('studentName').textContent = currentStudent.name;
    document.getElementById('studentEmail').textContent = currentStudent.email;
    document.getElementById('studentDepartment').textContent = currentStudent.department;
    document.getElementById('studentYear').textContent = currentStudent.year;
    
    const statusSelect = document.getElementById('availabilityStatus');
    if (statusSelect) {
        statusSelect.value = currentStudent.availabilityStatus;
    }
    
    displayStudentSkills();
}

function displayStudentSkills() {
    const container = document.getElementById('skillsDisplay');
    if (!container) return;
    
    container.innerHTML = '';
    
    currentStudent.skills.forEach(skill => {
        const skillTag = createSkillTag(skill, true);
        container.appendChild(skillTag);
    });
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
    currentStudent.department = document.getElementById('studentDepartment').value;
    currentStudent.year = document.getElementById('studentYear').value;
    currentStudent.availabilityStatus = document.getElementById('availabilityStatus').value;
    
    showNotification('Profile updated successfully!', 'success');
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
        
        const skillsHTML = student.skills.map(skill => {
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
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1.25rem; margin-bottom: 0.5rem;">${student.name}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">${student.email}</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">${student.department} - ${student.year}</p>
                </div>
                <span class="badge badge-${student.availabilityStatus === 'Available' ? 'success' : student.availabilityStatus === 'Busy' ? 'warning' : 'info'}">
                    ${student.availabilityStatus}
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

function loadStudentProfileView() {
    const studentId = parseInt(localStorage.getItem('viewStudentId'));
    const student = mockStudents.find(s => s.id === studentId);
    
    if (!student) {
        document.body.innerHTML = '<p>Student not found</p>';
        return;
    }
    
    document.getElementById('viewStudentName').textContent = student.name;
    document.getElementById('viewStudentEmail').textContent = student.email;
    document.getElementById('viewStudentDepartment').textContent = student.department;
    document.getElementById('viewStudentYear').textContent = student.year;
    
    const statusBadge = document.getElementById('viewStudentStatus');
    statusBadge.textContent = student.availabilityStatus;
    statusBadge.className = `badge badge-${student.availabilityStatus === 'Available' ? 'success' : student.availabilityStatus === 'Busy' ? 'warning' : 'info'}`;
    
    const skillsContainer = document.getElementById('viewStudentSkills');
    skillsContainer.innerHTML = '';
    
    student.skills.forEach(skill => {
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

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    if (path.includes('student-dashboard.html')) {
        loadStudentProfile();
    } else if (path.includes('student-invitations.html')) {
        loadStudentInvitations();
    } else if (path.includes('teacher-search.html')) {
        displaySearchResults(mockStudents);
    } else if (path.includes('teacher-projects.html')) {
        loadMyProjects();
    } else if (path.includes('student-profile-view.html')) {
        loadStudentProfileView();
    }
});
