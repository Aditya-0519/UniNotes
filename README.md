# UniNotes

> **A collaborative learning platform where college students can share, discover, and access academic resources.**

UniNotes is a full-stack web application designed to make academic resources easier to discover and share. Instead of students searching through WhatsApp groups, personal contacts, and scattered Google Drive links, UniNotes provides a centralized platform where students can contribute and explore study materials from different institutions.

The platform combines resource discovery with a community-driven contribution system, allowing students to upload notes, discover resources, interact with contributors, and build a stronger academic community.

---

## 🚀 Live Demo

🌐 **Live Application:** https://uninotes-qj6p.onrender.com/

💻 **GitHub Repository:** https://github.com/Aditya-0519/UniNotes

---

## 📌 The Problem

Finding good academic resources can be unnecessarily difficult.

Students often rely on:

- WhatsApp groups
- Personal contacts
- Random Google Drive links
- Telegram channels
- Scattered files from seniors or classmates

Even when resources are available, students may not know:

- Whether the material is relevant
- Who uploaded it
- Which institution or subject it belongs to
- Whether better resources already exist

UniNotes aims to provide a centralized and structured platform where students can discover and contribute academic resources.

---

## ✨ Features

### 📚 Resource Discovery

- Browse academic notes and study resources
- Search resources using relevant keywords
- View resources organized around academic and institutional information
- Explore contributions from different students and institutions
- Access resource details before reading or downloading

### 📤 Student Contributions

Students can contribute academic resources to the platform.

Each contribution is associated with relevant academic information, making resources easier for other students to discover.

### 🔐 Authentication & Authorization

- Local authentication using email and password
- Secure password hashing with `bcryptjs`
- Google OAuth authentication
- Session-based authentication
- Role-based access control for protected functionality

### 👤 User System

- User registration and login
- User profiles
- Contributor identity displayed with contributions
- Authentication-protected actions
- Personalized user experience

### 🏫 Institution Management

UniNotes includes an institution-based structure that allows academic resources to be associated with relevant colleges or institutions.

The platform also includes functionality for institution requests and administrative management.

### 🏆 Community & Gamification

- Contributor points
- Leaderboard
- Recognition for student contributions
- Community-driven academic sharing

### 💬 Community Interaction

- Comments on contributions
- Interaction around shared academic resources
- Student-to-student collaboration

### 📑 PDF Support

- PDF resource uploads
- Cloud-based file storage
- PDF handling using PDF.js
- Browser-based PDF viewing

### 📱 Progressive Web App (PWA)

UniNotes is installable as a Progressive Web App on supported browsers and devices.

The PWA provides an app-like experience while using the existing web application.

- Web App Manifest
- Standalone app installation
- Dedicated UniNotes application identity
- UniNotes-branded application icons
- 192×192 application icon
- 512×512 application icon
- Maskable 512×512 Android icon
- Responsive mobile-friendly experience
- Service Worker integration

### 🔔 Push Notifications

UniNotes supports browser-based push notifications for user updates and platform activity.

- Web Push API integration
- Service Worker-based notification handling
- VAPID-based push authentication
- User push subscriptions
- Push notification delivery
- Notification click handling
- Deep linking from notifications
- UniNotes-branded notification icon
- Android-compatible notification support

### 🛡️ Administration

- Administrative routes
- Management of platform content
- Institution-related administration
- Controlled access to administrative functionality

---

# 🛠️ Tech Stack

## Backend

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime |
| Express.js | Web application framework |
| EJS | Server-side rendering and templating |
| Express EJS Layouts | Shared application layouts |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |

## Authentication & Security

| Technology | Purpose |
| --- | --- |
| Passport.js | Authentication middleware |
| Passport Local | Local email/password authentication |
| Google OAuth 2.0 | Google authentication |
| bcryptjs | Password hashing |
| express-session | Session management |
| connect-mongo | Persistent MongoDB session storage |
| dotenv | Environment variable management |

## File Storage & PDFs

| Technology | Purpose |
| --- | --- |
| Multer | File upload handling |
| Cloudinary | Cloud-based media storage |
| multer-storage-cloudinary | Multer and Cloudinary integration |
| PDF.js | PDF processing and rendering support |

## Progressive Web App & Notifications

| Technology | Purpose |
| --- | --- |
| Web App Manifest | PWA identity and installation metadata |
| Service Worker | Background processing and push notification handling |
| Web Push API | Browser push notification delivery |
| VAPID | Secure push notification authentication |
| Push API | User push subscription management |

## Additional Tools

| Technology | Purpose |
| --- | --- |
| connect-flash | Flash messages |
| method-override | Support for additional HTTP methods |

---

# 🏗️ Architecture

UniNotes follows a structured backend architecture that separates responsibilities into different layers.

```text
Client
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Models / Database Operations
   │
   ▼
MongoDB
```

The project separates application concerns into dedicated directories for:

- Configuration
- Controllers
- Middleware
- Models
- Routes
- Utilities
- Views
- Public assets

This structure helps keep the application maintainable as the project grows.

---

# 📁 Project Structure

