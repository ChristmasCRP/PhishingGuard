from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI
import certifi

client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where())

db = client["phishguard"]

try:
    print("Połączono z MongoDB")
except Exception as e:
    print("Błąd połączenia:", e)