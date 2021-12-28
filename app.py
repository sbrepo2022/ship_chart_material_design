from flask import Flask, redirect, url_for, session, g, render_template
import json

from auth_bp.auth import auth
from ships_bp.ships import ships

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.secret_key = '7l{WAB}B$ZRDzQpwvQ$INt7MTUN|0$4M'
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(ships, url_prefix='/ships')

with open('configs/db_config.json', 'r') as f_conf:
    app.db_config = json.load(f_conf)

with open('configs/auth_groups_config.json', 'r') as f_conf:
    app.auth_groups = json.load(f_conf)


@app.route('/')
def index():
    return render_template('index.html', title='Main')


if __name__ == '__main__':
    app.run()
