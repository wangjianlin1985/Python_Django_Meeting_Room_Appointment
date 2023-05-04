from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.TimeInterval.models import TimeInterval
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台时段添加
    def get(self,request):

        # 使用模板
        return render(request, 'TimeInterval/timeInterval_frontAdd.html')

    def post(self, request):
        timeInterval = TimeInterval() # 新建一个时段对象然后获取参数
        timeInterval.intervalName = request.POST.get('timeInterval.intervalName')
        timeInterval.product = float(request.POST.get('timeInterval.product'))
        timeInterval.save() # 保存时段信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改时段
    def get(self, request, intervalId):
        context = {'intervalId': intervalId}
        return render(request, 'TimeInterval/timeInterval_frontModify.html', context)


class FrontListView(BaseView):  # 前台时段查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        # 然后条件组合查询过滤
        timeIntervals = TimeInterval.objects.all()
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(timeIntervals, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        timeIntervals_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'timeIntervals_page': timeIntervals_page,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'TimeInterval/timeInterval_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示时段详情页
    def get(self, request, intervalId):
        # 查询需要显示的时段对象
        timeInterval = TimeInterval.objects.get(intervalId=intervalId)
        context = {
            'timeInterval': timeInterval
        }
        # 渲染模板显示
        return render(request, 'TimeInterval/timeInterval_frontshow.html', context)


class ListAllView(View): # 前台查询所有时段
    def get(self,request):
        timeIntervals = TimeInterval.objects.all()
        timeIntervalList = []
        for timeInterval in timeIntervals:
            timeIntervalObj = {
                'intervalId': timeInterval.intervalId,
                'intervalName': timeInterval.intervalName,
            }
            timeIntervalList.append(timeIntervalObj)
        return JsonResponse(timeIntervalList, safe=False)


class UpdateView(BaseView):  # Ajax方式时段更新
    def get(self, request, intervalId):
        # GET方式请求查询时段对象并返回时段json格式
        timeInterval = TimeInterval.objects.get(intervalId=intervalId)
        return JsonResponse(timeInterval.getJsonObj())

    def post(self, request, intervalId):
        # POST方式提交时段修改信息更新到数据库
        timeInterval = TimeInterval.objects.get(intervalId=intervalId)
        timeInterval.intervalName = request.POST.get('timeInterval.intervalName')
        timeInterval.product = float(request.POST.get('timeInterval.product'))
        timeInterval.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台时段添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'TimeInterval/timeInterval_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        timeInterval = TimeInterval() # 新建一个时段对象然后获取参数
        timeInterval.intervalName = request.POST.get('timeInterval.intervalName')
        timeInterval.product = float(request.POST.get('timeInterval.product'))
        timeInterval.save() # 保存时段信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新时段
    def get(self, request, intervalId):
        context = {'intervalId': intervalId}
        return render(request, 'TimeInterval/timeInterval_modify.html', context)


class ListView(BaseView):  # 后台时段列表
    def get(self, request):
        # 使用模板
        return render(request, 'TimeInterval/timeInterval_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        # 然后条件组合查询过滤
        timeIntervals = TimeInterval.objects.all()
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(timeIntervals, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        timeIntervals_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        timeIntervalList = []
        for timeInterval in timeIntervals_page:
            timeInterval = timeInterval.getJsonObj()
            timeIntervalList.append(timeInterval)
        # 构造模板页面需要的参数
        timeInterval_res = {
            'rows': timeIntervalList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(timeInterval_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除时段信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        intervalIds = self.getStrParam(request, 'intervalIds')
        intervalIds = intervalIds.split(',')
        count = 0
        try:
            for intervalId in intervalIds:
                TimeInterval.objects.get(intervalId=intervalId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出时段信息到excel并下载
    def get(self, request):
        # 收集查询参数
        # 然后条件组合查询过滤
        timeIntervals = TimeInterval.objects.all()
        #将查询结果集转换成列表
        timeIntervalList = []
        for timeInterval in timeIntervals:
            timeInterval = timeInterval.getJsonObj()
            timeIntervalList.append(timeInterval)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(timeIntervalList)
        # 设置要导入到excel的列
        columns_map = {
            'intervalId': '时段id',
            'intervalName': '时段名称',
            'product': '商品数量',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'timeIntervals.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="timeIntervals.xlsx"'
        return response

