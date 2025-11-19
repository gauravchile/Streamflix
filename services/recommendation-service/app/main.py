# app/main.py
from fastapi import FastAPI
from .rec import top_movies

app = FastAPI(title="recommendation-service")

@app.get("/health")
async def health():
    return {"ok": True}

@app.get("/recommend/{user_id}")
async def recommend(user_id: int, limit: int = 10):
    # stub: return top movies overall
    recs = top_movies(limit=limit)
    return [{"movie_id": item["_id"], "score": item["avg"]} for item in recs]
