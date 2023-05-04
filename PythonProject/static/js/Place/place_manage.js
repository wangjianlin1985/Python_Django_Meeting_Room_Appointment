var place_manage_tool = null; 
$(function () { 
	initPlaceManageTool(); //建立Place管理对象
	place_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#place_manage").datagrid({
		url : '/Place/list',
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
		sortName : "placeId",
		sortOrder : "desc",
		toolbar : "#place_manage_tool",
		columns : [[
			{
				field : "placeId",
				title : "会议室id",
				width : 70,
			},
			{
				field : "placeTypeObj",
				title : "会议室类型",
				width : 140,
			},
			{
				field : "placeName",
				title : "会议室名称",
				width : 140,
			},
			{
				field : "placePhoto",
				title : "会议室照片",
				width : "70px",
				height: "65px",
				formatter: function(val,row) {
					return "<img src='" + val + "' width='65px' height='55px' />";
				}
 			},
			{
				field : "personNum",
				title : "容纳人数",
				width : 70,
			},
			{
				field : "placeLocation",
				title : "会议室位置",
				width : 140,
			},
			{
				field : "price",
				title : "会议室单价",
				width : 70,
			},
			{
				field : "addTime",
				title : "发布时间",
				width : 140,
			},
		]],
	});

	$("#placeEditDiv").dialog({
		title : "修改管理",
		top: "10px",
		width : 1000,
		height : 600,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#placeEditForm").form("validate")) {
					//验证表单 
					if(!$("#placeEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#placeEditForm").form({
						    url:"/Place/update/" + $("#place_placeId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#placeEditDiv").dialog("close");
			                        place_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#placeEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#placeEditDiv").dialog("close");
				$("#placeEditForm").form("reset"); 
			},
		}],
	});
});

function initPlaceManageTool() {
	place_manage_tool = {
		init: function() {
			$.ajax({
				url : "/PlaceType/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#placeTypeObj_placeTypeId_query").combobox({ 
					    valueField:"placeTypeId",
					    textField:"placeTypeName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{placeTypeId:0,placeTypeName:"不限制"});
					$("#placeTypeObj_placeTypeId_query").combobox("loadData",data); 
				}
			});
			//实例化编辑器
			tinyMCE.init({
				selector: "#place_placeDesc_edit",
				theme: 'advanced',
				language: "zh",
				strict_loading_mode: 1,
			});
		},
		reload : function () {
			$("#place_manage").datagrid("reload");
		},
		redo : function () {
			$("#place_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#place_manage").datagrid("options").queryParams;
			queryParams["placeTypeObj.placeTypeId"] = $("#placeTypeObj_placeTypeId_query").combobox("getValue");
			queryParams["placeName"] = $("#placeName").val();
			queryParams["placeLocation"] = $("#placeLocation").val();
			queryParams["addTime"] = $("#addTime").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#place_manage").datagrid("options").queryParams=queryParams; 
			$("#place_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#placeQueryForm").form({
			    url:"/Place/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#placeQueryForm").submit();
		},
		remove : function () {
			var rows = $("#place_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var placeIds = [];
						for (var i = 0; i < rows.length; i ++) {
							placeIds.push(rows[i].placeId);
						}
						$.ajax({
							type : "POST",
							url : "/Place/deletes",
							data : {
								placeIds : placeIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#place_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#place_manage").datagrid("loaded");
									$("#place_manage").datagrid("load");
									$("#place_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#place_manage").datagrid("loaded");
									$("#place_manage").datagrid("load");
									$("#place_manage").datagrid("unselectAll");
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
			var rows = $("#place_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Place/update/" + rows[0].placeId,
					type : "get",
					data : {
						//placeId : rows[0].placeId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (place, response, status) {
						$.messager.progress("close");
						if (place) { 
							$("#placeEditDiv").dialog("open");
							$("#place_placeId_edit").val(place.placeId);
							$("#place_placeId_edit").validatebox({
								required : true,
								missingMessage : "请输入会议室id",
								editable: false
							});
							$("#place_placeTypeObj_placeTypeId_edit").combobox({
								url:"/PlaceType/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"placeTypeId",
							    textField:"placeTypeName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#place_placeTypeObj_placeTypeId_edit").combobox("select", place.placeTypeObjPri);
									//var data = $("#place_placeTypeObj_placeTypeId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#place_placeTypeObj_placeTypeId_edit").combobox("select", data[0].placeTypeId);
						            //}
								}
							});
							$("#place_placeName_edit").val(place.placeName);
							$("#place_placeName_edit").validatebox({
								required : true,
								missingMessage : "请输入会议室名称",
							});
							$("#place_placePhotoImg").attr("src", place.placePhoto);
							$("#place_personNum_edit").val(place.personNum);
							$("#place_personNum_edit").validatebox({
								required : true,
								validType : "integer",
								missingMessage : "请输入容纳人数",
								invalidMessage : "容纳人数输入不对",
							});
							$("#place_placeLocation_edit").val(place.placeLocation);
							$("#place_placeLocation_edit").validatebox({
								required : true,
								missingMessage : "请输入会议室位置",
							});
							$("#place_price_edit").val(place.price);
							$("#place_price_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入会议室单价",
								invalidMessage : "会议室单价输入不对",
							});
							tinyMCE.editors['place_placeDesc_edit'].setContent(place.placeDesc);
							$("#place_addTime_edit").datetimebox({
								value: place.addTime,
							    required: true,
							    showSeconds: true,
							});
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
