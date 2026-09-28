from core.model_manager import model_manager
from rag.vector_db import VectorDB

def load_data(file_path, embedder):
    db = VectorDB()
    with open(file_path, "r") as f:
        texts = f.readlines()

    embeddings = [embedder.embed(t) for t in texts]
    db.add(embeddings, texts)

    return db

def generate_response(user_input, db, system_prompt, llm_name="biomistral", embed_name="pubmedbert"):

    embedder = model_manager.get_embedder(embed_name)
    llm = model_manager.get_llm(llm_name)

    query_embedding = embedder.embed(user_input)
    context = db.search(query_embedding)

    prompt = f"""
{system_prompt}

User:
{user_input}

Context:
{" ".join(context)}

Answer:
"""

    return llm.generate(prompt)