#!/usr/bin/python3

import os
import binascii

def generate_key():
    """
    Function for generating the access key
    """
    return binascii.hexlify(os.urandom(32)).decode()
