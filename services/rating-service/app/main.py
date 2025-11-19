# app/main.py
from fastapi import FastAPI, HTTPException
from .db import db
from .schemas import RatingIn
from bson import ObjectId

app = FastAPI(title="rating-service")

@app.get("/health")
async def health():
    return {"ok": True}

@app.post("/ratings", status_code=201)
async def create_rating(rating: RatingIn):
    doc = rating.dict()
    ret = await db.ratings.insert_one(doc)
    return {"inserted_id": str(ret.inserted_id)}

@app.get("/ratings/{movie_id}")
async def get_ratings(movie_id: str):
    cursor = db.ratings.find({"movie_id": movie_id})
    out = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        out.append(doc)
    return out
