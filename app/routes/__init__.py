from fastapi import APIRouter
from .users import router as users_router
from .vehicles import router as vehicles_router
from .inventory import router as inventory_router
from .invoices import router as invoices_router
from .receipts import router as receipts_router
from .auth import router as auth_router

router = APIRouter()

router.include_router(auth_router, prefix="/api", tags=["Auth"])
router.include_router(users_router, prefix="/api/users", tags=["Users"])
router.include_router(vehicles_router, prefix="/api/vehicles", tags=["Vehicles"])
router.include_router(inventory_router, prefix="/api/inventory", tags=["Inventory"])
router.include_router(invoices_router, prefix="/api/invoices", tags=["Invoices"])
router.include_router(receipts_router, prefix="/api/receipts", tags=["Receipts"])