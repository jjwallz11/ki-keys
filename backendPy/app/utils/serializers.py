def serialize_model(instance, fields):
    return {field: getattr(instance, field) for field in fields}