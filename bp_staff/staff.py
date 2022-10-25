from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, jsonify
from werkzeug.utils import secure_filename
from db.dbcm import make_query
import json
import os
from project_common import allowed_file, random_string

from bp_auth.auth import user_group_requires

staff = Blueprint('staff', __name__, template_folder='templates')


@staff.route('/', methods=['GET'])
@user_group_requires(2)
def index():
    db_config = getattr(current_app, 'db_config')

    result1 = []
    try:
        result1 = make_query(db_config, 'SELECT employee_id, firstname, lastname, midname, birthday, admission, dismission, department_id, img_url FROM employees WHERE deleted=0 AND (dismission > current_date() OR dismission IS NULL)', [])
    except ValueError:
        print('ValueError')

    result2 = []
    try:
        result2 = make_query(db_config, 'SELECT employee_id, firstname, lastname, midname, birthday, admission, dismission, department_id, img_url FROM employees WHERE deleted=0 AND (dismission IS NOT NULL AND dismission <= current_date())', [])
    except ValueError:
        print('ValueError')

    return render_template('index_staff.html', title='Staff', page='staff', staff=result1, dismissed=result2)


@staff.route('/employee', methods=['POST', 'PUT', 'DELETE'])
@user_group_requires(2)
def employee():
    db_config = getattr(current_app, 'db_config')
    file = None
    filename = ''

    if request.method == 'POST':
        if 'employee-image' in request.files:
            file = request.files['employee-image']

        if file and allowed_file(file.filename):
            filename = secure_filename(random_string(12) + '_' + file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

        try:
            make_query(db_config, 'INSERT INTO employees VALUES(NULL, %s, %s, %s, %s, %s, NULL, %s, %s)', [
                request.form['employee-firstname'],
                request.form['employee-lastname'],
                request.form['employee-midname'],
                request.form['employee-birthday'],
                request.form['employee-admission'],
                request.form['department-id'],
                filename
            ])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})

    if request.method == 'PUT':
        if 'employee-image' in request.files:
            file = request.files['employee-image']

        if file and allowed_file(file.filename):
            filename = secure_filename(random_string(12) + '_' + file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

        if file:
            try:
                make_query(db_config, 'UPDATE employees SET firstname=%s, lastname=%s, midname=%s, birthday=%s, admission=%s, department_id=%s, img_url=%s WHERE employee_id=%s', [
                    request.form['employee-firstname'],
                    request.form['employee-lastname'],
                    request.form['employee-midname'],
                    request.form['employee-birthday'],
                    request.form['employee-admission'],
                    request.form['department-id'],
                    filename,
                    request.form['employee-id']
                ])
            except ValueError:
                print('ValueError')

        else:
            try:
                make_query(db_config, 'UPDATE employees SET firstname=%s, lastname=%s, midname=%s, birthday=%s, admission=%s, department_id=%s WHERE employee_id=%s', [
                        request.form['employee-firstname'],
                        request.form['employee-lastname'],
                        request.form['employee-midname'],
                        request.form['employee-birthday'],
                        request.form['employee-admission'],
                        request.form['department-id'],
                        request.form['employee-id']
                    ])
            except ValueError:
                print('ValueError')

        return jsonify({'status': 'ok'})

    if request.method == 'DELETE':
        try:
            make_query(db_config, 'UPDATE employees SET deleted=1 WHERE employee_id=%s', [
                request.form['employee-id']
            ])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})


@staff.route('/employee/dismiss', methods=['POST'])
@user_group_requires(2)
def dismiss():
    db_config = getattr(current_app, 'db_config')

    try:
        make_query(db_config, 'UPDATE employees SET dismission=%s WHERE employee_id=%s', [
            request.form['employee-dismissal'],
            request.form['employee-id']
        ])
    except ValueError:
        print('ValueError')

    return jsonify({'status': 'ok'})


@staff.route('/employee/restore', methods=['POST'])
@user_group_requires(2)
def restore():
    db_config = getattr(current_app, 'db_config')

    try:
        make_query(db_config, 'UPDATE employees SET dismission=NULL WHERE employee_id=%s', [
            request.form['employee-id']
        ])
    except ValueError:
        print('ValueError')

    return jsonify({'status': 'ok'})
