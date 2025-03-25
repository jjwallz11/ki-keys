# app/seeds/cli.py
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
    asyncio.run(_seed_all())

async def _seed_all():
    if settings.ENVIRONMENT == 'production':
        typer.echo("Production environment detected. Undoing existing data before seeding...")
        await _undo_all()

    typer.echo("Seeding users...")
    await seed_users()

    typer.echo("Seeding inventory...")
    await seed_inventory()

    typer.echo("Seeding invoices...")
    await seed_invoices()

    typer.echo("Seeding receipts...")
    await seed_receipts()

    typer.echo("✅ Seeding complete!")

@app.command()
def undo():
    """
    Remove all seeded data.
    """
    asyncio.run(_undo_all())

async def _undo_all():
    typer.echo("Undoing seeded data...")
    await undo_receipts()
    await undo_invoices()
    await undo_inventory()
    await undo_users()
    typer.echo("🗑️ Undo complete!")

if __name__ == "__main__":
    app()