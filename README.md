# CarQeemat

**Know Your Car's Worth.**

CarQeemat estimates used-car asking prices in Pakistan from vehicle details and
a trained XGBoost pipeline. The estimate is a guide based on historical OLX
Pakistan asking prices; it is not a guaranteed final selling price.

## Project layout

```text
CarQeemat/
├── backend/                 FastAPI application and request validation
├── data/
│   ├── raw/                 Local source listings (not committed)
│   └── processed/           Local cleaned listings (not committed)
├── frontend/                React, TypeScript, Vite, Tailwind application
├── models/
│   └── carqeemat_pipeline.pkl
├── notebooks/
│   └── carqeemat_model_development.ipynb
├── reports/                 Evaluation reports and presentation materials
├── tests/                   Backend API and model integration tests
├── requirements.txt
└── docker-compose.yml
```

The notebook is a development/training record, not required to run the API.
The API loads the checked-in pipeline directly and does not retrain the model.

## Model and dataset

- Training dataset: 8,976 cleaned OLX Pakistan car listings.
- Estimator: XGBoost Regressor in a saved Scikit-learn preprocessing pipeline.
- Test MAE: Rs 158,226.
- Test RMSE: Rs 232,512.
- Test R²: 0.9589.

The raw and processed listing CSVs are intentionally excluded from Git. They
contain third-party listing content and location/image references; only use or
redistribute the source data when permitted. To rerun the notebook, place the
source file at `data/raw/olx_cars.csv`. The notebook writes cleaned data to
`data/processed/olx_cars_cleaned.csv` and the model to
`models/carqeemat_pipeline.pkl`.

The API needs the pipeline file at `models/carqeemat_pipeline.pkl`. Keep the
Scikit-learn, XGBoost, Pandas, and Joblib versions in `requirements.txt`
consistent with the environment that created the pickle.

## Run locally

Use Python 3.12 and Node.js 22 or later.

1. Install backend dependencies from the project root:

   ```bash
   python3.12 -m venv .venv
   .venv/bin/python -m pip install -r requirements.txt
   ```

2. Start the API in one terminal:

   ```bash
   .venv/bin/uvicorn backend.main:app --reload
   ```

   Health check: <http://127.0.0.1:8000/>

   Swagger UI: <http://127.0.0.1:8000/docs>

3. Install and start the frontend in another terminal:

   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

   Open <http://127.0.0.1:5173/>. Vite proxies `/api` to the local FastAPI
   server.

## Run tests and checks

Install the optional test dependencies, then run the backend integration tests:

```bash
.venv/bin/python -m pip install -r requirements-dev.txt
.venv/bin/python -m pytest
```

Run frontend checks:

```bash
cd frontend
npm ci
npm run build
npm run lint
```

## Deploy with Docker Compose

Docker Compose builds the API and static frontend together. The frontend
container proxies API requests to the backend over the Compose network, so
browser requests remain same-origin.

```bash
docker compose up --build
```

Open <http://localhost:8080/>. The API is also available at
<http://localhost:8000/> and the API docs at <http://localhost:8000/docs>.

For deployments that host the frontend and API on different origins, set
`VITE_API_BASE_URL` to the public API origin when building the frontend and set
`CARQEEMAT_CORS_ORIGINS` to the exact frontend origin(s) on the API. Do not use
wildcard CORS origins for a public deployment.

## Frontend vehicle model attribution

The optional hero car model is the Khronos glTF Sample Assets Car Concept by
Darmstadt Graphics Group GmbH, converted by Eric Chadwick, under CC BY 4.0.
See [`frontend/public/models/README.md`](frontend/public/models/README.md) for
attribution and production-use notes. The landing page includes a static
fallback for browsers without WebGL.
