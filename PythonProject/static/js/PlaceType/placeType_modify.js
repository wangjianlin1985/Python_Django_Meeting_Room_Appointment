$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/PlaceType/update/" + $("#placeType_placeTypeId_modify").val(),
		type : "get",
		data : {
			//placeTypeId : $("#placeType_placeTypeId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (placeType, response, status) {
			$.messager.progress("close");
			if (placeType) { 
				$("#placeType_placeTypeId_modify").val(placeType.placeTypeId);
				$("#placeType_placeTypeId_modify").validatebox({
					required : true,
					missingMessage : "请输入会议室类型id",
					editable: false
				});
				$("#placeType_placeTypeName_modify").val(placeType.placeTypeName);
				$("#placeType_placeTypeName_modify").validatebox({
					required : true,
					missingMessage : "请输入会议室类型名称",
				});
				$("#placeType_placeTypeDesc_modify").val(placeType.placeTypeDesc);
				$("#placeType_placeTypeDesc_modify").validatebox({
					required : true,
					missingMessage : "请输入会议室类型说明",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#placeTypeModifyButton").click(function(){ 
		if ($("#placeTypeModifyForm").form("validate")) {
			$("#placeTypeModifyForm").form({
			    url:"PlaceType/update/" + $("#placeType_placeTypeId_modify").val(),
			    onSubmit: function(){
					if($("#placeTypeEditForm").form("validate"))  {
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
			$("#placeTypeModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
