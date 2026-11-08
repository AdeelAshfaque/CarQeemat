from typing import Literal, Optional

from pydantic import BaseModel, Field


class CarPredictionRequest(BaseModel):
    make: str = Field(min_length=1, description="Vehicle make")
    model: str = Field(min_length=1, description="Vehicle model")
    fuel: Optional[str] = Field(default=None, min_length=1)
    car_documents: Optional[str] = Field(
        default=None,
        min_length=1,
        description="Document status, such as whether the original documents are available",
    )
    assembly: Optional[str] = Field(default=None, min_length=1)
    transmission: Optional[str] = Field(default=None, min_length=1)
    registration_type: Optional[str] = Field(default=None, min_length=1)
    registration_location_group: Optional[str] = Field(default=None, min_length=1)
    seller_city: Optional[str] = Field(default=None, min_length=1)
    seller_location_type: Optional[str] = Field(default=None, min_length=1)

    year: int = Field(gt=0, description="Manufacturing year")
    km_driven: float = Field(ge=0, description="Odometer reading in kilometers")

    abs: bool = False
    am_fm_radio: bool = False
    air_bags: bool = False
    air_conditioning: bool = False
    alloy_rims: bool = False
    cd_player: bool = False
    cassette_player: bool = False
    climate_control: bool = False
    cool_box: bool = False
    cruise_control: bool = False
    dvd_player: bool = False
    front_camera: bool = False
    front_speakers: bool = False
    heated_seats: bool = False
    immobilizer_key: bool = False
    keyless_entry: bool = False
    navigation_system: bool = False
    power_locks: bool = False
    power_mirrors: bool = False
    power_steering: bool = False
    power_windows: bool = False
    rear_ac_vents: bool = False
    rear_camera: bool = False
    rear_seat_entertainment: bool = False
    rear_speakers: bool = False
    steering_switches: bool = False
    sun_roof: bool = False
    usb_and_auxillary_cable: bool = False

    class Config:
        extra = "forbid"


class CarPredictionResponse(BaseModel):
    success: bool
    predicted_price: int = Field(gt=0, description="Estimated price in Pakistani Rupees")
    currency: Literal["PKR"]
    message: str
