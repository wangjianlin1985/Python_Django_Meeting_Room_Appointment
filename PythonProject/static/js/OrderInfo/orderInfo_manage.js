var orderInfo_manage_tool = null; 
$(function () { 
	initOrderInfoManageTool(); //建立OrderInfo管理对象
	orderInfo_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#orderInfo_manage").datagrid({
		url : '/OrderInfo/list',
		queryParams: {
			"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		},
		fit : true,
		fitColumns : true,
		striped : true,
		rownumbers : true,
		border : false,
		pagination : true,
		pageSize : 5,
		pageList : [5, 10, 15, 20, 25],
		pageNumber : 1,
		sortName : "orderNo",
		sortOrder : "desc",
		toolbar : "#orderInfo_manage_tool",
		columns : [[
			{
				field : "orderNo",
				title : "订单编号",
				width : 70,
			},
			{
				field : "userObj",
				title : "下单用户",
				width : 140,
			},
			{
				field : "placeObj",
				title : "预约会议室",
				width : 140,
			},
			{
				field : "orderDate",
				title : "预定日期",
				width : 140,
			},
			{
				field : "intervalObj",
				title : "预约时段",
				width : 140,
			},
			{
				field : "totalMoney",
				title : "订单总金额",
				width : 70,
			},
			{
				field : "payWayObj",
				title : "支付方式",
				width : 140,
			},
			{
				field : "payAccount",
				title : "支付账号",
				width : 140,
			},
			{
				field : "orderStateObj",
				title : "订单状态",
				width : 140,
			},
			{
				field : "orderTime",
				title : "下单时间",
				width : 140,
			},
			/*
			{
				field : "receiveName",
				title : "收货人",
				width : 140,
			},
			{
				field : "telephone",
				title : "收货人电话",
				width : 140,
			},*/
		]],
	});

	$("#orderInfoEditDiv").dialog({
		title : "修改管理",
		top: "50px",
		width : 700,
		height : 515,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#orderInfoEditForm").form("validate")) {
					//验证表单 
					if(!$("#orderInfoEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#orderInfoEditForm").form({
						    url:"/OrderInfo/update/" + $("#orderInfo_orderNo_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#orderInfoEditDiv").dialog("close");
			                        orderInfo_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#orderInfoEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#orderInfoEditDiv").dialog("close");
				$("#orderInfoEditForm").form("reset"); 
			},
		}],
	});
});

