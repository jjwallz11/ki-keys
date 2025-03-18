class ApplicationError(Exception):
    def __init__(self, message, status_code):
        super().__init__(message)
        self.status_code = status_code

def handle_application_error(error):
    response = {"error": str(error)}
    return response, error.status_code