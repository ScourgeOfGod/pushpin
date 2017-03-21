#coding:utf-8
from __future__ import unicode_literals
from flask import Flask, render_template,session,redirect,request,url_for
from  . import app
import requests,json
import util


headers = {'content-type': 'application/json'}

#device
@app.route('/device/<htmlname>')
def device(htmlname):
    if session.get('author','nologin') == 'nologin':
        return redirect('/login')
    headers['authorization'] = session['author']
    validate_result = json.loads(util.validate(session['author'], app.config['passport_key']))
    if int(validate_result['code']) == 0:
        return render_template(htmlname+'.html',info=session,user=session['user'])
    else:
        return render_template(htmlname+'.html',errmsg=validate_result['errmsg'])

@app.errorhandler(404)    #系统自带的装饰器，遇到404回自动返回制定的404页面
def not_found(e):
    return render_template('404.html')

@app.errorhandler(500)
def  internal_server_error(e):
    return render_template('500.html')
