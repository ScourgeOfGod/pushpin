from flask import Blueprint

import sys

# reload(sys)
# sys.setdefaultencoding('utf-8')
# app = Flask(__name__)
from flask import g

main = Blueprint('main', __name__, template_folder='templates', static_folder='static', static_url_path='')

from . import demo, login, public