```text
UniNotes/
│
├── config/
│   └── Application configuration
│
├── controllers/
│   ├── Authentication logic
│   ├── Contribution logic
│   ├── Institution logic
│   ├── User logic
│   └── Administrative logic
│
├── middleware/
│   └── Authentication and request middleware
│
├── models/
│   ├── User
│   ├── Contribution
│   ├── Comment
│   ├── Institution
│   └── InstitutionRequest
│
├── routes/
│   ├── auth.js
│   ├── contributions.js
│   ├── institutions.js
│   ├── institutionRequests.js
│   ├── users.js
│   └── admin.js
│
├── services/
│   └── Notification and application services
│
├── utils/
│   └── Helper utilities
│
├── views/
│   ├── EJS templates
│   ├── Pages
│   └── Layouts
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   ├── icon-maskable-512.png
│   │   └── uninotes_logo.png
│   ├── manifest.json
│   └── sw.js
│
├── app.js
├── seed.js
├── package.json
└── .gitignore
```

---

# 🔔 Push Notification Architecture

UniNotes uses the Web Push API and a Service Worker to deliver notifications to users.

```text
User
 │
 ▼
UniNotes Application
 │
 ▼
Push Subscription
 │
 ▼
Notification Service
 │
 ▼
Web Push / VAPID
 │
 ▼
Browser Push Service
 │
 ▼
Service Worker
 │
 ▼
Notification
 │
 ▼
User
```

The Service Worker receives push events and displays notifications using the UniNotes application icon.

Notification clicks can also redirect users to the relevant UniNotes page.

---

# 📱 PWA Architecture

UniNotes uses a Web App Manifest and Service Worker to provide an installable app-like experience.

```text
User
 │
 ▼
UniNotes Web Application
 │
 ├───────────────┐
 ▼               ▼
Manifest       Service Worker
 │               │
 ▼               ▼
PWA Identity   Push Notifications
 │               │
 ▼               ▼
App Installation
 │
 ▼
UniNotes App
```

The PWA uses dedicated application icons designed for different device requirements, including a maskable icon for Android.

---

# 🔐 Authentication Flow

UniNotes supports multiple authentication methods.

## Local Authentication

```text
User Registration
       │
       ▼
Password Hashing
       │
       ▼
User Stored in MongoDB
       │
       ▼
User Login
       │
       ▼
Session Created
       │
       ▼
Authenticated User
```

Passwords are securely hashed using `bcryptjs` before being stored.

## Google Authentication

```text
User
 │
 ▼
Google OAuth
 │
 ▼
Passport.js
 │
 ▼
Create / Find User
 │
 ▼
Session Created
```

---

# ☁️ File Upload Flow

Academic resources can be uploaded and stored using cloud-based storage.

```text
Student
   │
   ▼
Upload Resource
   │
   ▼
Multer
   │
   ▼
Cloudinary
   │
   ▼
Resource URL
   │
   ▼
Contribution Stored in MongoDB
```

This approach keeps uploaded files separate from the application server and allows resources to be accessed through cloud storage.

---

# 🗄️ Database

MongoDB is used as the primary database.

The main application entities include:

```text
User
│
├── Contributions
├── Comments
└── Authentication Data

Institution
│
└── Academic Resources

Contribution
│
├── Contributor
├── Resource Information
├── Institution Information
└── Community Interaction

Comment
│
├── User
└── Contribution

Institution Request
│
└── Requested Institution Information
```

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Aditya-0519/UniNotes.git
```

## 2. Navigate to the Project

```bash
cd UniNotes
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Create Environment Variables

Create a `.env` file in the root directory.

Example:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

VAPID_PUBLIC_KEY=your_vapid_public_key

VAPID_PRIVATE_KEY=your_vapid_private_key

VAPID_SUBJECT=mailto:your_email@example.com
```

> Never commit your `.env` file or expose credentials in a public repository.

## 5. Start the Application

Run the application using the appropriate command configured for your local environment.

The application will then be available locally.

---

# 🚀 Deployment

UniNotes is currently deployed and accessible online.

🌐 **Live Application:**

https://uninotes-qj6p.onrender.com/

The application uses cloud services for important infrastructure components such as:

- Application hosting
- Database connectivity
- Session persistence
- File and media storage

The application is deployed through Render and connected to the GitHub repository for source control and deployment.

---

# 📱 Installing UniNotes

On supported browsers and devices, UniNotes can be installed as an application.

After installation:

- UniNotes appears as an installed application
- The application uses the UniNotes PWA identity
- The dedicated UniNotes logo is used as the application icon
- The application can launch in a standalone app-like experience
- Push notifications can be supported through the Service Worker

---

# 🎯 Why UniNotes?

UniNotes is not intended to be just another collection of PDF files.

The goal is to create a structured academic resource ecosystem where students can:

```text
Discover
   ↓
Learn
   ↓
Contribute
   ↓
Interact
   ↓
Build Reputation
```

By combining academic resources, contributors, institutions, search, authentication, cloud storage, PWA capabilities, push notifications, and community features, UniNotes aims to make academic collaboration easier for students.

---

# 🔮 Future Improvements

Potential future improvements include:

- Advanced filtering and search
- Resource ratings and reviews
- Improved recommendation systems
- Trusted contributor badges
- Contribution moderation workflows
- Improved profile customization
- Analytics for contributors
- Native mobile application
- Expanded institution and academic categorization
- Improved scalability and caching
- Offline-first resource access
- More advanced notification preferences

---

# 🤝 Contributing

Contributions, ideas, and feedback are welcome.

If you would like to contribute:

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "feat: add your feature"
```

4. Push your branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

# 📄 License

This project is currently licensed under the ISC License.

---

# 👨‍💻 Author

**Aditya Singh**

Built as a full-stack collaborative learning platform focused on making academic resources easier for students to discover, share, and access.

⭐ If you find this project interesting, consider giving the repository a star!