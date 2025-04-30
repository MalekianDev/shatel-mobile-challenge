# Bulk Email Service

A Django-based service for sending bulk emails using customizable templates. This service allows you to manage email templates and send bulk emails to multiple recipients using CSV files.

## Features

- **Bulk Email Sending**: Send emails to multiple recipients using CSV files
- **Email Templates**: Create and manage reusable email templates
- **Status Management**: Track email sending progress with various statuses
  - Pending
  - In Progress
  - Paused
  - Cancelled
  - Completed
- **Detailed Statistics**: Track email sending statistics including:
  - Total emails
  - Sent count
  - Duplicate count
- **CSV File Support**: Upload recipient data via CSV files
- **Pause/Resume Support**: Ability to pause and resume bulk email operations
- **User Management**: Track creators of templates and bulk email tasks

## Technical Stack

- **Framework**: Django
- **Task Queue**: Celery
- **Data Processing**: Pandas (for CSV handling)
- **Database**: Django ORM (supports multiple databases)

## Models

### MailTemplate
- Name
- Body (supports dynamic variables)
- Creation/Update timestamps
- Creator reference

### MailBulk
- Subject
- Status tracking
- CSV file upload
- Template reference
- Creation/Update timestamps
- Creator reference

### MailBulkDetail
- Total count
- Sent count
- Duplicate count
- Reference to parent MailBulk

## CSV File Format
The system expects CSV files with the following columns:
- `email`: Recipient email address
- `national_id`: National ID of the recipient

## Template Variables
Email templates support the following variables:
- `{{ email }}`: Recipient's email address
- `{{ national_id }}`: Recipient's national ID

## Status Management Rules
1. New bulk emails can only be created with 'pending' status
2. Users can only update status to:
   - In Progress
   - Cancelled
   - Paused
3. Cannot update completed bulk emails
4. Cannot update template if it has pending, paused, or in-progress bulk emails
5. Cannot update CSV file after creation

## Installation & Setup

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements/all.txt
```
3. Copy the secrets.example.env to secrets.env:
```bash
cp secrets.example.env secrets.env
```
Then replace your own configs in secrets.env
4. Run migrations:
```bash
python manage.py migrate
```
5. Create default user:
```bash
python manage.py create_default_user
```
7. Load fixtures:
```bash
python manage.py loaddata mail_template.json
```
8. Start celery:
```bash
celery -A your_project_name worker -l info
```
9. Finally run the project:
```bash
python manage.py runserver
```

## Development

### API Documentation
The project uses `drf-spectacular` for automatic API documentation:
- Swagger UI: `/api/schema/swagger-ui/`
- ReDoc: `/api/schema/redoc/`
- OpenAPI Schema: `/api/schema/`

### Authentication
For development convenience, the following authentication methods are enabled in DEBUG mode:
- JWT Authentication (default)
- Basic Authentication (development only)
- Session Authentication (development only)

### Code Quality
The project uses pre-commit hooks for code quality. To set up:
```bash
pre-commit install
```

Pre-commit configuration includes:

- Black (Python code formatting)
- Flake8 (Python code linting)
- isort (Python import sorting)
- trailing-whitespace
- end-of-file-fixer
- check-yaml
- check-added-large-files
- Run Django Check


## Security Features
- JWT authentication
- Protected foreign keys (using on_delete=models.PROTECT )
- CSV file validation
- Status transition validation
- Email uniqueness validation
## Error Handling
- Comprehensive validation for status transitions
- File upload validation
- Template update restrictions
- Bulk email update restrictions
## Performance Considerations
- Chunk-based CSV processing (50 records per chunk)
- Efficient database queries using select_related and prefetch_related
