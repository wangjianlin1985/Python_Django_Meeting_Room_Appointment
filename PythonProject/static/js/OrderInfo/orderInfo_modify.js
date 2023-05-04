$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/OrderInfo/update/" + $("#orderInfo_orderNo_modify").val(),
		type : "get",
		data : {
			//orderNo : $("#orderInfo_orderNo_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (orderInfo, response, status) {
			$.messager.progress("close");
			if (orderInfo) { 
				$("#orderInfo_orderNo_modify").val(orderInfo.orderNo);
				$("#orderInfo_orderNo_modify").validatebox({
					required : true,
					missingMessage : "请输入订单编号",
					editable: false
				});
				$("#orderInfo_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#orderInfo_userObj_user_name_modify").combobox("select", orderInfo.userObjPri);
						//var data = $("#orderInfo_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#orderInfo_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#orderInfo_placeObj_placeId_modify").combobox({
					url:"/Place/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"placeId",
					textField:"placeName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#orderInfo_placeObj_placeId_modify").combobox("select", orderInfo.placeObjPri);
						//var data = $("#orderInfo_placeObj_placeId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#orderInfo_placeObj_placeId_edit").combobox("select", data[0].placeId);
						//}
					}
				});
				$("#orderInfo_orderDate_modify").datebox({
					value: orderInfo.orderDate,
					required: true,
					showSeconds: true,
				});
				$("#orderInfo_intervalObj_intervalId_modify").combobox({
					url:"/TimeInterval/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"intervalId",
					textField:"intervalName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#orderInfo_intervalObj_intervalId_modify").combobox("select", orderInfo.intervalObjPri);
						//var data = $("#orderInfo_intervalObj_intervalId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#orderInfo_intervalObj_intervalId_edit").combobox("select", data[0].intervalId);
						//}
					}
				});
				$("#orderInfo_totalMoney_modify").val(orderInfo.totalMoney);
				$("#orderInfo_totalMoney_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入订单总金额",
					invalidMessage : "订单总金额输入不对",
				});
				$("#orderInfo_payWayObj_payWayId_modify").combobox({
					url:"/PayWay/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"payWayId",
					textField:"payWayName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#orderInfo_payWayObj_payWayId_modify").combobox("select", orderInfo.payWayObjPri);
						//var data = $("#orderInfo_payWayObj_payWayId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#orderInfo_payWayObj_payWayId_edit").combobox("select", data[0].payWayId);
						//}
					}
				});
				$("#orderInfo_payAccount_modify").val(orderInfo.payAccount);
				$("#orderInfo_payAccount_modify").validatebox({
					required : true,
					missingMessage : "请输入支付账号",
				});
				$("#orderInfo_orderStateObj_modify").val(orderInfo.orderStateObj);
				$("#orderInfo_orderStateObj_modify").validatebox({
					required : true,
					missingMessage : "请输入订单状态",
				});
				$("#orderInfo_orderTime_modify").val(orderInfo.orderTime);
				$("#orderInfo_receiveName_modify").val(orderInfo.receiveName);
				$("#orderInfo_receiveName_modify").validatebox({
					required : true,
					missingMessage : "请输入收货人",
				});
				$("#orderInfo_telephone_modify").val(orderInfo.telephone);
				$("#orderInfo_telephone_modify").validatebox({
					required : true,
					missingMessage : "请输入收货人电话",
				});
				$("#orderInfo_address_modify").val(orderInfo.address);
				$("#orderInfo_address_modify").validatebox({
					required : true,
					missingMessage : "请输入收货人地址",
				});
				$("#orderInfo_orderMemo_modify").val(orderInfo.orderMemo);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#orderInfoModifyButton").click(function(){ 
		if ($("#orderInfoModifyForm").form("validate")) {
			$("#orderInfoModifyForm").form({
			    url:"OrderInfo/update/" + $("#orderInfo_orderNo_modify").val(),
			    onSubmit: function(){
					if($("#orderInfoEditForm").form("validate"))  {
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
			$("#orderInfoModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
