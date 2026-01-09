

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

## AI Powered Features

Auto-Breakdown: Users can input a vague goal like "Learn Python", and the AI Backend will generate specific sub-tasks via API.

Smart Suggestions: Content-aware task descriptions.

Security Angle: This module will also serve as a lab for Prompt Injection attacks (Tricking the AI into revealing system instructions).

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

- AI: GROQ API

- Database: SQLite (Default)

- Frontend: HTML5, CSS3, JavaScript (ES6+)

- Tools: Postman (for API testing), Burp Suite (for vulnerability scanning)

---

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/egeturediCode/sv-todo.git
    cd svTodo
    ```

2. Create and activate a virtual environment:
    ```bash
    python3 -m venv env
    source env/bin/activate  # Mac/Linux
    venv\Scripts\activate.bat # Windows
    ```

3. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Run the code to create secret_key:
    ```bash
    python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
    ```
    Chenge the key on settings.py. SECRET_KEY = config('DJANGO_SECRET_KEY') = SECRET_KEY = 'new_key'

5. To create an admin user:
    ```bash
    python3 manage.py createsuperuser
    ```

6. Apply database migrations:
    ```bash
    cd svTodo
    python3 manage.py makemigrations
    python3 manage.py migrate
    ```

7. Run the development server:
    ```bash
    python3 manage.py runserver
    ```

8. Open your browser and go to `http://127.0.0.1:8000/admin`.

---

##  Licence
DO NOT USE THIS CODE IN PRODUCTION!

This application contains intentional security flaws (SQL Injection, etc.) for educational purposes. Running this code on a public server exposes it to attacks. Use it only in a safe, local environment.

## Contact

If you have any questions or suggestions, feel free to reach out:  
[GitHub Profile](https://github.com/egeturediCode)

---