# Dockerfile for FastAPI backend
FROM python:3.11-slim

WORKDIR /app


COPY ./requirements.txt ./
RUN apt-get update && apt-get install -y build-essential libcurl4-openssl-dev libssl-dev
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN apt-get update && apt-get install -y build-essential libcurl4-openssl-dev libssl-dev

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
