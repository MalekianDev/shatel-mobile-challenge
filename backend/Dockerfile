FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /src/app/

COPY requirements/prod.txt ${WORKDIR}
RUN pip install --upgrade pip && pip install -r prod.txt

COPY . ${WORKDIR}
