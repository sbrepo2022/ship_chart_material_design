from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, jsonify
from werkzeug.utils import secure_filename
from db.dbcm import make_query
import json
import os
from project_common import allowed_file, random_string

from bp_auth.auth import user_group_requires

ships = Blueprint('ships', __name__, template_folder='templates')


@ships.route('/', methods=['GET'])
@user_group_requires(2)
def index():
    db_config = getattr(current_app, 'db_config')

    result = []
    try:
        result = make_query(db_config, 'SELECT s.ship_id, s.ship_name, p.port_name, s.img_url, p.id FROM ships s INNER JOIN ports p ON s.port_id = p.id', [])
    except ValueError:
        print('ValueError')

    return render_template('index_ships.html', title='Ships', page='ships', ships=result)


@ships.route('/ship', methods=['POST', 'PUT', 'DELETE'])
@user_group_requires(2)
def ship():
    db_config = getattr(current_app, 'db_config')
    file = None
    filename = ''

    if request.method == 'POST':
        if 'ship-image' in request.files:
            file = request.files['ship-image']

        if file and allowed_file(file.filename):
            filename = secure_filename(random_string(12) + '_' + file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

        try:
            make_query(db_config, 'INSERT INTO ships VALUES(NULL, %s, %s, %s)', [
                request.form['ship-name'],
                request.form['port-id'],
                filename
            ])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})

    if request.method == 'PUT':
        if 'ship-image' in request.files:
            file = request.files['ship-image']

        if file and allowed_file(file.filename):
            filename = secure_filename(random_string(12) + '_' + file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

        if file:
            try:
                make_query(db_config, 'UPDATE ships SET ship_name=%s, port_id=%s, img_url=%s WHERE ship_id=%s', [
                    request.form['ship-name'],
                    request.form['port-id'],
                    filename,
                    request.form['ship-id']
                ])
            except ValueError:
                print('ValueError')

        else:
            try:
                make_query(db_config, 'UPDATE ships SET ship_name=%s, port_id=%s WHERE ship_id=%s', [
                    request.form['ship-name'],
                    request.form['port-id'],
                    request.form['ship-id']
                ])
            except ValueError:
                print('ValueError')

        return jsonify({'status': 'ok'})

    if request.method == 'DELETE':
        try:
            make_query(db_config, 'DELETE FROM ships WHERE ship_id=%s', [
                request.form['ship-id']
            ])
        except ValueError:
            print('ValueError')

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
