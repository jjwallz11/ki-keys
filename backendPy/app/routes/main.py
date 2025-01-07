from flask import render_template, Blueprint, redirect
from app.forms.login import LoginForm


bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('page.html', title="Welcome")


@bp.route('/help')
def help():
    return render_template('page.html', title="Help")


@bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        return redirect('/')
    return render_template('login.html', form=form)