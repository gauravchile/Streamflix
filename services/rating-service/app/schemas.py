# app/schemas.py
from pydantic import BaseModel, Field

class RatingIn(BaseModel):
    user_id: int = Field(..., example=1)
    movie_id: str = Field(..., example="movie-123")
    rating: float = Field(..., ge=0.0, le=5.0)
    comment: str | None = None
