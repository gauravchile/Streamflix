# app/rec.py
from pymongo import MongoClient
import os

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://mongo:27017')
MONGO_DB = os.getenv('MONGO_DB', 'streamflix_movies')

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[MONGO_DB]

def top_movies(limit=10):
    pipeline = [
        {"$group": {"_id": "$movie_id", "avg": {"$avg": "$rating"}}},
        {"$sort": {"avg": -1}},
        {"$limit": limit}
    ]
    return list(db.ratings.aggregate(pipeline))
