# Student Skills Management System (SSMS) - Frontend

A complete, professional frontend implementation for the Student Skills Management System college project.

## 🎯 Project Overview

This is a web-based platform designed to systematically collect, organize, and manage students' skills within an academic institution. The system helps teachers find suitable students for projects based on their skill profiles.

## 📁 Files Included

### Main Pages
- **index.html** - Landing page with login functionality
- **styles.css** - Complete styling system with professional design
- **script.js** - All JavaScript functionality and mock data

### Student Pages
- **student-dashboard.html** - Student overview dashboard
- **student-profile.html** - Profile management page
- **student-skills.html** - Skills addition and management
- **student-invitations.html** - Project invitations management

### Teacher Pages
- **teacher-dashboard.html** - Teacher overview dashboard
- **teacher-create-project.html** - Create new projects with requirements
- **teacher-search.html** - Search and filter students
- **teacher-projects.html** - View and manage all projects
- **student-profile-view.html** - View detailed student profiles

## 🚀 How to Use

1. **Open the project**: Simply open `index.html` in your web browser
2. **Login**: 
   - Click "Student Login" or "Teacher Login"
   - Enter any email and password (no validation for demo)
3. **Navigate**: Use the sidebar menu to explore different features

### Demo Credentials
Since this is a frontend demo with mock data, you can use any email/password combination.

**Sample Student Login:**
- Email: hardik@example.com
- Password: anything

**Sample Teacher Login:**
- Email: teacher@example.com
- Password: anything

## ✨ Features Implemented

### For Students:
- ✅ Dashboard with stats overview
- ✅ Profile management (department, year, availability)
- ✅ Skills management with proficiency levels (1-5)
- ✅ View and respond to project invitations
- ✅ Skill suggestions and guides

### For Teachers:
- ✅ Dashboard with project overview
- ✅ Create projects with skill requirements
- ✅ Advanced student search with multiple filters
- ✅ View detailed student profiles
- ✅ Send project invitations
- ✅ Skill matching and analysis

## 🎨 Design Features

- **Professional Blue Theme** - Clean, corporate color scheme
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Subtle transitions and hover effects
- **Intuitive Navigation** - Clear sidebar menu and breadcrumbs
- **Visual Hierarchy** - Well-organized information architecture
- **Accessibility** - Proper contrast ratios and readable fonts

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **JavaScript (Vanilla)** - No frameworks required
- **Google Fonts** - Montserrat & Inter font families

## 📊 Mock Data

The system includes mock data for demonstration:
- 5 sample students with various skills
- 2 sample projects
- Sample invitations with different statuses

## 🔗 Integration with Backend

This frontend is designed to work with your friend's backend. Here's what needs to be connected:

### API Endpoints Needed:

**Authentication:**
- POST `/api/login` - Login
- POST `/api/logout` - Logout

**Student APIs:**
- GET `/api/student/profile` - Get student profile
- PUT `/api/student/profile` - Update profile
- GET `/api/student/skills` - Get student skills
- POST `/api/student/skills` - Add skill
- DELETE `/api/student/skills/:id` - Remove skill
- GET `/api/student/invitations` - Get invitations
- PUT `/api/student/invitations/:id` - Accept/Reject invitation

**Teacher APIs:**
- GET `/api/teacher/projects` - Get all projects
- POST `/api/teacher/projects` - Create project
- GET `/api/teacher/students/search` - Search students with filters
- GET `/api/teacher/students/:id` - Get student details
- POST `/api/teacher/invitations` - Send invitation

### Integration Steps:

1. Replace mock data in `script.js` with actual API calls
2. Use `fetch()` or `axios` for HTTP requests
3. Add loading states and error handling
4. Implement proper authentication token storage
5. Add form validation on submission

## 📝 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #0ea5e9;
    /* ... other colors */
}
```

### Fonts
Change fonts in the `<head>` section of HTML files

### Logo
Replace the SVG logo in the sidebar with your college logo

## 📱 Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

## 🐛 Known Limitations

- No real authentication (uses mock login)
- Data doesn't persist (stored in JavaScript variables)
- No real-time updates
- File uploads not implemented (resume/portfolio)
- Password recovery is placeholder only

## 🔜 Future Enhancements (As per Synopsis)

- AI-assisted shortlisting module
- Real-time notifications
- Resume/Portfolio uploads
- Advanced analytics dashboard
- Email notifications
- Message system between teachers and students

## 👥 Team

- Hardik Verma (23C01071)
- Mayank (23C01103)

**Guide:** Mr. Nasrulla Khan

**Department:** Computer Applications, VI Semester BCA

## 📄 License

This is a college project for educational purposes.

## 💡 Tips for Presentation

1. Start with the landing page
2. Demonstrate student flow: Login → Profile → Add Skills → View Invitations
3. Demonstrate teacher flow: Login → Create Project → Search Students → Send Invitation
4. Highlight the skill matching and filtering features
5. Show the responsive design on different screen sizes

## 🆘 Support

For any issues or questions:
1. Check the console for JavaScript errors
2. Ensure all files are in the same directory
3. Use a modern browser (Chrome, Firefox, Edge)
4. Clear browser cache if styling looks wrong

---

**Note:** This is a frontend prototype with mock data. Connect it with your backend for full functionality!
