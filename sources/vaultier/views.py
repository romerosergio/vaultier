from django.http.response import HttpResponse
from django.shortcuts import render
from django.template.context import Context
from app.settings import FT_FEATURES, BK_FEATURES
import json

def index(request):
    return render(request, 'index.html', Context({
        'FT_FEATURES' : FT_FEATURES,
        'BK_FEATURES' : BK_FEATURES
    }))

def config(request):
    script = json.dumps({
        'FT_FEATURES': FT_FEATURES
    })
    script = 'InitializeConfig = function(app) {  app.Config = Ember.Object.extend('+script+'); }'

    return HttpResponse(script, mimetype='text/javascript')

#def dev_mail(request):
#    context = build_context(Member.objects.filter(status=MemberStatusField.STATUS_INVITED).reverse()[0])
#    plain, html = render_email('mailer/invitation', context)
#    return HttpResponse(html)
