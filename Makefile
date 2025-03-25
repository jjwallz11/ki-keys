.PHONY: seed undo run

seed:
	PYTHONPATH=. python3 app/seeds/cli.py all

undo:
	PYTHONPATH=. python3 app/seeds/cli.py undo

# Run FastAPI backend
run:
	PYTHONPATH=. uvicorn app.main:app --reload