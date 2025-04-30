def send_email(to, subject, body):
    """
    Simple example function instead of "django.core.mail.send_mail" for simplicity.
    Mentioned in document:
    Please note that the implementation of the "send email" functionality is not required for this challenge.
    """
    print(f"Email sent to {to} with subject {subject} and message {body}")


def count_csv_rows(path: str):
    with open(path, "r", encoding="utf-8") as file:
        return sum(1 for _ in file) - 1
