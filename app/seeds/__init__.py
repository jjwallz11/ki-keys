# backend/seed/seed_commands.py
import typer
from app.services.users import seed_users, undo_users
from app.services.menus import seed_menus, undo_menus
from app.services.items import seed_items, undo_items
from app.services.orders import seed_orders, undo_orders
from app.services.order_items import undo_order_items
from app.config import settings  # assuming your environment variable for production is here

app = typer.Typer()

@app.command()
def all():
    """
    Run all seed scripts.
    If running in production, undo existing seeds first.
    """
    if settings.ENVIRONMENT == 'production':
        typer.echo("Production environment detected. Undoing seed data first...")
        undo_order_items()
        undo_users()
        undo_menus()
        undo_items()
        undo_orders()
    typer.echo("Seeding data...")
    seed_users()
    seed_menus()
    seed_items()
    seed_orders()
    typer.echo("Seeding complete!")

@app.command()
def undo():
    """
    Undo all seeded data.
    """
    typer.echo("Undoing seeded data...")
    undo_order_items()
    undo_users()
    undo_menus()
    undo_items()
    undo_orders()
    typer.echo("Undo complete!")

if __name__ == "__main__":
    app()