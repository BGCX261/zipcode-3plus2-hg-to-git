#!/usr/bin/env python
# -*- coding: utf8 -*-

# Copyright (c) 2010, ho600.com
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without modification,
# are permitted provided that the following conditions are met:
#
#     Redistributions of source code must retain the above copyright notice,
#     this list of conditions and the following disclaimer.
#
#     Redistributions in binary form must
#     reproduce the above copyright notice, this list of conditions and the
#     following disclaimer in the documentation and/or other materials provided
#     with the distribution.
#
#     Neither the name of the ho600.com nor the names of its contributors
#     may be used to endorse or promote products derived from this software
#     without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
# IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
# INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
# BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
# OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
# NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
# EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"""
    parse zip32.txt file to get the variables, and export to js file.
"""
import re
from django.utils import simplejson as json

def run(filename, export_dir):
    HO600_COUNTY = {}
    HO600_DISTRICT = {}
    HO600_KIND = {}

    file = open(filename)
    i = 0
    while 1:
        row = unicode(file.readline()[:-1])
        if not row: break
        i += 1

        row = row.replace('  ', ' ').replace('\r', '')

        try:
            code3, code2, county, district, street, kind = \
                re.match('^(...)(..)(...)(....)(...........)(.*)$', row).groups()
        except AttributeError:
            print row
            sys.exit()
        else:
            district = district.replace(' ', '')
            street = street.replace(' ', '')
            kind = re.sub(' +$', '', kind)
#        print code3+':',
#        print code2+':',
#        print county+':',
#        print district+':',
#        print street+':',
#        print kind


        try:
            if (code3, district) not in HO600_COUNTY[county]:
                HO600_COUNTY[county].append((code3, district))
        except KeyError:
            HO600_COUNTY[county] = [(code3, district)]

        try:
            if street not in HO600_DISTRICT[code3]:
                HO600_DISTRICT[code3].append(street)
        except KeyError:
            HO600_DISTRICT[code3] = [street]

        try:
            if (code2, kind) not in HO600_KIND['%s%s'%(code3, street)]:
                HO600_KIND['%s%s'%(code3, street)].append([code2, kind])
        except KeyError:
            HO600_KIND['%s%s'%(code3, street)] = [[code2, kind]]

        #if i > 10: break

#    print 'HO600_COUNTY:'
#    for k, v in HO600_COUNTY.items():
#        print '\t', k, v
#    print 'HO600_DISTRICT:'
#    for k, v in HO600_DISTRICT.items():
#        print '\t', k, v
#    print 'HO600_KIND:'
#    for k, v in HO600_KIND.items():
#        print '\t', k, v

    content = json.dumps(HO600_COUNTY)
    for word in set(re.findall('\u([0-9a-f][0-9a-f][0-9a-f][0-9a-f])', content)):
        content = content.replace(r'\u'+word, eval(r"u'\u"+word+"'"))
    file = open(os.path.join(export_dir, 'ho600_county.js'), 'w')
    content = content.replace(' ', '')
    county_content = 'var HO600_COUNTY=%s;\n' % content
    file.write(county_content)
    file.close()

    content = json.dumps(HO600_DISTRICT)
    for word in set(re.findall('\u([0-9a-f][0-9a-f][0-9a-f][0-9a-f])', content)):
        content = content.replace(r'\u'+word, eval(r"u'\u"+word+"'"))
    file = open(os.path.join(export_dir, 'ho600_district.js'), 'w')
    content = content.replace(' ', '')
    district_content = 'var HO600_DISTRICT=%s;\n' % content
    file.write(district_content)
    file.close()

    content = json.dumps(HO600_KIND)
    for word in set(re.findall('\u([0-9a-f][0-9a-f][0-9a-f][0-9a-f])', content)):
        content = content.replace(r'\u'+word, eval(r"u'\u"+word+"'"))
    file = open(os.path.join(export_dir, 'ho600_kind.js'), 'w')
    content = content.replace(' ', '')
    kind_content = 'var HO600_KIND=%s;\n' % content
    file.write(kind_content)
    file.close()

    #operation_file = open(os.path.join(export_dir, 'ho600_zipcode_operation.js'))

    file = open(os.path.join(export_dir, 'ho600_zipcode.js'), 'w')
    file.write(county_content)
    file.write(district_content)
    file.write(kind_content)
    #file.write('\n'+operation_file.read())
    file.close()

    print 'done'


if __name__ == '__main__':
    import sys
    import os
    filename = sys.argv[1]
    export_dir = (sys.argv[2] if len(sys.argv) > 2 and os.path.isdir(sys.argv[2])
        else os.path.join(os.path.dirname(__file__), 'media'))

    run(filename, export_dir)
