#!/usr/bin/python3

"""
Initialization file
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config

db = SQLAlchemy()


def create_app():
    """
    Initial Flask creation and configuration
    """
    app = Flask(__name__)
    app.config.from_object('config.Config')


    db.init_app(app)

    with app.app_context():
        from . import routes, models
        db.create_all()


    return app
