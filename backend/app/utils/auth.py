from flask import g
from functools import wraps

def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not getattr(g, 'user', None):
            return {"error": "Unauthorized"}, 401
        return fn(*args, **kwargs)
    return wrapper

def role_required(roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if g.user.role not in roles:
                return {"error": "Forbidden"}, 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator