import typer
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
    seed_users()
    typer.echo("Seeding inventory...")
    seed_inventory()
    typer.echo("Seeding invoices...")
    seed_invoices()
    typer.echo("Seeding receipts...")
    seed_receipts()
    typer.echo("✅ Seeding complete!")

@app.command()
def undo():
    """
    Remove all seeded data.
    """
    typer.echo("Undoing seeded data...")
    undo_receipts()
    undo_invoices()
    undo_inventory()
    undo_users()
    typer.echo("🗑️ Undo complete!")

if __name__ == "__main__":
    app()