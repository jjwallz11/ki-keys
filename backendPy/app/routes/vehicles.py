from flask import Blueprint, render_template, request, redirect, flash, url_for
from flask_sqlalchemy import SQLAlchemy
from app.models import Vehicle, db
from backendPy.app.form_validation import VehicleForm

bp = Blueprint('vehicles', __name__)


@bp.route('/vehicles', methods=["GET"])
def vehicles():
    return render_template('vehicles.html')

@bp.route('/add_vehicle', methods=["GET", "POST"])
def add_vehicle():
    form = VehicleForm()
    if form.validate_on_submit():
        vin = form.vin.data
        make = form.make.data
        model = form.model.data
        year = form.year.data
        
        new_vehicle = Vehicle(vin=vin, make=make, model=model, year=year)
        try:
            db.session.add(new_vehicle)
            db.session.commit()
            flash("Vehicle added successfully!", "success")
            return redirect(url_for('add_vehicle'))
        except Exception as e:
            db.session.rollback()
            flash(f"Error adding vechicle: {e}", "danger")
    elif request.method == "POST":
        flash("Failed to add vehicle. Please check the form.", "danger")
    return render_template('add_vehicle.html', form=form)


@bp.route('/vehicle-data', methods=["GET"])
def vehicle_data():
    vehicles = Vehicle.query.all()
    return render_template('vechicle_data.html', vehicles=vehicles)