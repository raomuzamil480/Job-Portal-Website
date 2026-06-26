# JobHunt — Job Portal (React + Django)

## Features
- **Employer**: Post jobs, Edit/Delete, View & manage applications, Update applicant status
- **Job Seeker**: Browse jobs, Search & filter, Apply with cover letter, Track application status
- **Role-based auth**: Employer vs Job Seeker signup
- **Admin panel**: Full control over jobs, applications, users

---

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py makemigrations jobs
python manage.py migrate
python manage.py createsuperuser
python seed_data.py
python manage.py runserver
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Test Accounts (from seed_data.py)
- **Employer**: techcorp / password123
- **Employer**: designhub / password123
- Create your own seeker account via Signup

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register/ | Sign up (with role) |
| POST | /api/login/ | Login |
| GET | /api/profile/ | Get my profile |
| GET | /api/jobs/ | All jobs (filters: category, job_type, experience, search) |
| POST | /api/jobs/ | Post new job (employer only) |
| POST | /api/jobs/{id}/apply/ | Apply to job (seeker only) |
| GET | /api/jobs/{id}/applications/ | View applicants (employer only) |
| GET | /api/jobs/my_jobs/ | My posted jobs |
| GET | /api/my-applications/ | My applications (seeker) |
| PATCH | /api/applications/{id}/status/ | Update application status |
