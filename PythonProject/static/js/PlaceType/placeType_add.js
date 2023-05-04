$(function () {
	$("#placeType_placeTypeName").validatebox({
		required : true, 
		missingMessage : '请输入会议室类型名称',
	});

	$("#placeType_placeTypeDesc").validatebox({
		required : true, 
		missingMessage : '请输入会议室类型说明',
	});

	//单击添加按钮
	$("#placeTypeAddButton").click(function () {
		//验证表单 
		if(!$("#placeTypeAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#placeTypeAddForm").form({
			    url:"/PlaceType/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#placeTypeAddForm").form("validate"))  { 
	                	$.messager.progress({
							text : "正在提交数据中...",
						}); 
	                	return true;
	                } else {
	                    return false;
	                }
			    },
			    success:function(data){
			    	$.messager.progress("close");
                    //此处data={"Success":true}是字符串
                	var obj = jQuery.parseJSON(data); 
                    if(obj.success){ 
                        $.messager.alert("消息","保存成功！");
                        $(".messager-window").css("z-index",10000);
                        $("#placeTypeAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#placeTypeAddForm").submit();
		}
	});

	//单击清空按钮
	$("#placeTypeClearButton").click(function () { 
		//$("#placeTypeAddForm").form("clear"); 
		location.reload()
	});
});
