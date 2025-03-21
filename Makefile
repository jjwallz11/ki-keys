.PHONY: seed undo run

# Run all seed scripts
seed:
	PYTHONPATH=. python3 app/seeds/__init__.py all

# Undo all seeded data
undo:
	PYTHONPATH=. python3 app/seeds/__init__.py undo

# Run FastAPI backend
run:
	PYTHONPATH=. uvicorn app.main:app --reload