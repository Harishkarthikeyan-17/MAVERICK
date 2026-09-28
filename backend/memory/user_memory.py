# user_memory = {}

# def get_history(user_id):
#     return user_memory.get(user_id, [])

# def add_history(user_id, text):
#     if user_id not in user_memory:
#         user_memory[user_id] = []
#     user_memory[user_id].append(text)
user_memory = {}

def get_history(user_id):
    return user_memory.get(user_id, [])

def add_history(user_id, text):
    if user_id not in user_memory:
        user_memory[user_id] = []
    user_memory[user_id].append(text)