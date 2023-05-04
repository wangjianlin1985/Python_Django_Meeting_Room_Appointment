$(function () {
	$("#orderInfo_orderDate").datebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#orderInfo_totalMoney").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入订单总金额',
		invalidMessage : '订单总金额输入不对',
	});

	$("#orderInfo_payAccount").validatebox({
		required : true, 
		missingMessage : '请输入支付账号',
	});

	$("#orderInfo_orderStateObj").validatebox({
		required : true, 
		missingMessage : '请输入订单状态',
	});

	$("#orderInfo_receiveName").validatebox({
		required : true, 
		missingMessage : '请输入收货人',
	});

	$("#orderInfo_telephone").validatebox({
		required : true, 
		missingMessage : '请输入收货人电话',
	});

	$("#orderInfo_address").validatebox({
		required : true, 
		missingMessage : '请输入收货人地址',
	});

	//单击添加按钮
	$("#orderInfoAddButton").click(function () {
		//验证表单 
		if(!$("#orderInfoAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#orderInfoAddForm").form({
			    url:"/OrderInfo/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#orderInfoAddForm").form("validate"))  { 
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
                        $("#orderInfoAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#orderInfoAddForm").submit();
		}
	});

	//单击清空按钮
	$("#orderInfoClearButton").click(function () { 
		//$("#orderInfoAddForm").form("clear"); 
		location.reload()
	});
});
