$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/TimeInterval/update/" + $("#timeInterval_intervalId_modify").val(),
		type : "get",
		data : {
			//intervalId : $("#timeInterval_intervalId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (timeInterval, response, status) {
			$.messager.progress("close");
			if (timeInterval) { 
				$("#timeInterval_intervalId_modify").val(timeInterval.intervalId);
				$("#timeInterval_intervalId_modify").validatebox({
					required : true,
					missingMessage : "请输入时段id",
					editable: false
				});
				$("#timeInterval_intervalName_modify").val(timeInterval.intervalName);
				$("#timeInterval_intervalName_modify").validatebox({
					required : true,
					missingMessage : "请输入时段名称",
				});
				$("#timeInterval_product_modify").val(timeInterval.product);
				$("#timeInterval_product_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入商品数量",
					invalidMessage : "商品数量输入不对",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#timeIntervalModifyButton").click(function(){ 
		if ($("#timeIntervalModifyForm").form("validate")) {
			$("#timeIntervalModifyForm").form({
			    url:"TimeInterval/update/" + $("#timeInterval_intervalId_modify").val(),
			    onSubmit: function(){
					if($("#timeIntervalEditForm").form("validate"))  {
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
			$("#timeIntervalModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
