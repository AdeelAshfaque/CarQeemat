import logging
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from backend.predictor import CarPricePredictor
from backend.schemas import CarPredictionRequest, CarPredictionResponse


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    app.state.predictor = CarPricePredictor()
    yield


app = FastAPI(
    title="CarQeemat API",
    description=(
        "Used-car price estimates for Pakistan. Predictions are based on historical "
        "OLX Pakistan asking prices and are not guaranteed final selling prices."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CARQEEMAT_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "CarQeemat API"}


@app.post(
    "/predict",
    response_model=CarPredictionResponse,
    tags=["predictions"],
    summary="Estimate a used car's asking price",
)
def predict_price(
    car: CarPredictionRequest,
    request: Request,
) -> CarPredictionResponse:
    predictor: CarPricePredictor | None = getattr(
        request.app.state, "predictor", None
    )
    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail="The prediction service is temporarily unavailable.",
        )

    try:
        predicted_price = predictor.predict(car)
    except ValueError:
        logger.exception("Car price prediction failed")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate a price estimate right now.",
        ) from None

    return CarPredictionResponse(
        success=True,
        predicted_price=predicted_price,
        currency="PKR",
        message=(
            "Estimated asking price based on historical OLX Pakistan listings; "
            "not a guaranteed final selling price."
        ),
    )