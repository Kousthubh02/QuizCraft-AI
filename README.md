# beyondchats - server

Django REST Framework backend for BeyondChats.

Setup (Windows, cmd.exe):

1. Create and activate a virtualenv:

```
python -m venv .venv
.venv\Scripts\activate
```

2. Install requirements:

```
pip install -r requirements.txt
```

3. Run migrations and start:

```
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API endpoints (examples):
- /api/pdfs/
- /api/quizzes/
- /api/attempts/
