from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, g
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from db.dbcm import make_query
import json

auth = Blueprint('auth', __name__, template_folder='templates')


@auth.route('/', methods=['GET', 'POST'])
def index():
    if session.get('user_id') is None:
        if request.method == 'GET':
            return render_template('index_auth.html',
                                   title='Sign In',
                                   redirect_url=request.args.get('redirect_url', default=''))
        elif request.method == 'POST':
            user_data = check_register(request.form)
            if user_data is None:
                return render_template('index_auth.html',
                                       title='Sign In',
                                       redirect_url=request.form['redirect_url'],
                                       has_error=1,
                                       errors='Incorrect Username or Password')
            else:
                session['user_id'] = user_data['user_id']
                session['u_group'] = user_data['u_group']
                if request.form['redirect_url']:
                    return redirect(request.form['redirect_url'])
                else:
                    return redirect('/')
    else:
        return redirect('/')


@auth.route('/logout')
def logout():
    session.clear()
    return redirect('/')


@auth.route('/403')
def forbidden():
    return render_template('403.html', title='403 Forbidden')


def check_register(form_data):
    with open('configs/db_config.json', 'r') as f_conf:
        db_config = json.load(f_conf)

    try:
        result = make_query(db_config, 'SELECT id, login, password, u_group FROM users WHERE login = %s',
                            [form_data['login']])
        if len(result) > 0:
            row = result[0]
            if check_password_hash(row[2], form_data['password']):
                return {'user_id': int(row[0]), 'u_group': int(row[3])}
        else:
            return None
    except ValueError:
        print('ValueError')
    return None


def user_group_requires(u_group: int):
    def user_group_requires_f(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if session.get('user_id') is None:
                return redirect(url_for('auth.index') + '?redirect_url=' + request.url)
            if int(session.get('u_group')) & u_group or int(session.get('u_group')) & \
                    int(getattr(current_app, 'auth_groups')['admin']):
                return f(*args, **kwargs)
            return redirect(url_for('auth.forbidden'))

        return wrapper

    return user_group_requires_f
