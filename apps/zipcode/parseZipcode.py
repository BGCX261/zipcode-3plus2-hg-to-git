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

    file = open(filename)
    i = 0
    while 1:
        row = unicode(file.readline()[:-1])
        if not row: break
        i += 1

        code5, code3, county, district, kind = \
            re.match('^((...)..)(...)([^ ]+) +([^ ].*)$', row).groups()

        try:
            if (code3, district) not in HO600_COUNTY[county]:
                HO600_COUNTY[county].append((code3, district))
        except KeyError:
            HO600_COUNTY[county] = [(code3, district)]

        print code3,
        print code5,
        print county,
        print district,
        print kind

        if i > 10: break

    print HO600_COUNTY


if __name__ == '__main__':
    import sys
    import os
    filename = sys.argv[1]
    export_dir = (sys.argv[2] if len(sys.argv) > 2 and os.path.isdir(sys.argv[2])
        else os.path.join(os.path.dirname(__file__), 'media', 'zipcode'))

    run(filename, export_dir)