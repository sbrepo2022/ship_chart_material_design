from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, jsonify
from jinja2 import Template
from db.dbcm import make_query

from bp_auth.auth import user_group_requires

works = Blueprint('works', __name__, template_folder='templates')


@works.route('/', methods=['GET'])
@user_group_requires(2)
def index():
    db_config = getattr(current_app, 'db_config')

    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    result = []
    count = 0
    try:
        result = make_query(db_config,
                            'SELECT activity_id, employee_id, activity_date, work_type, work_hours, paid_for FROM activity ORDER BY activity_id DESC LIMIT %s OFFSET %s',
                            [
                                limit,
                                offset
                            ], description=True)
        employees = make_query(db_config,
                               'SELECT employee_id, firstname, midname, lastname, birthday, admission, dismission, department_id, img_url FROM employees WHERE deleted=0 AND (dismission > current_date() OR dismission IS NULL)',
                               [])
        count = make_query(db_config, 'SELECT count(*) FROM activity', [])[0][0]
    except ValueError:
        print('ValueError')

    return render_template('index_works.html', title='Works', page='works', t_head=result[0],
                           t_data=result[1:], employees=employees, limit=limit, offset=offset, count=count)


@works.route('/work', methods=['GET', 'POST', 'PUT', 'DELETE'])
@user_group_requires(2)
def work():
    db_config = getattr(current_app, 'db_config')

    if request.method == 'GET':
        activity_data = {'error': 'db_error'}

        dt = Template('{{ dt }}')

        try:
            activity_result = make_query(db_config,
                                         'SELECT a.activity_id, a.activity_date, a.work_type, a.work_hours, a.paid_for, e.employee_id, e.firstname, e.midname, e.lastname, e.birthday, e.admission, e.dismission, e.department_id, e.img_url FROM activity a INNER JOIN employees e ON a.employee_id = e.employee_id WHERE activity_id = %s',
                                         [request.args['activity_id']])[0]

            activity_data = {'activity_id': activity_result[0], 'activity_date': dt.render(dt=activity_result[1]),
                             'work_type': activity_result[2],
                             'work_hours': activity_result[3], 'paid_for': activity_result[4],
                             'employee_id': activity_result[5],
                             'firstname': activity_result[6], 'midname': activity_result[7],
                             'lastname': activity_result[8],
                             'birthday': dt.render(dt=activity_result[9]),
                             'admission': dt.render(dt=activity_result[10]),
                             'dismission': dt.render(dt=activity_result[11]), 'department_id': activity_result[12],
                             'img_url': activity_result[13]}

        except ValueError:
            print('ValueError')

        return jsonify(activity_data)

    if request.method == 'POST':
        content = request.get_json()

        try:
            make_query(db_config, 'INSERT INTO activity VALUES(NULL, %s, %s, %s, %s, 0)',
                       [content['employee_id'], content['activity_date'], content['work_type'], content['work_hours']])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})

    if request.method == 'PUT':
        content = request.get_json()

        try:
            make_query(db_config, 'UPDATE activity SET employee_id=%s, activity_date=%s, work_type=%s, work_hours=%s WHERE activity_id=%s',
                       [content['employee_id'], content['activity_date'], content['work_type'], content['work_hours'], content['activity_id']])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})

    if request.method == 'DELETE':
        content = request.get_json()

        try:
            for activity_id in content['activities_id']:
                make_query(db_config, 'DELETE FROM activity WHERE activity_id = %s', [activity_id])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})


@works.route('/pay', methods=['POST'])
@user_group_requires(2)
def pay():
    db_config = getattr(current_app, 'db_config')

    if request.method == 'POST':
        content = request.get_json()

        try:
            for activity_id in content['activities_id']:
                make_query(db_config, 'UPDATE activity SET paid_for=1 WHERE activity_id = %s', [activity_id])
        except ValueError:
            print('ValueError')

        return jsonify({'status': 'ok'})
