# crud.py
from database import db
import schemas
from auth import get_password_hash
from pymongo.errors import DuplicateKeyError
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId

users_collection: AsyncIOMotorCollection = db["users"]
questions_collection: AsyncIOMotorCollection = db["questions"]

users_collection.create_index("email", unique=True)

# ========================================================== #
#                        USER CRUD                           #
# ========================================================== #

async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

async def create_user(user: schemas.UserCreate):
    if await get_user_by_email(user.email):
        return None
    
    hashed_password = get_password_hash(user.password)
    user_document = {
        "nickname": user.nickname,
        "email": user.email,
        "hashed_password": hashed_password,
        "role": "user"
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


# ========================================================== #
#                        QUIZ CRUD                           #
# ========================================================== #

async def create_question(question: schemas.QuestionCreate):
    result = await questions_collection.insert_one(question.dict())
    return str(result.inserted_id)

async def get_questions_by_quiz_id(quiz_id: str):
    questions = []
    async for q in questions_collection.find({"quiz_id": quiz_id}):
        questions.append({
            "id": str(q["_id"]),
            "quiz_id": q["quiz_id"],
            "content": q["content"],
            "image_url": q.get("image_url"),
            "options": q["options"],
            "correct_answer_index": q.get("correct_answer_index", 0)
        })
    return questions

async def check_answer(question_id: str, selected_index: int):
    try:
        q = await questions_collection.find_one({"_id": ObjectId(question_id)})
        if not q:
            return None
    
        is_correct = (q["correct_answer_index"] == selected_index)
        
        return {
            "is_correct": is_correct,
            "correct_index": q["correct_answer_index"]
        }
    except Exception:
        return None

async def delete_question(question_id: str):
    try:
        result = await questions_collection.delete_one({"_id": ObjectId(question_id)})
        return result.deleted_count > 0
    except Exception:
        return False

async def update_question(question_id: str, question_data: schemas.QuestionCreate):
    try:
        result = await questions_collection.update_one(
            {"_id": ObjectId(question_id)},
            {"$set": question_data.dict()}
        )
        return result.modified_count > 0
    except Exception:
        return False