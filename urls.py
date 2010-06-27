#-*- coding:utf8 -*-
# Copyright 2008 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import include
from django.conf.urls.defaults import handler404
from django.conf.urls.defaults import handler500

urlpatterns = patterns('',
    # Example:
    # (r'^foo/', include('foo.urls')),
    #(r'^$', 'apps.requestticket.views.test'),
    #(r'^gaebar/', include('gaebar.urls')), # gaebar 並未在 hg 中，所以有的機器有這個模組，而有的沒有。會造成執行時期出錯

    (r'^originpatent/', include('apps.originpatent.urls')), # custom
    (r'^OP/', include('apps.originpatent.urls')),                  # custom

    (r'^requestticket/', include('apps.requestticket.urls')),
    (r'^RT/', include('apps.requestticket.urls')),
    (r'^authuser/', include('apps.authuser.urls')),
    (r'^AU/', include('apps.authuser.urls')),
    (r'^appcommon/', include('apps.appcommon.urls')),
    (r'^AC/', include('apps.appcommon.urls')),
    (r'^management/', include('apps.management.urls')),
    (r'^MG/', include('apps.management.urls')),

    (r'^', include('apps.originpatent.urls')),                       # custom

    (r'^Danger/Flush/$', 'danger_command.Flush'),
    (r'^Danger/LoadData/$', 'danger_command.LoadData'),
    (r'^Danger/LoadTestData/$', 'danger_command.LoadTestData'),

    (r'^Upgrade/$', 'upgrade_data.Upgrade'),
    (r'^FixData/$', 'upgrade_data.FixData'),

    # Uncomment this for admin:
#     (r'^admin/', include('django.contrib.admin.urls')),
)

# 自定錯誤頁面
#handler404 = 'django.views.defaults.page_not_found'
handler404 = 'apps.appcommon.views.notFoundPage' # 當 DEBUG == False, 才會啟用
#handler500 = 'django.views.defaults.server_error'
handler500 = 'apps.appcommon.views.recordErrorPage' # 當 DEBUG == False, 才會啟用
