var placeType_manage_tool = null; 
$(function () { 
	initPlaceTypeManageTool(); //建立PlaceType管理对象
	placeType_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#placeType_manage").datagrid({
		url : '/PlaceType/list',
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
		sortName : "placeTypeId",
		sortOrder : "desc",
		toolbar : "#placeType_manage_tool",
		columns : [[
			{
				field : "placeTypeId",
				title : "会议室类型id",
				width : 70,
			},
			{
				field : "placeTypeName",
				title : "会议室类型名称",
				width : 140,
			},
		]],
	});

	$("#placeTypeEditDiv").dialog({
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
				if ($("#placeTypeEditForm").form("validate")) {
					//验证表单 
					if(!$("#placeTypeEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#placeTypeEditForm").form({
						    url:"/PlaceType/update/" + $("#placeType_placeTypeId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#placeTypeEditDiv").dialog("close");
			                        placeType_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#placeTypeEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#placeTypeEditDiv").dialog("close");
				$("#placeTypeEditForm").form("reset"); 
			},
		}],
	});
});

function initPlaceTypeManageTool() {
	placeType_manage_tool = {
		init: function() {
		},
		reload : function () {
			$("#placeType_manage").datagrid("reload");
		},
		redo : function () {
			$("#placeType_manage").datagrid("unselectAll");
		},
		search: function() {
			$("#placeType_manage").datagrid("options").queryParams=queryParams; 
			$("#placeType_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#placeTypeQueryForm").form({
			    url:"/PlaceType/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#placeTypeQueryForm").submit();
		},
		remove : function () {
			var rows = $("#placeType_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var placeTypeIds = [];
						for (var i = 0; i < rows.length; i ++) {
							placeTypeIds.push(rows[i].placeTypeId);
						}
						$.ajax({
							type : "POST",
							url : "/PlaceType/deletes",
							data : {
								placeTypeIds : placeTypeIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#placeType_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#placeType_manage").datagrid("loaded");
									$("#placeType_manage").datagrid("load");
									$("#placeType_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#placeType_manage").datagrid("loaded");
									$("#placeType_manage").datagrid("load");
									$("#placeType_manage").datagrid("unselectAll");
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
			var rows = $("#placeType_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/PlaceType/update/" + rows[0].placeTypeId,
					type : "get",
					data : {
						//placeTypeId : rows[0].placeTypeId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (placeType, response, status) {
						$.messager.progress("close");
						if (placeType) { 
							$("#placeTypeEditDiv").dialog("open");
							$("#placeType_placeTypeId_edit").val(placeType.placeTypeId);
							$("#placeType_placeTypeId_edit").validatebox({
								required : true,
								missingMessage : "请输入会议室类型id",
								editable: false
							});
							$("#placeType_placeTypeName_edit").val(placeType.placeTypeName);
							$("#placeType_placeTypeName_edit").validatebox({
								required : true,
								missingMessage : "请输入会议室类型名称",
							});
							$("#placeType_placeTypeDesc_edit").val(placeType.placeTypeDesc);
							$("#placeType_placeTypeDesc_edit").validatebox({
								required : true,
								missingMessage : "请输入会议室类型说明",
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
