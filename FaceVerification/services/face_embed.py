from pathlib import Path
import os
# Modellerin D sürücüsünde saklanacağı klasör
MODEL_ROOT = Path("D:/insightface_data")
os.environ["INSIGHTFACE_HOME"] = str(MODEL_ROOT)

from insightface.app import FaceAnalysis
import numpy as np



# InsightFace yüz analizi uygulamasını başlat
face_app = FaceAnalysis(
    name="buffalo_l",
    allowed_modules=["detection", "recognition"],
    root=str(MODEL_ROOT)
)
face_app.prepare(ctx_id=-1, det_size=(640, 640))


def get_face_embedding(image_input) -> list:
    """
    Verilen resimden yüz embedding döndürür.
    - image_input: str (dosya yolu) veya numpy.ndarray (BGR görüntü)
    """
    import cv2
    import numpy as np
    from typing import List

    #check if image came from a file or live camera
    if isinstance(image_input, str):
        img = cv2.imread(image_input)
        if img is None:
            raise ValueError(f"Resim yüklenemedi: {image_input}")
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Dosyadan okunanı RGB'ye çevir
    elif isinstance(image_input, np.ndarray):
        img = cv2.cvtColor(image_input, cv2.COLOR_BGR2RGB)  # Kameradan geleni RGB'ye çevir
    else:
        raise TypeError("image_input str (dosya yolu) veya numpy.ndarray olmalı")

    faces = face_app.get(img)
    if len(faces) == 0:
        raise ValueError("Yüz bulunamadı!")
    return faces[0].normed_embedding.tolist()


def compare_faces(embedding1: np.ndarray, embedding2: np.ndarray) -> float:
    """
    İki yüz embedding'i arasındaki benzerlik skorunu döndürür (0 ile 1 arasında).
    """
    from numpy.linalg import norm #linalg: vektörler ve matrislerle ilgili matematiksel işlemleri yapmak için kullanılır

    similarity = np.dot(embedding1, embedding2) / (norm(embedding1) * norm(embedding2))  #we are using Cosine Similarity
    return float(similarity)
