from werkzeug.security import generate_password_hash, check_password_hash
from dbcm import make_query
import json


def create_user(form_data):
    with open('configs/db_config.json', 'r') as f_conf:
        db_config = json.load(f_conf)

    if form_data['password'] != form_data['password2']:
        return False

    try:
        result = make_query(db_config, 'SELECT id FROM users WHERE login = %s', [form_data['login']])
        if len(result) > 0:
            return False

        make_query(db_config, 'INSERT INTO users(login, password, u_group) VALUES(%s, %s, %s)', [form_data['login'], generate_password_hash(form_data['password']), form_data['u_group']])
        return True
    except ValueError:
        print('ValueError')
    return False


form_d = {
    'login': str(input('Enter login: ')),
    'password': str(input('Enter password: ')),
    'password2': str(input('Confirm password: ')),
    'u_group': str(input('Choose group (1 - admin, 2 - staff, 4 - user or logical sum): '))
}
print('Result: ', create_user(form_d))
