# app/db.py
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://mongo:27017')
MONGO_DB = os.getenv('MONGO_DB', 'streamflix_movies')

client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[MONGO_DB]
