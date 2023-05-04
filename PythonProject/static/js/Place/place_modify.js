$(function () {
    //实例化详细介绍编辑器
    tinyMCE.init({
        selector: "#place_placeDesc_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Place/update/" + $("#place_placeId_modify").val(),
		type : "get",
		data : {
			//placeId : $("#place_placeId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (place, response, status) {
			$.messager.progress("close");
			if (place) { 
				$("#place_placeId_modify").val(place.placeId);
				$("#place_placeId_modify").validatebox({
					required : true,
					missingMessage : "请输入会议室id",
					editable: false
				});
				$("#place_placeTypeObj_placeTypeId_modify").combobox({
					url:"/PlaceType/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"placeTypeId",
					textField:"placeTypeName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#place_placeTypeObj_placeTypeId_modify").combobox("select", place.placeTypeObjPri);
						//var data = $("#place_placeTypeObj_placeTypeId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#place_placeTypeObj_placeTypeId_edit").combobox("select", data[0].placeTypeId);
						//}
					}
				});
				$("#place_placeName_modify").val(place.placeName);
				$("#place_placeName_modify").validatebox({
					required : true,
					missingMessage : "请输入会议室名称",
				});
				$("#place_placePhotoImgMod").attr("src", place.placePhoto);
				$("#place_personNum_modify").val(place.personNum);
				$("#place_personNum_modify").validatebox({
					required : true,
					validType : "integer",
					missingMessage : "请输入容纳人数",
					invalidMessage : "容纳人数输入不对",
				});
				$("#place_placeLocation_modify").val(place.placeLocation);
				$("#place_placeLocation_modify").validatebox({
					required : true,
					missingMessage : "请输入会议室位置",
				});
				$("#place_price_modify").val(place.price);
				$("#place_price_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入会议室单价",
					invalidMessage : "会议室单价输入不对",
				});
				tinyMCE.editors['place_placeDesc_modify'].setContent(place.placeDesc);
				$("#place_addTime_modify").datetimebox({
					value: place.addTime,
					required: true,
					showSeconds: true,
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#placeModifyButton").click(function(){ 
		if ($("#placeModifyForm").form("validate")) {
			$("#placeModifyForm").form({
			    url:"Place/update/" + $("#place_placeId_modify").val(),
			    onSubmit: function(){
					if($("#placeEditForm").form("validate"))  {
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
			$("#placeModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
