from flask import Flask, redirect, url_for, session, g, render_template, send_from_directory
import json

from bp_auth.auth import auth
from bp_ships.ships import ships
from bp_staff.staff import staff
from bp_offloads.offloads import offloads
from bp_works.works import works

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.secret_key = '7l{WAB}B$ZRDzQpwvQ$INt7MTUN|0$4M'
app.config['UPLOAD_FOLDER'] = 'media'
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(ships, url_prefix='/ships')
app.register_blueprint(staff, url_prefix='/staff')
app.register_blueprint(offloads, url_prefix='/offloads')
app.register_blueprint(works, url_prefix='/works')

with open('configs/db_config.json', 'r') as f_conf:
    app.db_config = json.load(f_conf)

with open('configs/auth_groups_config.json', 'r') as f_conf:
    app.auth_groups = json.load(f_conf)


@app.route('/')
def index():
    return render_template('index.html', title='Main')


@app.route('/media/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run()
