from app.models import Order, db

class OrderService:
    @staticmethod
    def create_order(user_id, locksmith_id, vehicle_id, description, units, price, due_date):
        total_due = price * units
        order = Order(
            user_id=user_id,
            locksmith_id=locksmith_id,
            vehicle_id=vehicle_id,
            description=description,
            units=units,
            price=price,
            amount=total_due,
            due_date=due_date,
            total_due=total_due
        )
        db.session.add(order)
        db.session.commit()
        return order

    @staticmethod
    def update_order_status(order_id, status):
        order = Order.query.get(order_id)
        if order:
            order.status = status
            db.session.commit()
        return order