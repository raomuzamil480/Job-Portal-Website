import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_project.settings')
django.setup()

from django.contrib.auth.models import User
from jobs.models import Profile, Category, Job

categories = [
    {'name': 'Software Engineering', 'slug': 'software-engineering'},
    {'name': 'Design & Creative', 'slug': 'design-creative'},
    {'name': 'Marketing', 'slug': 'marketing'},
    {'name': 'Data Science', 'slug': 'data-science'},
    {'name': 'Finance', 'slug': 'finance'},
    {'name': 'Human Resources', 'slug': 'human-resources'},
    {'name': 'Customer Support', 'slug': 'customer-support'},
    {'name': 'Sales', 'slug': 'sales'},
]
for c in categories:
    Category.objects.get_or_create(slug=c['slug'], defaults={'name': c['name']})

# Sample employer
if not User.objects.filter(username='techcorp').exists():
    user = User.objects.create_user('techcorp', 'techcorp@example.com', 'password123')
    Profile.objects.create(user=user, role='employer', company_name='TechCorp Inc.', location='New York, USA')

if not User.objects.filter(username='designhub').exists():
    user = User.objects.create_user('designhub', 'design@example.com', 'password123')
    Profile.objects.create(user=user, role='employer', company_name='DesignHub', location='San Francisco, USA')

employer1 = User.objects.get(username='techcorp')
employer2 = User.objects.get(username='designhub')
se = Category.objects.get(slug='software-engineering')
ds = Category.objects.get(slug='data-science')
design = Category.objects.get(slug='design-creative')
mkt = Category.objects.get(slug='marketing')

sample_jobs = [
    {
        'employer': employer1, 'category': se, 'title': 'Senior React Developer',
        'company': 'TechCorp Inc.', 'location': 'New York, USA', 'job_type': 'full-time',
        'experience': 'senior', 'salary_min': 90000, 'salary_max': 130000,
        'description': 'We are looking for a Senior React Developer to join our growing team. You will be responsible for building scalable and performant web applications.',
        'requirements': '5+ years of React experience\nStrong knowledge of JavaScript/TypeScript\nExperience with REST APIs and state management (Redux/Zustand)',
        'skills_required': 'React, TypeScript, Redux, Node.js, REST API',
    },
    {
        'employer': employer1, 'category': se, 'title': 'Django Backend Engineer',
        'company': 'TechCorp Inc.', 'location': 'Remote', 'job_type': 'remote',
        'experience': 'mid', 'salary_min': 70000, 'salary_max': 100000,
        'description': 'Join our backend team to build robust REST APIs using Django and Django REST Framework.',
        'requirements': '3+ years of Django experience\nKnowledge of PostgreSQL\nExperience with Docker and CI/CD',
        'skills_required': 'Python, Django, DRF, PostgreSQL, Docker',
    },
    {
        'employer': employer1, 'category': ds, 'title': 'Data Scientist',
        'company': 'TechCorp Inc.', 'location': 'Chicago, USA', 'job_type': 'full-time',
        'experience': 'mid', 'salary_min': 85000, 'salary_max': 115000,
        'description': 'Analyze large datasets and build ML models to drive business decisions.',
        'requirements': '3+ years in data science\nExperience with Python, Pandas, Sklearn\nKnowledge of SQL and data visualization',
        'skills_required': 'Python, Machine Learning, Pandas, SQL, TensorFlow',
    },
    {
        'employer': employer2, 'category': design, 'title': 'UI/UX Designer',
        'company': 'DesignHub', 'location': 'San Francisco, USA', 'job_type': 'full-time',
        'experience': 'junior', 'salary_min': 60000, 'salary_max': 80000,
        'description': 'Create beautiful and intuitive user interfaces for our clients across multiple industries.',
        'requirements': '1-3 years of UI/UX experience\nProficiency in Figma\nPortfolio required',
        'skills_required': 'Figma, Adobe XD, Prototyping, User Research, CSS',
    },
    {
        'employer': employer2, 'category': mkt, 'title': 'Digital Marketing Manager',
        'company': 'DesignHub', 'location': 'Remote', 'job_type': 'remote',
        'experience': 'mid', 'salary_min': 55000, 'salary_max': 75000,
        'description': 'Lead our digital marketing strategy including SEO, social media, and paid campaigns.',
        'requirements': '3+ years in digital marketing\nExperience with Google Ads and Meta Ads\nStrong analytical skills',
        'skills_required': 'SEO, Google Ads, Social Media, Analytics, Content Marketing',
    },
    {
        'employer': employer1, 'category': se, 'title': 'Junior Frontend Developer',
        'company': 'TechCorp Inc.', 'location': 'Austin, USA', 'job_type': 'full-time',
        'experience': 'entry', 'salary_min': 45000, 'salary_max': 60000,
        'description': 'Great opportunity for fresh graduates or developers with 0-1 year experience to start their career.',
        'requirements': 'Basic knowledge of HTML, CSS, JavaScript\nFamiliarity with React is a plus',
        'skills_required': 'HTML, CSS, JavaScript, React (basic)',
    },
    {
        'employer': employer2, 'category': design, 'title': 'Graphic Designer (Internship)',
        'company': 'DesignHub', 'location': 'Remote', 'job_type': 'internship',
        'experience': 'entry', 'salary_min': 1500, 'salary_max': 2500,
        'description': '3-month internship program with mentorship from senior designers.',
        'requirements': 'Currently enrolled in design/art program\nBasic Adobe Suite knowledge',
        'skills_required': 'Photoshop, Illustrator, Creativity',
    },
]

for j in sample_jobs:
    Job.objects.get_or_create(title=j['title'], company=j['company'], defaults=j)

print("✅ Seed data added! Categories, employers, and sample jobs are ready.")
print("   Employer accounts: techcorp / designhub (password: password123)")
