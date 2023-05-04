$(function () {
	//实例化详细介绍编辑器
    tinyMCE.init({
        selector: "#place_placeDesc",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
	$("#place_placeName").validatebox({
		required : true, 
		missingMessage : '请输入会议室名称',
	});

	$("#place_personNum").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入容纳人数',
		invalidMessage : '容纳人数输入不对',
	});

	$("#place_placeLocation").validatebox({
		required : true, 
		missingMessage : '请输入会议室位置',
	});

	$("#place_price").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入会议室单价',
		invalidMessage : '会议室单价输入不对',
	});

	$("#place_addTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	//单击添加按钮
	$("#placeAddButton").click(function () {
		if(tinyMCE.editors['place_placeDesc'].getContent() == "") {
			alert("请输入详细介绍");
			return;
		}
		//验证表单 
		if(!$("#placeAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#placeAddForm").form({
			    url:"/Place/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#placeAddForm").form("validate"))  { 
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
                        $("#placeAddForm").form("clear");
                        tinyMCE.editors['place_placeDesc'].setContent("");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#placeAddForm").submit();
		}
	});

	//单击清空按钮
	$("#placeClearButton").click(function () { 
		//$("#placeAddForm").form("clear"); 
		location.reload()
	});
});
