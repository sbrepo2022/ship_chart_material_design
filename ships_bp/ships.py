from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, jsonify
from functools import wraps
from db.dbcm import make_query
import json

from auth_bp.auth import user_group_requires

ships = Blueprint('ships', __name__, template_folder='templates')


@ships.route('/', methods=['GET'])
@user_group_requires(2)
def index():
    db_config = getattr(current_app, 'db_config')

    result = []
    try:
        result = make_query(db_config, 'SELECT s.ship_id, s.ship_name, p.port_name, s.img_url FROM ships s INNER JOIN ports p ON s.port_id = p.id', [])
    except ValueError:
        print('ValueError')

    return render_template('index_ships.html', title='Ships', page='ships', ships=result)


@ships.route('/ship', methods=['POST'])
@user_group_requires(2)
def ship():
    db_config = getattr(current_app, 'db_config')

    if request.method == 'POST':

        return jsonify({'status': 'ok'})


@ships.route('/port', methods=['GET'])
@user_group_requires(2)
def port():
    db_config = getattr(current_app, 'db_config')

    if request.method == 'GET':
        result = []
        try:
            result = make_query(db_config, 'SELECT * FROM ports', [])
        except ValueError:
            print('ValueError')

        return jsonify({'ports': result})
