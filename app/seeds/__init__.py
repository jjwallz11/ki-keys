# app/seeds/__init__.py
import typer
import asyncio
from app.seeds.users import seed_users, undo_users
from app.seeds.inventory import seed_inventory, undo_inventory
from app.seeds.invoices import seed_invoices, undo_invoices
from app.seeds.receipts import seed_receipts, undo_receipts
from app.config import settings

app = typer.Typer()

@app.command()
def all():
    """
    Seed all data into the database.
    """
    if settings.ENVIRONMENT == 'production':
        typer.echo("Production environment detected. Undoing existing data before seeding...")
        undo()

    typer.echo("Seeding users...")
    asyncio.run(seed_users())
    typer.echo("Seeding inventory...")
    asyncio.run(seed_inventory())
    typer.echo("Seeding invoices...")
    asyncio.run(seed_invoices())
    typer.echo("Seeding receipts...")
    asyncio.run(seed_receipts())
    typer.echo("✅ Seeding complete!")

@app.command()
def undo():
    """
    Remove all seeded data.
    """
    typer.echo("Undoing seeded data...")
    asyncio.run(undo_receipts())
    asyncio.run(undo_invoices())
    asyncio.run(undo_inventory())
    asyncio.run(undo_users())
    typer.echo("🗑️ Undo complete!")

if __name__ == "__main__":
    app()