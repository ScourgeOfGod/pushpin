import sys
from flask import Flask
from . import main
from . import adminlte


reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)


app.register_blueprint(main.main)
app.register_blueprint(adminlte.adminlte)
