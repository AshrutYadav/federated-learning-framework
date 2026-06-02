# Trust-Aware Federated Learning Framework

## Overview

This project is a full-stack Federated Learning Framework that enables distributed model training while protecting against malicious client updates through anomaly detection and trust-aware aggregation.

The framework combines Machine Learning, Backend Engineering, Database Management, Security Mechanisms, and Frontend Monitoring into a single platform.

### Key Goals

* Simulate federated learning across multiple clients
* Detect malicious model updates
* Maintain trust scores for participating clients
* Perform trust-aware model aggregation
* Track experiments and model versions
* Monitor training progress through a React dashboard

---

# Features

## Federated Learning

* Multiple simulated training clients
* Global model distribution
* Local client-side training
* Centralized aggregation server

## Security Features

* Anomaly Detection
* Trust Scoring
* Trust Leaderboard
* Malicious Client Blocking
* Trust-Aware Aggregation

## Experiment Management

* Experiment Tracking
* Accuracy Monitoring
* Historical Training Records
* Round-wise Statistics

## Model Management

* Global Model Versioning
* Automatic Model Saving
* Round-Based Checkpoints

## Dashboard

* Current Round Monitoring
* Client Statistics
* Update Statistics
* Accuracy Charts
* Experiment History
* Trust Monitoring

---

# System Architecture

```text
Clients
   │
   ▼
FastAPI Backend
   │
   ├── Trust Engine
   │
   ├── Anomaly Detection
   │
   ├── Federated Aggregation
   │
   ├── Experiment Tracking
   │
   └── Model Versioning
   │
   ▼
PostgreSQL Database
   │
   ▼
React Dashboard
```

---

# Tech Stack

## Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* Uvicorn

## Machine Learning

* PyTorch
* Torchvision
* NumPy

## Frontend

* React
* Vite
* Tailwind CSS
* Recharts

## Database

* PostgreSQL

---

# Project Structure

```text
backend/
├── app/
├── clients/
├── database/
├── ml/
├── security/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/

models/

run_round.py
```

---

# Federated Learning Workflow

### Step 1

Clients register with the server.

### Step 2

Clients download the latest global model.

### Step 3

Clients train locally on their own data.

### Step 4

Updated model weights are sent to the server.

### Step 5

The server:

* Detects anomalies
* Updates trust scores
* Blocks malicious clients

### Step 6

Trust-aware aggregation is performed.

### Step 7

Global model is updated.

### Step 8

Model performance is evaluated.

### Step 9

Experiments and model versions are stored.

---

# Trust-Aware Aggregation

Traditional Federated Learning treats all clients equally.

This project introduces Trust-Aware Aggregation.

Each client is assigned a trust score.

Higher trust:

```text
More influence on aggregation
```

Lower trust:

```text
Less influence on aggregation
```

Weighted aggregation:

```text
Contribution ∝ Trust Score
```

This improves robustness against malicious updates.

---

# Anomaly Detection

The framework evaluates incoming model updates.

If an update is identified as suspicious:

* Trust score is reduced
* Client can be blocked
* Aggregation influence is reduced

---

# Experiment Tracking

Each completed round stores:

* Round Number
* Accuracy
* Average Trust
* Blocked Clients

This enables analysis of training performance across rounds.

---

# Model Versioning

Each global model is saved as:

```text
models/global_round_X.pth
```

Example:

```text
global_round_1.pth
global_round_2.pth
global_round_3.pth
```

---

# API Endpoints

## Federated Learning

```http
POST /federated/register_client
```

```http
GET /federated/global_model
```

```http
POST /federated/submit_weights
```

---

## Monitoring

```http
GET /federated/metrics
```

```http
GET /federated/trust
```

```http
GET /federated/experiments
```

```http
GET /federated/model_versions
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd federated-learning-framework
```

## Backend

```bash
pip install -r requirements.txt
```

Create:

```env
DATABASE_URL=your_database_url
```

Run:

```bash
uvicorn backend.app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Running Federated Training

Run a complete round:

```bash
python run_round.py
```

Or run clients individually:

```bash
python -m backend.clients.client_runner_1

python -m backend.clients.client_runner_2

python -m backend.clients.client_runner_3
```

---

# Results

Example Training Results:

| Round | Accuracy |
| ----- | -------- |
| 1     | 94%      |
| 2     | 96%      |
| 3     | 96.7%    |
| 4     | 96.9%    |

The framework consistently achieved approximately 97% accuracy on MNIST while maintaining robustness against malicious client updates.

---

# Future Improvements

* Real Client Deployment
* Differential Privacy
* Secure Aggregation
* Docker Deployment
* Cloud Deployment
* Advanced Trust Models

---

# Resume Highlights

* Built a full-stack Federated Learning platform using FastAPI, React, PostgreSQL, and PyTorch.
* Implemented anomaly detection and trust-aware aggregation to mitigate malicious client updates.
* Developed experiment tracking, model versioning, and monitoring dashboards.
* Achieved approximately 97% MNIST accuracy across multiple federated training rounds.

---

# License

MIT License