function initOrderInfoManageTool() {
	orderInfo_manage_tool = {
		init: function() {
			$.ajax({
				url : "/UserInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#userObj_user_name_query").combobox({ 
					    valueField:"user_name",
					    textField:"name",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{user_name:"",name:"不限制"});
					$("#userObj_user_name_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/Place/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#placeObj_placeId_query").combobox({ 
					    valueField:"placeId",
					    textField:"placeName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{placeId:0,placeName:"不限制"});
					$("#placeObj_placeId_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/TimeInterval/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#intervalObj_intervalId_query").combobox({ 
					    valueField:"intervalId",
					    textField:"intervalName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{intervalId:0,intervalName:"不限制"});
					$("#intervalObj_intervalId_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/PayWay/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#payWayObj_payWayId_query").combobox({ 
					    valueField:"payWayId",
					    textField:"payWayName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{payWayId:0,payWayName:"不限制"});
					$("#payWayObj_payWayId_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#orderInfo_manage").datagrid("reload");
		},
		redo : function () {
			$("#orderInfo_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#orderInfo_manage").datagrid("options").queryParams;
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["placeObj.placeId"] = $("#placeObj_placeId_query").combobox("getValue");
			queryParams["orderDate"] = $("#orderDate").datebox("getValue"); 
			queryParams["intervalObj.intervalId"] = $("#intervalObj_intervalId_query").combobox("getValue");
			queryParams["payWayObj.payWayId"] = $("#payWayObj_payWayId_query").combobox("getValue");
			queryParams["payAccount"] = $("#payAccount").val();
			queryParams["orderStateObj"] = $("#orderStateObj").val();
			queryParams["orderTime"] = $("#orderTime").val();
			queryParams["receiveName"] = $("#receiveName").val();
			queryParams["telephone"] = $("#telephone").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#orderInfo_manage").datagrid("options").queryParams=queryParams; 
			$("#orderInfo_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#orderInfoQueryForm").form({
			    url:"/OrderInfo/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#orderInfoQueryForm").submit();
		},
		remove : function () {
			var rows = $("#orderInfo_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var orderNos = [];
						for (var i = 0; i < rows.length; i ++) {
							orderNos.push(rows[i].orderNo);
						}
						$.ajax({
							type : "POST",
							url : "/OrderInfo/deletes",
							data : {
								orderNos : orderNos.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#orderInfo_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#orderInfo_manage").datagrid("loaded");
									$("#orderInfo_manage").datagrid("load");
									$("#orderInfo_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#orderInfo_manage").datagrid("loaded");
									$("#orderInfo_manage").datagrid("load");
									$("#orderInfo_manage").datagrid("unselectAll");
									$.messager.alert("消息",data.message);
								}
							},
						});
					}
				});
			} else {
				$.messager.alert("提示", "请选择要删除的记录！", "info");
			}
		},
		edit : function () {
			var rows = $("#orderInfo_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/OrderInfo/update/" + rows[0].orderNo,
					type : "get",
					data : {
						//orderNo : rows[0].orderNo,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (orderInfo, response, status) {
						$.messager.progress("close");
						if (orderInfo) { 
							$("#orderInfoEditDiv").dialog("open");
							$("#orderInfo_orderNo_edit").val(orderInfo.orderNo);
							$("#orderInfo_orderNo_edit").validatebox({
								required : true,
								missingMessage : "请输入订单编号",
								editable: false
							});
							$("#orderInfo_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#orderInfo_userObj_user_name_edit").combobox("select", orderInfo.userObjPri);
									//var data = $("#orderInfo_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#orderInfo_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#orderInfo_placeObj_placeId_edit").combobox({
								url:"/Place/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"placeId",
							    textField:"placeName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#orderInfo_placeObj_placeId_edit").combobox("select", orderInfo.placeObjPri);
									//var data = $("#orderInfo_placeObj_placeId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#orderInfo_placeObj_placeId_edit").combobox("select", data[0].placeId);
						            //}
								}
							});
							$("#orderInfo_orderDate_edit").datebox({
								value: orderInfo.orderDate,
							    required: true,
							    showSeconds: true,
							});
							$("#orderInfo_intervalObj_intervalId_edit").combobox({
								url:"/TimeInterval/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"intervalId",
							    textField:"intervalName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#orderInfo_intervalObj_intervalId_edit").combobox("select", orderInfo.intervalObjPri);
									//var data = $("#orderInfo_intervalObj_intervalId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#orderInfo_intervalObj_intervalId_edit").combobox("select", data[0].intervalId);
						            //}
								}
							});
							$("#orderInfo_totalMoney_edit").val(orderInfo.totalMoney);
							$("#orderInfo_totalMoney_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入订单总金额",
								invalidMessage : "订单总金额输入不对",
							});
							$("#orderInfo_payWayObj_payWayId_edit").combobox({
								url:"/PayWay/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"payWayId",
							    textField:"payWayName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#orderInfo_payWayObj_payWayId_edit").combobox("select", orderInfo.payWayObjPri);
									//var data = $("#orderInfo_payWayObj_payWayId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#orderInfo_payWayObj_payWayId_edit").combobox("select", data[0].payWayId);
						            //}
								}
							});
							$("#orderInfo_payAccount_edit").val(orderInfo.payAccount);
							$("#orderInfo_payAccount_edit").validatebox({
								required : true,
								missingMessage : "请输入支付账号",
							});
							$("#orderInfo_orderStateObj_edit").val(orderInfo.orderStateObj);
							$("#orderInfo_orderStateObj_edit").validatebox({
								required : true,
								missingMessage : "请输入订单状态",
							});
							$("#orderInfo_orderTime_edit").val(orderInfo.orderTime);
							$("#orderInfo_receiveName_edit").val(orderInfo.receiveName);
							$("#orderInfo_receiveName_edit").validatebox({
								required : true,
								missingMessage : "请输入收货人",
							});
							$("#orderInfo_telephone_edit").val(orderInfo.telephone);
							$("#orderInfo_telephone_edit").validatebox({
								required : true,
								missingMessage : "请输入收货人电话",
							});
							$("#orderInfo_address_edit").val(orderInfo.address);
							$("#orderInfo_address_edit").validatebox({
								required : true,
								missingMessage : "请输入收货人地址",
							});
							$("#orderInfo_orderMemo_edit").val(orderInfo.orderMemo);
						} else {
							$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
						}
					}
				});
			} else if (rows.length == 0) {
				$.messager.alert("警告操作！", "编辑记录至少选定一条数据！", "warning");
			}
		},
	};
}
