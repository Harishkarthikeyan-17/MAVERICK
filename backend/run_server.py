import uvicorn
import traceback
import sys

try:
    print("Importing app from main...")
    from main import app
    print("App imported successfully.")
    
    if __name__ == "__main__":
        print("Starting uvicorn...")
        uvicorn.run(app, host="127.0.0.1", port=8000)
except Exception as e:
    print("Error during server startup:")
    traceback.print_exc()
    sys.exit(1)
