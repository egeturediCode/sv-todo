

# Smart & Vulnerable To-Do App

> **A Full-Stack Django Laboratory for Backend Development & Cybersecurity.**

![Python](https://img.shields.io/badge/Python-3.x-blue?style=flat&logo=python)
![Django](https://img.shields.io/badge/Django-6.x-green?style=flat&logo=django)
![DRF](https://img.shields.io/badge/API-Django%20REST%20Framework-red)
![Security](https://img.shields.io/badge/Status-Intentionally%20Vulnerable-orange)

## About The Project

This project is not just a simple Task Manager. It is an educational sandbox designed to bridge the gap between **Software Engineering** and **Cybersecurity (Red Teaming)**.

The application follows a **Decoupled Architecture**:
* **Backend:** Built with Django & Django REST Framework (DRF), serving as a pure API.
* **Frontend:** Built with Vanilla JavaScript & HTML5, consuming the API via `fetch`.

**The twist?** While some parts follow industry best practices (ORM, Serializers), specific modules contain **intentional security vulnerabilities** (like SQL Injection) to demonstrate how attacks occur and how to patch them.

---

## Architecture

The project simulates a modern web application structure where the frontend and backend are separated logically.

```text
SmartTodo/
│
├── api/                  # BACKEND (The Kitchen)
│   ├── models.py         # Database Schemas (Task, User)
│   ├── serializers.py    # JSON Parsers
│   ├── views.py          # Business Logic & Vulnerable Code
│   └── urls.py           # API Endpoints
│
├── main/                 # FRONTEND (The Dining Area)
│   ├── templates/        # HTML Files (Login, Home)
│   └── views.py          # HTML Server
│
└── manage.py             # Django Utility

```
---

## Security Laboratory (Vulnerabilities)

The project serves as a practice target (CTF style) for identifying and exploiting web vulnerabilities.

### 1- SQL Injection (SQLi)

- **Location:** `/api/search/`
- **Method:** `GET
**The Flaw** The search function uses Raw SQL with Python f-strings instead of the Django ORM. Input sanitization is skipped.
**Attack Vector**
- Normal: 
```text
?query=Test
```
- Exploit:(Dumps the entire database).
```text
?query=' OR '1'='1
```

---

### 2- Broken Authentication / Session Management

- **Location:** `/api/login/`

- **The Lesson**: Implements a custom login flow to demonstrate how HttpOnly cookies and Session IDs work manually, rather than relying solely on Django's built-in forms.

---

### 3- IDOR (Insecure Direct Object References) [Planned]

- **Goal:** Simulating a scenario where User A can read/delete User B's tasks by manipulating the ID in the API call.

---

## Tech Stack
- Language: Python 3

- Framework: Django 6

- API: Django REST Framework (DRF)

- Database: SQLite (Default)

- Frontend: HTML5, CSS3, JavaScript (ES6+)

- Tools: Postman (for API testing), Burp Suite (for vulnerability scanning)

---

##  Licence
DO NOT USE THIS CODE IN PRODUCTION!

This application contains intentional security flaws (SQL Injection, etc.) for educational purposes. Running this code on a public server exposes it to attacks. Use it only in a safe, local environment.