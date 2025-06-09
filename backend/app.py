from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash




app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'super-secret-key' 
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
db = SQLAlchemy(app)

# Product Model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    category = db.Column(db.String(50))
    price = db.Column(db.Float)
    brand = db.Column(db.String(50))
    description = db.Column(db.Text)
    image_url = db.Column(db.String(200))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "price": self.price,
            "brand": self.brand,
            "description": self.description,
            "image_url": self.image_url
        }

@app.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    brand = request.args.get('brand')
    query = Product.query
    if category:
        query = query.filter_by(category=category)
    if brand:
        query = query.filter_by(brand=brand)
    products = query.all()
    return jsonify([p.to_dict() for p in products])

from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

from flask_jwt_extended import create_access_token

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify({"access_token": access_token}), 200

from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Welcome, {current_user}!"})

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)  # from JWT identity
    sender = db.Column(db.String(10), nullable=False)    # 'user' or 'bot'
    text = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "sender": self.sender,
            "text": self.text
        }


from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, jsonify

@app.route('/chat', methods=['POST'])
@jwt_required()
def add_chat_message():
    data = request.get_json()
    username = get_jwt_identity()
    msg = ChatMessage(username=username, sender=data["sender"], text=data["text"])
    db.session.add(msg)
    db.session.commit()
    return jsonify({"message": "Message saved"}), 201

@app.route('/chat', methods=['GET'])
@jwt_required()
def get_chat_history():
    username = get_jwt_identity()
    messages = ChatMessage.query.filter_by(username=username).all()
    return jsonify([m.to_dict() for m in messages])



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
