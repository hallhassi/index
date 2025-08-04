from flask import Flask, jsonify, render_template, send_from_directory
import os

app = Flask(__name__)

# The directory containing your images
IMAGE_DIR = 'static/hi'

# Route to get the list of image file names
@app.route('/get_images')
def get_images():
    # Get a list of all files in the directory
    files = os.listdir(IMAGE_DIR)
    
    # Filter for common image extensions
    images = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]
    
    # Return the list as a JSON response
    return jsonify(images)

# Route to serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# Run the app
if __name__ == '__main__':
    # Use a secure port and debug=False in production
    app.run(debug=True)