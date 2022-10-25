from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, jsonify
from jinja2 import Template
from db.dbcm import make_query

from bp_auth.auth import user_group_requires

offloads = Blueprint('offloads', __name__, template_folder='templates')


@offloads.route('/', methods=['GET'])
@user_group_requires(2)
def index():
    db_config = getattr(current_app, 'db_config')

    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    result = []
    count = 0
    try:
        result = make_query(db_config,
                            'SELECT offload_id, entry_dt, exit_dt, ship_id, ((SELECT count(*) FROM emp_off eo WHERE eo.offload_id = o.offload_id AND eo.history = 0) = 0) AS applied FROM offloads o ORDER BY offload_id DESC LIMIT %s OFFSET %s',
                            [
                                limit,
                                offset
                            ], description=True)
        ships = make_query(db_config,
                           'SELECT s.ship_id, s.ship_name, p.port_name, s.img_url FROM ships s INNER JOIN ports p ON s.port_id = p.id',
                           [])
        employees = make_query(db_config,
                               'SELECT employee_id, firstname, midname, lastname, birthday, admission, dismission, department_id, img_url FROM employees WHERE deleted=0 AND (dismission > current_date() OR dismission IS NULL)',
                               [])
        count = make_query(db_config, 'SELECT count(*) FROM offloads', [])[0][0]
    except ValueError:
        print('ValueError')

    return render_template('index_offloads.html', title='Offloads', page='offloads', t_head=result[0],
                           t_data=result[1:], ships=ships, employees=employees, limit=limit, offset=offset, count=count)


@offloads.route('/offload', methods=['GET', 'POST', 'PUT', 'DELETE'])
@user_group_requires(2)
def offload():
    db_config = getattr(current_app, 'db_config')

    if request.method == 'GET':
        offload_data = {'error': 'db_error'}

        dt = Template('{{ dt }}')

        try:
            offload_result = make_query(db_config,
                                        'SELECT o.offload_id, o.entry_dt, o.exit_dt, o.ship_id, s.ship_name, s.port_id, p.port_name, s.img_url FROM offloads o INNER JOIN ships s ON o.ship_id = s.ship_id INNER JOIN ports p ON s.port_id = p.id WHERE offload_id = %s',
                                        [request.args['offload_id']])[0]
            emp_off_result = make_query(db_config,
                                        'SELECT e.employee_id, e.firstname, e.midname, e.lastname, e.birthday, e.admission, e.dismission, e.department_id, e.img_url, eo.offload_date, eo.work_hours FROM emp_off eo INNER JOIN employees e ON eo.employee_id = e.employee_id WHERE eo.offload_id = %s',
                                        [offload_result[0]])

            offload_data = {'offload_id': offload_result[0], 'entry_dt': dt.render(dt=offload_result[1]),
                            'exit_dt': dt.render(dt=offload_result[2]),
                            'ship_id': offload_result[3], 'ship_name': offload_result[4], 'port_id': offload_result[5],
                            'port_name': offload_result[6], 'img_url': offload_result[7],
                            'employee_offloads': []}

            for row in emp_off_result:
                offload_data['employee_offloads'].append({
                    'employee_id': row[0], 'firstname': row[1], 'midname': row[2], 'lastname': row[3],
                    'birthday': dt.render(dt=row[4]),
                    'admission': dt.render(dt=row[5]), 'dismission': dt.render(dt=row[6]), 'department_id': row[7],
                    'img_url': row[8],
                    'offload_date': dt.render(dt=row[9]), 'work_hours': row[10]
                })

        except ValueError:
            print('ValueError')

        return jsonify(offload_data)

    if request.method == 'POST':
        content = request.get_json()

        try:
            make_query(db_config, 'INSERT INTO offloads VALUES(NULL, %s, NULL, %s)',
                       [content['entry_dt'], content['ship_id']])
            offload_id = make_query(db_config, 'SELECT MAX(offload_id) FROM offloads', [])[0][0]
            for oe in content['offload_employees']:
                make_query(db_config, 'INSERT INTO emp_off VALUES(NULL, %s, %s, %s, %s, 0)', [
                    oe['employee_id'], oe['offload_date'], oe['work_hours'], offload_id
                ])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})

    if request.method == 'PUT':
        content = request.get_json()

        try:
            offload_id = content['offload_id']
            make_query(db_config, 'UPDATE offloads SET entry_dt=%s, ship_id=%s WHERE offload_id=%s',
                       [content['entry_dt'], content['ship_id'], offload_id])
            make_query(db_config, 'DELETE FROM emp_off WHERE offload_id=%s', [offload_id])
            for oe in content['offload_employees']:
                make_query(db_config, 'INSERT INTO emp_off VALUES(NULL, %s, %s, %s, %s, 0)', [
                    oe['employee_id'], oe['offload_date'], oe['work_hours'], offload_id
                ])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})

    if request.method == 'DELETE':
        content = request.get_json()

        try:
            for offload_id in content['offloads_id']:
                make_query(db_config, 'DELETE FROM offloads WHERE offload_id = %s', [offload_id])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})


@offloads.route('/finish', methods=['POST'])
@user_group_requires(2)
def finish():
    db_config = getattr(current_app, 'db_config')

    if request.method == 'POST':
        content = request.get_json()

        try:
            offload_id = content['offload_id']
            make_query(db_config, 'UPDATE offloads SET exit_dt=%s WHERE offload_id=%s',
                       [content['exit_dt'], offload_id])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})


@offloads.route('/apply', methods=['POST'])
@user_group_requires(2)
def apply():
    db_config = getattr(current_app, 'db_config')

    if request.method == 'POST':
        content = request.get_json()

        try:
            for offload_id in content['offloads_id']:
                make_query(db_config,
                           """
                           INSERT INTO activity (activity_id, employee_id, activity_date, work_type, work_hours, paid_for)
                           SELECT NULL, employee_id, offload_date as activity_date, 'offload' as work_type, work_hours, 0 as paid_for 
                           FROM emp_off WHERE offload_id=%s AND NOT history
                           """,
                           [offload_id])
                make_query(db_config, 'UPDATE emp_off SET history=1 WHERE offload_id=%s', [offload_id])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})

