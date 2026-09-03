import os

from pathlib import Path

import faiss

from dotenv import load_dotenv

from groq import Groq

from pypdf import PdfReader

from sentence_transformers import (
    SentenceTransformer
)


# ==========================================
# BACKEND DIRECTORY
# ==========================================

BASE_DIR = Path(
    __file__
).resolve().parent


# ==========================================
# LOAD .ENV
# ==========================================

ENV_FILE = (
    BASE_DIR / ".env"
)


load_dotenv(
    dotenv_path=ENV_FILE
)


# ==========================================
# GROQ API KEY
# ==========================================

API_KEY = os.getenv(
    "GROQ_API_KEY"
)


if not API_KEY:

    raise ValueError(
        f"GROQ_API_KEY is missing from {ENV_FILE}"
    )


print(
    "Groq API key loaded successfully"
)


# ==========================================
# GROQ CLIENT
# ==========================================

client = Groq(
    api_key=API_KEY
)


# ==========================================
# EMBEDDING MODEL
# ==========================================

print(
    "Loading embedding model..."
)


embedding_model = (
    SentenceTransformer(
        "all-MiniLM-L6-v2"
    )
)


print(
    "Embedding model loaded"
)


# ==========================================
# LOAD PDF
# ==========================================

def load_pdf(
    filepath
):

    pdf = PdfReader(
        str(filepath)
    )


    text = ""


    for page in pdf.pages:

        page_text = (
            page.extract_text()
        )


        if page_text:

            text += (
                page_text
                + "\n"
            )


    return text


# ==========================================
# LOAD TXT
# ==========================================

def load_textfile(
    filepath
):

    with open(
        filepath,
        "r",
        encoding="utf-8"
    ) as file:

        return file.read()


# ==========================================
# FILE FORMAT
# ==========================================

def find_file_format(
    filepath
):

    filepath = Path(
        filepath
    )


    if not filepath.exists():

        raise FileNotFoundError(
            f"Knowledge file not found: {filepath}"
        )


    extension = (
        filepath.suffix
        .lower()
    )


    if extension == ".pdf":

        return load_pdf(
            filepath
        )


    if extension == ".txt":

        return load_textfile(
            filepath
        )


    raise ValueError(
        "Only .txt and .pdf files are supported"
    )


# ==========================================
# SPLIT INTO CHUNKS
# ==========================================

def split_chunks(
    text,
    chunk_size=500,
    overlap=100
):

    if not text:

        raise ValueError(
            "Knowledge file is empty"
        )


    chunks = []


    start = 0


    while start < len(text):

        end = (
            start
            +
            chunk_size
        )


        chunk = (
            text[
                start:end
            ]
            .strip()
        )


        if chunk:

            chunks.append(
                chunk
            )


        start += (
            chunk_size
            -
            overlap
        )


    if not chunks:

        raise ValueError(
            "No chunks were created"
        )


    return chunks


# ==========================================
# EMBEDDINGS
# ==========================================

def embed_text(
    chunks
):

    embeddings = (
        embedding_model.encode(
            chunks,
            convert_to_numpy=True
        )
    )


    return (
        embeddings.astype(
            "float32"
        )
    )


# ==========================================
# FAISS INDEX
# ==========================================

def create_index(
    embeddings
):

    if (
        len(
            embeddings.shape
        )
        != 2
    ):

        raise ValueError(
            "Invalid embedding shape"
        )


    dimension = (
        embeddings.shape[1]
    )


    index = (
        faiss.IndexFlatL2(
            dimension
        )
    )


    index.add(
        embeddings
    )


    return index


# ==========================================
# SEARCH
# ==========================================

def search(
    query,
    index,
    chunks,
    top_k=5
):

    if not query.strip():

        raise ValueError(
            "Question cannot be empty"
        )


    query_embedding = (
        embedding_model.encode(
            [query],
            convert_to_numpy=True
        )
        .astype(
            "float32"
        )
    )


    actual_top_k = min(
        top_k,
        len(chunks)
    )


    distances, indices = (
        index.search(
            query_embedding,
            actual_top_k
        )
    )


    result = []


    for index_number in (
        indices[0]
    ):

        if (
            index_number
            < 0
        ):

            continue


        result.append(
            chunks[
                index_number
            ]
        )


    return result


# ==========================================
# KNOWLEDGE FILE
# ==========================================

KNOWLEDGE_FILE = (
    BASE_DIR
    / "ecommerce_FAQs.txt"
)


print(
    "Knowledge file:",
    KNOWLEDGE_FILE
)


# ==========================================
# BUILD RAG INDEX ON STARTUP
# ==========================================

text = find_file_format(
    KNOWLEDGE_FILE
)


print(
    "Knowledge file loaded"
)


chunks = split_chunks(
    text,
    chunk_size=500,
    overlap=100
)


print(
    "Chunks created:",
    len(chunks)
)


embeddings = embed_text(
    chunks
)


print(
    "Embeddings created:",
    embeddings.shape
)


index = create_index(
    embeddings
)


print(
    "FAISS index created successfully"
)


# ==========================================
# ASK CHATBOT
# ==========================================

def ask_chatbot(
    query
):

    relevant_chunks = search(
        query=query,
        index=index,
        chunks=chunks,
        top_k=5
    )


    if not relevant_chunks:

        return (
            "The answer is not available "
            "in the provided file."
        )


    context = "\n\n".join(
        relevant_chunks
    )


    completion = (
        client
        .chat
        .completions
        .create(

            model="openai/gpt-oss-120b",

            messages=[

                {
                    "role":
                        "system",

                    "content":
                        """
You are a helpful ShopNow e-commerce assistant.

Answer questions using only the provided file context.

Rules:

1. Answer only from the provided context.
2. Do not use outside knowledge.
3. Do not guess.
4. If the answer is unavailable, say:
"The answer is not available in the provided file."
5. Keep the answer clear and concise.
6. Do not mention RAG, FAISS, embeddings, chunks, or internal implementation details.
"""
                },

                {
                    "role":
                        "user",

                    "content":
                        f"""
Context:

{context}


Question:

{query}
"""
                }

            ],

            temperature=0.2,

            max_tokens=500

        )
    )


    answer = (
        completion
        .choices[0]
        .message
        .content
    )


    return answer