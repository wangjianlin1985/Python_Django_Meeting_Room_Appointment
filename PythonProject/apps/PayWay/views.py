from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.PayWay.models import PayWay
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台支付方式添加
    def get(self,request):

        # 使用模板
        return render(request, 'PayWay/payWay_frontAdd.html')

    def post(self, request):
        payWay = PayWay() # 新建一个支付方式对象然后获取参数
        payWay.payWayName = request.POST.get('payWay.payWayName')
        payWay.save() # 保存支付方式信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改支付方式
    def get(self, request, payWayId):
        context = {'payWayId': payWayId}
        return render(request, 'PayWay/payWay_frontModify.html', context)


class FrontListView(BaseView):  # 前台支付方式查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        # 然后条件组合查询过滤
        payWays = PayWay.objects.all()
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(payWays, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        payWays_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'payWays_page': payWays_page,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'PayWay/payWay_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示支付方式详情页
    def get(self, request, payWayId):
        # 查询需要显示的支付方式对象
        payWay = PayWay.objects.get(payWayId=payWayId)
        context = {
            'payWay': payWay
        }
        # 渲染模板显示
        return render(request, 'PayWay/payWay_frontshow.html', context)


class ListAllView(View): # 前台查询所有支付方式
    def get(self,request):
        payWays = PayWay.objects.all()
        payWayList = []
        for payWay in payWays:
            payWayObj = {
                'payWayId': payWay.payWayId,
                'payWayName': payWay.payWayName,
            }
            payWayList.append(payWayObj)
        return JsonResponse(payWayList, safe=False)


class UpdateView(BaseView):  # Ajax方式支付方式更新
    def get(self, request, payWayId):
        # GET方式请求查询支付方式对象并返回支付方式json格式
        payWay = PayWay.objects.get(payWayId=payWayId)
        return JsonResponse(payWay.getJsonObj())

    def post(self, request, payWayId):
        # POST方式提交支付方式修改信息更新到数据库
        payWay = PayWay.objects.get(payWayId=payWayId)
        payWay.payWayName = request.POST.get('payWay.payWayName')
        payWay.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台支付方式添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'PayWay/payWay_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        payWay = PayWay() # 新建一个支付方式对象然后获取参数
        payWay.payWayName = request.POST.get('payWay.payWayName')
        payWay.save() # 保存支付方式信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新支付方式
    def get(self, request, payWayId):
        context = {'payWayId': payWayId}
        return render(request, 'PayWay/payWay_modify.html', context)


class ListView(BaseView):  # 后台支付方式列表
    def get(self, request):
        # 使用模板
        return render(request, 'PayWay/payWay_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        # 然后条件组合查询过滤
        payWays = PayWay.objects.all()
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(payWays, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        payWays_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        payWayList = []
        for payWay in payWays_page:
            payWay = payWay.getJsonObj()
            payWayList.append(payWay)
        # 构造模板页面需要的参数
        payWay_res = {
            'rows': payWayList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(payWay_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除支付方式信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        payWayIds = self.getStrParam(request, 'payWayIds')
        payWayIds = payWayIds.split(',')
        count = 0
        try:
            for payWayId in payWayIds:
                PayWay.objects.get(payWayId=payWayId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出支付方式信息到excel并下载
    def get(self, request):
        # 收集查询参数
        # 然后条件组合查询过滤
        payWays = PayWay.objects.all()
        #将查询结果集转换成列表
        payWayList = []
        for payWay in payWays:
            payWay = payWay.getJsonObj()
            payWayList.append(payWay)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(payWayList)
        # 设置要导入到excel的列
        columns_map = {
            'payWayId': '支付方式id',
            'payWayName': '支付方式名称',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'payWays.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="payWays.xlsx"'
        return response

