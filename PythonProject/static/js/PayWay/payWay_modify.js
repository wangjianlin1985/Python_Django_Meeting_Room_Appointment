$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/PayWay/update/" + $("#payWay_payWayId_modify").val(),
		type : "get",
		data : {
			//payWayId : $("#payWay_payWayId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (payWay, response, status) {
			$.messager.progress("close");
			if (payWay) { 
				$("#payWay_payWayId_modify").val(payWay.payWayId);
				$("#payWay_payWayId_modify").validatebox({
					required : true,
					missingMessage : "请输入支付方式id",
					editable: false
				});
				$("#payWay_payWayName_modify").val(payWay.payWayName);
				$("#payWay_payWayName_modify").validatebox({
					required : true,
					missingMessage : "请输入支付方式名称",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#payWayModifyButton").click(function(){ 
		if ($("#payWayModifyForm").form("validate")) {
			$("#payWayModifyForm").form({
			    url:"PayWay/update/" + $("#payWay_payWayId_modify").val(),
			    onSubmit: function(){
					if($("#payWayEditForm").form("validate"))  {
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
                	var obj = jQuery.parseJSON(data);
                    if(obj.success){
                        $.messager.alert("消息","信息修改成功！");
                        $(".messager-window").css("z-index",10000);
                        //location.href="frontlist";
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    } 
			    }
			});
			//提交表单
			$("#payWayModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
