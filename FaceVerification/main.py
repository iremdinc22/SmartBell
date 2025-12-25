from pathlib import Path
import sqlite3
from fastapi import FastAPI, UploadFile, HTTPException, Form, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import os
import numpy as np
import io

from typing import List  #**

# Import functions from project modules
from services.face_embed import get_face_embedding, compare_faces


app = FastAPI(title="Face Verification Microservice")  #this allow us to reach all FastAPI feature through app variable

# Define constants
MODEL_NAME = "buffalo_l"
# Set the verification threshold (based on our previous testing)
VERIFICATION_THRESHOLD = 0.5   #threshold may be change


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Health(BaseModel):
    status: str
    version: str

class EmbeddingResponse(BaseModel):
    # C# API'nin beklediği formatta embedding vektörünü döndürür
    embedding: List[float]
    success: bool = True

class SimilarityRequest(BaseModel):
    # C# API'den gelen iki embedding vektörü
    known_embedding: List[float]
    live_embedding: List[float]

class SimilarityResponse(BaseModel):
    # C# API'ye döndürülen benzerlik skoru
    similarity_score: float
    status: str
    success: bool = True

@app.get("/health", response_model=Health) #it allows other services, monitoring tools, or load balancers to check the operational status of microservice
def health():
    return Health(status="ok", version="0.1.0")

@app.post("/get_embedding", response_model=EmbeddingResponse)
async def get_embedding(
    file: UploadFile = File(...) 
):
    """
    Yüklenen imajdan yüzü tespit eder ve embedding vektörünü döndürür.
    DB kaydı veya reservation_code kontrolü YAPMAZ.
    """
    try:
        # 1. Yüklenen dosyayı oku
        contents = await file.read()
        
        # 2. OpenCV kullanarak bellekten imajı çöz
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR) 
        
        if img is None:
            raise HTTPException(status_code=400, detail="Could not decode image file.")

        # 3. Face Embedding'i çıkar
        # get_face_embedding (face_embed.py'den) artık doğrudan List[float] döndürmeli.
        embedding_list = get_face_embedding(img) 

        return EmbeddingResponse(
            embedding=embedding_list,
            success=True
        )

    except ValueError as e:
        # Yüz bulunamadı gibi hatalar için
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")


@app.post("/calculate_similarity", response_model=SimilarityResponse)
async def calculate_similarity(request: SimilarityRequest):
    """
    C# API'den gelen iki embedding vektörünü karşılaştırır ve skor döndürür.
    """
    try:
        # Gelen Python List'lerini NumPy array'lere çevir
        known_embedding_np = np.array(request.known_embedding)
        live_embedding_np = np.array(request.live_embedding)

        # Benzerlik skorunu hesapla
        similarity_score = compare_faces(known_embedding_np, live_embedding_np)
        
        return SimilarityResponse(
            similarity_score=round(float(similarity_score), 4),
            status="Calculation successful."
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during similarity calculation: {e}")


#ESKİ ENDPOINTLER
# @app.post("/enroll_face")
# async def enroll_face(
#     reservation_code: str = Form(...), # Reservation code provided by the guest (TEXT)
#     file: UploadFile = File(...)      # The image file uploaded by the guest
# ):
#     """
#     Registers a guest's face embedding using their reservation code.
#     """
#     try:
#         # 1. Read the uploaded file contents
#         contents = await file.read()
        
#         # 2. Decode the image from the memory buffer using OpenCV
#         nparr = np.frombuffer(contents, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR) 
        
#         # Check if decoding failed (e.g., file was corrupted)
#         if img is None:
#             raise HTTPException(status_code=400, detail="Could not decode image file.")

#         # 3. Extract the Face Embedding (Pass the decoded image matrix 'img')
#         embedding = get_face_embedding(img)

#         # 4. Register the person in the DB and get the ID
#         person_id = register_person(reservation_code)
        
#         if person_id == -1:
#              raise HTTPException(status_code=400, detail=f"Reservation code ({reservation_code}) is already registered.")

#         # 5. Save the embedding vector to the DB
#         save_embedding(person_id, embedding, MODEL_NAME)

#         return {
#             "success": True, 
#             "message": f"Enrollment successful for Reservation Code: {reservation_code}",
#             "person_id": person_id
#         }

#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Server error during enrollment: {e}")


# @app.post("/verify_checkin")
# async def verify_checkin(
#     reservation_code: str = Form(...), # Reservation code entered by the guest
#     file: UploadFile = File(...)      # Live image captured by the camera
# ):
#     """
#     Verifies the live face against the registered embedding for the given reservation code.
#     """
#     try:
#         # 1. Retrieve the registered embedding from the DB
#         registered_embedding = get_embedding_by_code(reservation_code)
        
#         if registered_embedding is None:
#             raise HTTPException(status_code=404, detail=f"No face data found for reservation code ({reservation_code}). Please enroll first.")

#         # 2. Read and extract embedding from the live image
#         contents = await file.read()
#         nparr = np.frombuffer(contents, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
#         if img is None:
#             raise HTTPException(status_code=400, detail="Could not decode live image file.")
            
#         # Pass the decoded image matrix 'img'
#         live_embedding = get_face_embedding(img)

#         # 3. Compare the two embeddings using Cosine Similarity
#         similarity_score = compare_faces(registered_embedding, live_embedding)

#         # 4. Determine verification status based on the threshold
#         is_verified = similarity_score >= VERIFICATION_THRESHOLD

#         return {
#             "success": True,
#             "is_verified": is_verified,
#             "similarity_score": round(float(similarity_score), 4),
#             "verification_status": "Identity Verified, Check-in Successful." if is_verified else "Identity verification failed. Score below threshold."
#         }

#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Server error during verification: {e}")