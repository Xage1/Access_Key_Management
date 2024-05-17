#!/usr/bin/python3

from . import db
from datetime import datetime

"""
Access key class definition
"""
class AccessKey(db.model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(64), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
