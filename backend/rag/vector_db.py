import faiss
import numpy as np

class VectorDB:
    def __init__(self, dim=768):
        self.index = faiss.IndexFlatL2(dim)
        self.docs = []

    def add(self, embeddings, texts):
        if not embeddings:
            return
        self.index.add(np.array(embeddings).astype('float32'))
        self.docs.extend(texts)

    def search(self, query_embedding, k=3):
        D, I = self.index.search(np.array([query_embedding]), k)
        return [self.docs[i] for i in I[0]]