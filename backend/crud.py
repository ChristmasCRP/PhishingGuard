from database import db
from schemas import UserCreate
from auth import get_password_hash
from pymongo.errors import DuplicateKeyError
from motor.motor_asyncio import AsyncIOMotorCollection

users_collection: AsyncIOMotorCollection = db["users"]
users_collection.create_index("email", unique=True)

async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

async def create_user(user: UserCreate):
    if await get_user_by_email(user.email):
        return None
    
    hashed_password = get_password_hash(user.password)
    user_document = {
        "nickname": user.nickname,
        "email": user.email,
        "hashed_password": hashed_password
    }

    try:
        await users_collection.insert_one(user_document) 
        return await get_user_by_email(user.email)
    except DuplicateKeyError:
        return None
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

async def update_user_password(email: str, new_password: str):
    hashed_password = get_password_hash(new_password)
    result = await users_collection.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password}}
    )
    return result.modified_count > 0

async def delete_user(email: str):
    result = await users_collection.delete_one({"email": email})
    return result.deleted_count > 0