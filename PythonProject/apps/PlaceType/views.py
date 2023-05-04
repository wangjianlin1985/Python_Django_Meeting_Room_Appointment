from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.PlaceType.models import PlaceType
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台会议室类型添加
    def get(self,request):

        # 使用模板
        return render(request, 'PlaceType/placeType_frontAdd.html')

    def post(self, request):
        placeType = PlaceType() # 新建一个会议室类型对象然后获取参数
        placeType.placeTypeName = request.POST.get('placeType.placeTypeName')
        placeType.placeTypeDesc = request.POST.get('placeType.placeTypeDesc')
        placeType.save() # 保存会议室类型信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改会议室类型
    def get(self, request, placeTypeId):
        context = {'placeTypeId': placeTypeId}
        return render(request, 'PlaceType/placeType_frontModify.html', context)


class FrontListView(BaseView):  # 前台会议室类型查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        # 然后条件组合查询过滤
        placeTypes = PlaceType.objects.all()
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(placeTypes, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        placeTypes_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'placeTypes_page': placeTypes_page,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'PlaceType/placeType_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示会议室类型详情页
    def get(self, request, placeTypeId):
        # 查询需要显示的会议室类型对象
        placeType = PlaceType.objects.get(placeTypeId=placeTypeId)
        context = {
            'placeType': placeType
        }
        # 渲染模板显示
        return render(request, 'PlaceType/placeType_frontshow.html', context)


class ListAllView(View): # 前台查询所有会议室类型
    def get(self,request):
        placeTypes = PlaceType.objects.all()
        placeTypeList = []
        for placeType in placeTypes:
            placeTypeObj = {
                'placeTypeId': placeType.placeTypeId,
                'placeTypeName': placeType.placeTypeName,
            }
            placeTypeList.append(placeTypeObj)
        return JsonResponse(placeTypeList, safe=False)


class UpdateView(BaseView):  # Ajax方式会议室类型更新
    def get(self, request, placeTypeId):
        # GET方式请求查询会议室类型对象并返回会议室类型json格式
        placeType = PlaceType.objects.get(placeTypeId=placeTypeId)
        return JsonResponse(placeType.getJsonObj())

    def post(self, request, placeTypeId):
        # POST方式提交会议室类型修改信息更新到数据库
        placeType = PlaceType.objects.get(placeTypeId=placeTypeId)
        placeType.placeTypeName = request.POST.get('placeType.placeTypeName')
        placeType.placeTypeDesc = request.POST.get('placeType.placeTypeDesc')
        placeType.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台会议室类型添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'PlaceType/placeType_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        placeType = PlaceType() # 新建一个会议室类型对象然后获取参数
        placeType.placeTypeName = request.POST.get('placeType.placeTypeName')
        placeType.placeTypeDesc = request.POST.get('placeType.placeTypeDesc')
        placeType.save() # 保存会议室类型信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新会议室类型
    def get(self, request, placeTypeId):
        context = {'placeTypeId': placeTypeId}
        return render(request, 'PlaceType/placeType_modify.html', context)


class ListView(BaseView):  # 后台会议室类型列表
    def get(self, request):
        # 使用模板
        return render(request, 'PlaceType/placeType_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        # 然后条件组合查询过滤
        placeTypes = PlaceType.objects.all()
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(placeTypes, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        placeTypes_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        placeTypeList = []
        for placeType in placeTypes_page:
            placeType = placeType.getJsonObj()
            placeTypeList.append(placeType)
        # 构造模板页面需要的参数
        placeType_res = {
            'rows': placeTypeList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(placeType_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除会议室类型信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        placeTypeIds = self.getStrParam(request, 'placeTypeIds')
        placeTypeIds = placeTypeIds.split(',')
        count = 0
        try:
            for placeTypeId in placeTypeIds:
                PlaceType.objects.get(placeTypeId=placeTypeId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出会议室类型信息到excel并下载
    def get(self, request):
        # 收集查询参数
        # 然后条件组合查询过滤
        placeTypes = PlaceType.objects.all()
        #将查询结果集转换成列表
        placeTypeList = []
        for placeType in placeTypes:
            placeType = placeType.getJsonObj()
            placeTypeList.append(placeType)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(placeTypeList)
        # 设置要导入到excel的列
        columns_map = {
            'placeTypeId': '会议室类型id',
            'placeTypeName': '会议室类型名称',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'placeTypes.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="placeTypes.xlsx"'
        return response

