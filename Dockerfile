# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables for Python
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (if any are needed, e.g., for specific ML libraries)
# RUN apt-get update && apt-get install -y --no-install-recommends some-package && rm -rf /var/lib/apt/lists/*

# Install Poetry (Optional but recommended package manager)
# RUN pip install poetry
# COPY pyproject.toml poetry.lock* ./
# RUN poetry config virtualenvs.create false && poetry install --no-dev --no-interaction --no-ansi

# --- OR --- Install dependencies using requirements.txt (current setup)
COPY requirements.txt .
# Consider upgrading pip first
RUN pip install --no-cache-dir --upgrade pip
# Install dependencies
# Using --no-cache-dir can reduce image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable for the port (optional, good practice)
ENV PORT 8000

# Command to run the application using Uvicorn
# Use 0.0.0.0 to ensure it's accessible from outside the container
# Increase workers based on CPU cores available on the host, e.g., workers = (2 * CPU_CORES) + 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"] 