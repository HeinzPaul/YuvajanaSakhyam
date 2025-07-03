from flask import Flask, render_template, request, jsonify, url_for
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = os.path.join('static', 'avatars')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return "This is the about page."

@app.route('/upload-avatar', methods=['POST'])
def upload_avatar():
    file = request.files.get('avatar')
    member = request.form.get('member', 'avatar')
    if file:
        ext = os.path.splitext(file.filename)[1].lower()
        filename = secure_filename(f"{member}{ext}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        url = url_for('static', filename=f'avatars/{filename}')
        return jsonify(success=True, url=url)
    return jsonify(success=False), 400

if __name__ == '__main__':
    app.run(debug=True)
