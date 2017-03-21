function getlist(){
    zabbix_group = $("#zabbix_group");
    sync_host_list = $("#host_list");
    var url = "/listapi?method=zabbix_gettem"
    $.getJSON('/listapi?method=zbhost_allhost', function(data){
                sync_host_list.empty();
                server_list = JSON.parse(data['result']);
                if(server_list['code'] == 0){
                $.each(server_list['result'], function(n, obj){
                    html = '<div class="checkbox">';
                    html += '<label>';
                    html += '<input type="checkbox" name="zabbix_hosts" class="zabbix_hosts" value="'+obj.hostid+'">';
                    html += obj.host;
                    html += '</label>';
                    html += '</div>';
                    sync_host_list.append(html);
                });
                }
                else {

                        swal(data['errmsg']);
                }

            });
    $.getJSON(url,function(data){
                data = JSON.parse(data['result']);
		console.log(data);
                if(data['code'] == 0){
                $.each(data['result'], function(n, obj){

                    zabbix_group.append("<option value='"+obj.templateid+"'>"+obj.name+"</option>");
                })
                }else
                {
                        swal(data['errmsg'])
                }
          })
     $("#create").click(function(){
            hostids = new Array();
            $("input[name='zabbix_hosts']:checked").each(function (i, n) {
                hostids[i] = n.value
            });
            zabbix_groupid = $("#zabbix_group").val();
            $.post('/zabbixapi',{method:"link_tem",hostids:hostids.toString(), groupid:zabbix_groupid},
                    function(data){
                        data=JSON.parse(data);   //将json串转换为对象，然后取值
                        data = JSON.parse(data['result']) //object
                        console.log(data)
                        if(data['code'] == 0){
                            swal({
                            title:"success",
                            text:"添加成功",
                            type:"success",
                            confirmButtonText:'添加zabbi主机成功'
                    },function(){
                        location.reload()
                    })
                        }else{
                        swal(data['errmsg'])
                        }

                     })
                 })   /*end of create*/

        $("#clean").click(function(){
            hostids = new Array();
            $("input[name='zabbix_hosts']:checked").each(function (i, n) {
                hostids[i] = n.value
            });
            zabbix_groupid = $("#zabbix_group").val();
            $.post('/zabbixapi',{method:"unlink_tem",hostids:hostids.toString(), groupid:zabbix_groupid},
                    function(data){
                        data=JSON.parse(data);   //将json串转换为对象，然后取值
                        data = JSON.parse(data['result']) //object
                        console.log(data)
                        if(data['code'] == 0){
                            swal({
                            title:"success",
                            text:"删除成功",
                            type:"success",
                            confirmButtonText:'成功解绑模板'
                    },function(){
                        location.reload()
                    })
                        }else{
                        swal(data['errmsg'])
                        }

                     })
                 })   /*end of clean*/

             }  /*end of all*/

getlist()

function inster_zabbix_data(data){
    $.each( data, function(num, obj){
        html = "";
        html += get_host_html(obj);
        html += get_template_html(obj);
        $("#zb_content").append(html)
    });
}

function get_host_html(data){
    html = '<dt><label class="checkbox-inline"><input type="checkbox" value="'+data.hostid+'">'+data.name+'</label></dt>';
    return html
}
function get_template_html(data){
    hostname = data.hostname;
    hostid = data.hostid;
    html = '<dd>';
    html += '<ul class="list-inline">';
    $.each( data.parentTemplates, function(num, obj){
        html += '<li>'+obj.name;
        data =   "template='"+obj.name+"'  hostid='"+hostid+"'  templateid='"+obj.templateid+"' hostname='"+hostname+"'";
        html += ' <span class="glyphicon glyphicon-remove unlink" aria-hidden="true" '+data+' ></li>';
    });
    html += '</ul>';
    html += '</dd>';
    return html
}

function get_templeate(){
    $.getJSON("/listapi?method=zabbix_tem",function(data){
                data = JSON.parse(data['result']);
                console.log(data);
                if(data['code'] == 0){
		     inster_zabbix_data(data['result'])

                }else
                {
                        swal(data['errmsg'])
                }
          })
	}

get_templeate()

    $("#zb_content").on("click", ".unlink", function(){
	click_obj = $(this);
        cli_hostid = click_obj.attr('hostid');
        cli_templateid = click_obj.attr('templateid');
        cli_template = click_obj.attr('template');
	console.log(cli_hostid)
        swal({
            title: "确定删除吗?",
            text: "将从 "+ cli_hostid +" 上取消关联 "+ cli_template +" 模板",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            cancelButtonText: "取消",
            confirmButtonText: "删除",
            closeOnConfirm: false },
                function(){
                    $.post("/zabbix_template", {method:"unlink_tem",hostid: cli_hostid, templateid: cli_templateid} , function(data){
                       data=JSON.parse(data);   //将json串转换为对象，然后取值
                        data = JSON.parse(data['result']) //object
			console.log(data);
			if (data['code'] == 0){
                            swal("操作成功", "模板解绑成功", "success");
                            click_obj.parents('li').remove()
                        }else{
                            swal("操作失败", data, "error");
                        }

                    });

                });
    })