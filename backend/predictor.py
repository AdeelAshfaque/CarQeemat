import math
from pathlib import Path

import joblib
import pandas as pd
from sklearn.pipeline import Pipeline

from backend.schemas import CarPredictionRequest


MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "carqeemat_pipeline.pkl"
FEATURE_REFERENCE_YEAR = 2026
PLACEHOLDER_MILEAGES = {1, 20, 12345, 123456}

FEATURE_COLUMNS = (
    "Make",
    "Model",
    "Fuel",
    "Car documents",
    "Assembly",
    "Transmission",
    "Registration_Type",
    "Registration_Location_Group",
    "Seller_City",
    "Seller_Location_Type",
    "Year",
    "KM's driven",
    "KM_Per_Year",
    "Mileage_Suspected_Placeholder",
    "ABS",
    "AM/FM Radio",
    "Air Bags",
    "Air Conditioning",
    "Alloy Rims",
    "CD Player",
    "Cassette Player",
    "Climate Control",
    "Cool Box",
    "Cruise Control",
    "DVD Player",
    "Front Camera",
    "Front Speakers",
    "Heated Seats",
    "Immobilizer Key",
    "Keyless Entry",
    "Navigation System",
    "Power Locks",
    "Power Mirrors",
    "Power Steering",
    "Power Windows",
    "Rear AC Vents",
    "Rear Camera",
    "Rear Seat Entertainment",
    "Rear speakers",
    "Steering Switches",
    "Sun Roof",
    "USB and Auxillary Cable",
)

CATEGORICAL_FEATURES = {
    "Make": "make",
    "Model": "model",
    "Fuel": "fuel",
    "Car documents": "car_documents",
    "Assembly": "assembly",
    "Transmission": "transmission",
    "Registration_Type": "registration_type",
    "Registration_Location_Group": "registration_location_group",
    "Seller_City": "seller_city",
    "Seller_Location_Type": "seller_location_type",
}

BINARY_FEATURES = {
    "ABS": "abs",
    "AM/FM Radio": "am_fm_radio",
    "Air Bags": "air_bags",
    "Air Conditioning": "air_conditioning",
    "Alloy Rims": "alloy_rims",
    "CD Player": "cd_player",
    "Cassette Player": "cassette_player",
    "Climate Control": "climate_control",
    "Cool Box": "cool_box",
    "Cruise Control": "cruise_control",
    "DVD Player": "dvd_player",
    "Front Camera": "front_camera",
    "Front Speakers": "front_speakers",
    "Heated Seats": "heated_seats",
    "Immobilizer Key": "immobilizer_key",
    "Keyless Entry": "keyless_entry",
    "Navigation System": "navigation_system",
    "Power Locks": "power_locks",
    "Power Mirrors": "power_mirrors",
    "Power Steering": "power_steering",
    "Power Windows": "power_windows",
    "Rear AC Vents": "rear_ac_vents",
    "Rear Camera": "rear_camera",
    "Rear Seat Entertainment": "rear_seat_entertainment",
    "Rear speakers": "rear_speakers",
    "Steering Switches": "steering_switches",
    "Sun Roof": "sun_roof",
    "USB and Auxillary Cable": "usb_and_auxillary_cable",
}


class CarPricePredictor:
    def __init__(self, model_path: Path = MODEL_PATH) -> None:
        self.pipeline: Pipeline = joblib.load(model_path)
        model_features = getattr(self.pipeline, "feature_names_in_", None)
        if model_features is None or tuple(model_features) != FEATURE_COLUMNS:
            raise RuntimeError("The saved pipeline does not match the expected input features.")

    def predict(self, car: CarPredictionRequest) -> int:
        feature_values = {
            feature_name: getattr(car, request_field)
            for feature_name, request_field in CATEGORICAL_FEATURES.items()
        }
        feature_values.update(
            {
                "Year": car.year,
                "KM's driven": car.km_driven,
                "KM_Per_Year": car.km_driven
                / max(FEATURE_REFERENCE_YEAR - car.year, 1),
                "Mileage_Suspected_Placeholder": int(
                    car.km_driven in PLACEHOLDER_MILEAGES
                ),
            }
        )
        feature_values.update(
            {
                feature_name: int(getattr(car, request_field))
                for feature_name, request_field in BINARY_FEATURES.items()
            }
        )

        features = pd.DataFrame([feature_values], columns=FEATURE_COLUMNS)
        prediction = float(self.pipeline.predict(features)[0])
        if not math.isfinite(prediction) or prediction <= 0:
            raise ValueError("The model returned an invalid price estimate.")
        return round(prediction)
