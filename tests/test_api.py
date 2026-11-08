from fastapi.testclient import TestClient

from backend.main import app
from backend.schemas import CarPredictionRequest


def test_health_check() -> None:
    with TestClient(app) as client:
        response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "CarQeemat API"}


def test_predict_uses_loaded_pipeline() -> None:
    request_data = {
        "make": "Honda",
        "model": "City Aspire",
        "year": 2018,
        "km_driven": 70000,
        "fuel": "Petrol",
        "transmission": "Manual",
        "abs": True,
    }

    with TestClient(app) as client:
        response = client.post("/predict", json=request_data)
        expected_price = client.app.state.predictor.predict(
            CarPredictionRequest(**request_data)
        )

    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["predicted_price"] == expected_price
    assert response.json()["currency"] == "PKR"
    assert "historical OLX Pakistan listings" in response.json()["message"]


def test_predict_rejects_invalid_values() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/predict",
            json={
                "make": "Honda",
                "model": "City Aspire",
                "year": 0,
                "km_driven": -1,
            },
        )

    assert response.status_code == 422
    assert {error["loc"][-1] for error in response.json()["detail"]} == {
        "year",
        "km_driven",
    }


def test_predict_rejects_unexpected_fields() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/predict",
            json={
                "make": "Honda",
                "model": "City Aspire",
                "year": 2018,
                "km_driven": 70000,
                "unexpected": "value",
            },
        )

    assert response.status_code == 422
