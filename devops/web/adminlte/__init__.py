from flask import Blueprint

adminlte = Blueprint('adminlte', __name__, template_folder='templates', static_folder='static', static_url_path='/adminlte')


from . import views
