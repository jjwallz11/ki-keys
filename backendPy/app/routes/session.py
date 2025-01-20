from flask import Blueprint, render_template, redirect, session, request, url_for
from flask_login import current_user, login_user, logout_user
from app.forms import LoginForm
from app.models import Locksmith, User

bp = Blueprint('session', __name__, url_prefix="/session")


@bp.route('/', methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        print("Already authenticated")
        return redirect(url_for('vehicles.vehicles'))
    form = LoginForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        locksmith = Locksmith.query.filter(Locksmith is True)
        print(f"Locksmith found: {locksmith}")
        if not locksmith or not locksmith.check_password(form.password.data):
            print("Invalid credentials!")
            return redirect(url_for(".login"))
        login_user(locksmith)
        print(f"Login successful for locksmith: {locksmith}")
        return redirect(url_for("vehicles.vehicles"))
    print("Form did not validate")
    print(f"Form errors: {form.errors}")
    return render_template("login.html", form=form)


@bp.route('/logout', methods=["POST"])
def logout():
    logout_user()
    return redirect(url_for('session.login'))