# SECRET_KEY, URI do MongoDB
#user jakubuser
#pass TKNz4mH5detPFQcC

import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

if not MONGO_URI:
    raise RuntimeError("brakuje mi zmiennej cos sie wywalilo")
if not SECRET_KEY:
    raise RuntimeError("Brakuje mi zmiennej secret, cos sie wywalilo")