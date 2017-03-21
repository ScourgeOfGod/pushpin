# coding:utf-8
from __future__ import unicode_literals

import json
import requests
from flask import render_template, session, redirect, current_app
import util

from . import adminlte

headers = {'content-type': 'application/json'}


@adminlte.route('/')
def index():
    if session.get('author', 'nologin') == 'nologin':
        return redirect('/login')
    headers['authorization'] = session['author']
    url = "http://%s/api" % current_app.config['api_host']
    data = {'jsonrpc': '2.0', 'id': 1, 'method': 'user.getinfo'}
    req = requests.post(url, headers=headers, json=data)
    result = json.loads(json.loads(req.content).get('result', '{}'))
    # print result
    if result['code'] == 0:
        user = result['user']
        session['user'] = result['user']  # 用户信息存入session
        session['role'] = user['r_id']  # 角色名eg:['sa','php']
        session['perm'] = user['p_id'].keys()  # 权限名eg:['git','mysql']
        session['username'] = user['name'] if user['name'] else user['username']
        user['role'] = ','.join(user['r_id'])
        user['perm'] = ','.join(
            ['<a href="%s" style="color:blue">%s</a>' % (x['url'], x['name_cn']) for x in user['p_id'].values()])
        return render_template('adminlte/default.html', info=session, user=user)
    else:
        return redirect('/login')

