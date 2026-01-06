🛠️ Service Management System

A full-stack Service Management System developed as a capstone project to manage service requests, technician assignments, invoicing, and payments using a role-based architecture.

The system is built with ASP.NET Core Web API, Angular, and SQL Server, and follows clean architecture, proper database normalization, and secure JWT-based authentication.

📂 Project Structure
Service-Management-System/
│
├── ServiceManagementApis/          # ASP.NET Core Web API (Backend)
├── ServiceManagementApis.Tests/    # Unit & integration tests
├── service-management-ui/          # Angular frontend application
├── Deliverables/                   # Project report, diagrams, screenshots
├── .github/                        # GitHub workflows / configs
├── .gitignore
└── README.md

🧱 Tech Stack
Backend

ASP.NET Core Web API (.NET 8)

Entity Framework Core

SQL Server

JWT Authentication

Frontend

Angular (v16+)

Angular Material

TypeScript

RxJS

Tools

Visual Studio 2022

Visual Studio Code

Git & GitHub

Postman

⚙️ Setup Instructions
1️⃣ Prerequisites

Windows 10 / 11

.NET SDK 8+

Node.js (LTS)

Angular CLI

SQL Server

Git

2️⃣ Backend Setup
cd ServiceManagementApis


Update appsettings.json:

"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=ServiceManagementDB;Trusted_Connection=True;TrustServerCertificate=True"
}


Apply migrations:

dotnet ef database update


Run backend:

dotnet run


Backend URL:

http://localhost:5133

3️⃣ Frontend Setup
cd service-management-ui
npm install


Update API base URL in:

src/environments/environment.ts

apiBaseUrl: 'http://localhost:5133/api'


Run frontend:

ng serve


Frontend URL:

http://localhost:4200

🧪 Testing

Backend API tested using Postman

Unit tests in ServiceManagementApis.Tests

Role-based route protection verified

End-to-end service lifecycle tested

🗃️ Database Design

Normalized up to 3NF

Single Users table with role mapping

Strong primary–foreign key relationships

DateOnly used where time is not required

📦 Deliverables Folder

The Deliverables/ directory contains:

Project report

ER diagrams

Database schema

Screenshots

Presentation material

🚀 Future Enhancements

Email & notification system

Real-time updates using SignalR

Cloud deployment (Azure / AWS)

Advanced analytics dashboard

Mobile responsiveness

📄 License

This project is developed as part of an academic capstone project and is intended for educational purposes only.

👩‍💻 Author

Shreeya Pathak
