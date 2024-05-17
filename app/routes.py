#!/usr/bin/python3

from flask import render_template, jsonify, request
from . import db
from .models import AccessKey
from .utils import generate_key


@app.route('/')
def index():
    """
    Generating initial webpage
    """
    return render_template('index.html')


@app.route('/generate_key'. methods=['POST'])
def generate_access_key():
    """
    App route for generating the access key on click from HTML
    """
    new_key = generate_key()
    access_key = AccessKey(key=new_key)
    db.session.add(access_key)
    db.session.commit()
    return jsonify({'key'}: new_key})

@app.route('/Keys', methods=['GET'])
def get_keys():
    """
    Function for retrieving previously generated access keys
    """
    keys  = AccessKey.query.all()
    return jsonify([{'id': key.id, 'key': key.key, 'created_at': key.created_at} for key in keys])
