function compareAllChildren (re, obj) {
    for(var i=0; i<obj.childNodes.length; i++) {
        if (re.test(obj.childNodes[i].className)) {
            return obj.childNodes[i];
        } else {
            var res = compareAllChildren(re, obj.childNodes[i]);
            if (res) {
                return res;
            }
        }
    }
}

function getElementByClassName(classname, node)  {
    // only want the first one.
    var re = new RegExp('\\b' + classname + '\\b');
    if (re.test(node.className)) {
        return node;
    } else {
        var res = compareAllChildren(re, node);
        return res;
    }
}

function getElementsByClassName(classname, node)  {
    if(!node) {
        node = document.getElementsByTagName("body")[0];
    }
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for(var i=0; i<els.length; i++) {
        if(re.test(els[i].className)) {
            a.push(els[i]);
        }
    }
    return a;
}

function selectCountys (node) {
    return function() {
        var county = this.value;
        var districts = HO600_COUNTY[county];
        var $district = getElementByClassName('districts', node);
        $district.length = 0;
        for (var i=0; i<districts.length; i++) {
            $district.options.add(new Option(districts[i][1]+'('+districts[i][0]+')', districts[i][0]));
        }

        if ($district.actb_obj && $district.actb_obj.actb_keywords){
            $district.actb_obj.actb_keywords = HO600_DISTRICT[$district.value];
        }

        updateAddress(node);
    }
}

function selectDistricts (node) {
    return function () {
        var district = this.value;
        var $street = getElementByClassName('street', node);
        var $kind = getElementByClassName('kinds', node);
        var $number = getElementByClassName('number', node);

        this.actb_obj.actb_keywords = HO600_DISTRICT[district];

        $street.value = '';
        $kind.length = 0;
        $number.value = '';

        updateAddress(node);
    }
}

function removeKinds (node) {
    return function () {
        var $street = this;
        if($street.length == 0){
            var $kind = getElementByClassName('kinds', node);
            $kind.length = 0;
        }
    }
}

function createKinds (node) {
    return function () {
        var $kind = this;
        var $district = getElementByClassName('districts', node);
        var $street = getElementByClassName('street', node);

        if ($street.value == '') {
            return false;
        }

        $street.value = $street.value.replace(/ /g, '');

        if (! HO600_KIND[$district.value+$street.value]) {
            $kind.length = 0;
            $kind.options.add(new Option('未存在的路街名', ''));
            return false;
        }

        var list = HO600_KIND[$district.value+$street.value];
        if ($kind.options.length > 0 && list[0][0] == $kind.options[0].value) {
            return false;
        } else {
            $kind.length = 0;
            for (var i=0; i<list.length; i++) {
                $kind.options.add(new Option(list[i][1]+'('+$district.value+list[i][0]+')', list[i][0]));
            }

            updateAddress(node);
        }
    }
}

function selectKinds (node) {
    return function () {
        updateAddress(node);
    }
}

function typeNumber (node) {
    return function () {
        updateAddress(node);
    }
}

function reset (node) {
    return function () {
        var $street = getElementByClassName('street', node);
        $street.value = '';
        var $kind = getElementByClassName('kinds', node);
        $kind.length = 0;
        var $number = getElementByClassName('number', node);
        $number.value = '';

        updateAddress(node);
    }
}

function allReset (node) {
    return function () {
        var $county = getElementByClassName('countys', node);
        $county.value = '台北市';
        var $district = getElementByClassName('districts', node);
        $district.length = 0;
        var districts = [["100", "中正區"], ["103", "大同區"],
            ["104", "中山區"], ["105", "松山區"], ["106", "大安區"],
            ["108", "萬華區"], ["110", "信義區"], ["111", "士林區"],
            ["112", "北投區"], ["114", "內湖區"], ["115", "南港區"],
            ["116", "文山區"]];
        for (var i=0; i<districts.length; i++) {
            $district.options.add(new Option(districts[i][1]+'('+districts[i][0]+')', districts[i][0]));
        }
        var $street = getElementByClassName('street', node);
        $street.value = '';
        var $kind = getElementByClassName('kinds', node);
        $kind.length = 0;
        var $number = getElementByClassName('number', node);
        $number.value = '';

        updateAddress(node);
    }
}

function updateAddress (node) {
    var $county = getElementByClassName('countys', node);
    var county = $county.value;
    var $district = getElementByClassName('districts', node);
    var district = $district.options[$district.selectedIndex].text;
    district = district.replace(/\(.*\)/, '');

    var $street = getElementByClassName('street', node);
    var street = $street.value;

    var $number = getElementByClassName('number', node);
    var number = $number.value;

    var $zipcode = getElementByClassName('zipcode', node);
    var $kind = getElementByClassName('kinds', node);
    $zipcode.innerHTML = $district.value + $kind.value;

    var $address = getElementByClassName('address', node);
    if (street) {
        if (number) {
            $address.innerHTML = county + ' ' + district + ' ' + street + ' ' + number;
        } else {
            $address.innerHTML = county + ' ' + district + ' ' + street;
        }
    } else {
        $address.innerHTML = county + ' ' + district;
    }

    var $zipcode_address = getElementByClassName('zipcode_address', node);
    $zipcode_address.innerHTML = $zipcode.innerHTML + ' ' + $address.innerHTML;
}

function writeHo600ZipcodeDIV (classname) {
    if(!classname) classname = '';
    
    var html = '';
    html += '%3Cdiv class="ho600 '+ classname + '"%3E';
    html += '    %3Cselect class="countys"%3E';
    html += '        %3Coption value="台北市"%3E台北市%3C/option%3E';
    html += '        %3Coption value="基隆市"%3E基隆市%3C/option%3E';
    html += '        %3Coption value="台北縣"%3E台北縣%3C/option%3E';
    html += '        %3Coption value="桃園縣"%3E桃園縣%3C/option%3E';
    html += '        %3Coption value="新竹市"%3E新竹市%3C/option%3E';
    html += '        %3Coption value="新竹縣"%3E新竹縣%3C/option%3E';
    html += '        %3Coption value="苗栗縣"%3E苗栗縣%3C/option%3E';
    html += '        %3Coption value="台中市"%3E台中市%3C/option%3E';
    html += '        %3Coption value="台中縣"%3E台中縣%3C/option%3E';
    html += '        %3Coption value="彰化縣"%3E彰化縣%3C/option%3E';
    html += '        %3Coption value="南投縣"%3E南投縣%3C/option%3E';
    html += '        %3Coption value="雲林縣"%3E雲林縣%3C/option%3E';
    html += '        %3Coption value="嘉義市"%3E嘉義市%3C/option%3E';
    html += '        %3Coption value="嘉義縣"%3E嘉義縣%3C/option%3E';
    html += '        %3Coption value="台南市"%3E台南市%3C/option%3E';
    html += '        %3Coption value="台南縣"%3E台南縣%3C/option%3E';
    html += '        %3Coption value="高雄市"%3E高雄市%3C/option%3E';
    html += '        %3Coption value="高雄縣"%3E高雄縣%3C/option%3E';
    html += '        %3Coption value="屏東縣"%3E屏東縣%3C/option%3E';
    html += '        %3Coption value="宜蘭縣"%3E宜蘭縣%3C/option%3E';
    html += '        %3Coption value="花蓮縣"%3E花蓮縣%3C/option%3E';
    html += '        %3Coption value="台東縣"%3E台東縣%3C/option%3E';
    html += '        %3Coption value="澎湖縣"%3E澎湖縣%3C/option%3E';
    html += '        %3Coption value="金門縣"%3E金門縣%3C/option%3E';
    html += '        %3Coption value="連江縣"%3E連江縣%3C/option%3E';
    html += '        %3Coption value="南海島"%3E南海島%3C/option%3E';
    html += '        %3Coption value="釣魚台"%3E釣魚台%3C/option%3E';
    html += '    %3C/select%3E';
    html += '    %3Cselect class="districts"%3E';
    html += '        %3Coption value="100"%3E中正區(100)%3C/option%3E';
    html += '        %3Coption value="103"%3E大同區(103)%3C/option%3E';
    html += '        %3Coption value="104"%3E中山區(104)%3C/option%3E';
    html += '        %3Coption value="105"%3E松山區(105)%3C/option%3E';
    html += '        %3Coption value="106"%3E大安區(106)%3C/option%3E';
    html += '        %3Coption value="108"%3E萬華區(108)%3C/option%3E';
    html += '        %3Coption value="110"%3E信義區(110)%3C/option%3E';
    html += '        %3Coption value="111"%3E士林區(111)%3C/option%3E';
    html += '        %3Coption value="112"%3E北投區(112)%3C/option%3E';
    html += '        %3Coption value="114"%3E內湖區(114)%3C/option%3E';
    html += '        %3Coption value="115"%3E南港區(115)%3C/option%3E';
    html += '        %3Coption value="116"%3E文山區(116)%3C/option%3E';
    html += '    %3C/select%3E';
    html += '    %3Cspan title="如： 羅斯福路 1 段。"%3E路街名： %3Cinput type="text" class="street" /%3E%3C/span%3E';
    html += '    %3Cselect class="kinds"%3E';
    html += '        %3Coption value=""%3E%3C/option%3E';
    html += '    %3C/select%3E';
    html += '    %3Cspan title="如： 9999 號 3 樓之 1 。"%3E地址： %3Cinput type="text" class="number" /%3E%3C/span%3E';
    html += '    %3Cinput type="submit" value="路街名重設" class="reset" /%3E';
    html += '    %3Cinput type="submit" value="全部重設" class="all_reset" /%3E';
    html += '    %3Cbr/%3E';
    html += '    %3Cspan%3E郵遞區號：%3C/span%3E';
    html += '    %3Cspan class="zipcode"%3E%3C/span%3E';
    html += '    %3Cbr/%3E';
    html += '    %3Cspan%3E地址　　：%3C/span%3E';
    html += '    %3Cspan class="address"%3E%3C/span%3E';
    html += '    %3Cbr/%3E';
    html += '    %3Cspan%3E地址全名：%3C/span%3E';
    html += '    %3Cspan class="zipcode_address"%3E%3C/span%3E';
    html += '%3C/div%3E';
    document.write(unescape(html));
}

function loadHo600Zipcode () {
    var ho600s = getElementsByClassName('ho600');
    for (var i=0; i<ho600s.length; i++){
        var $zipcode = getElementByClassName('zipcode', ho600s[i]);
        $zipcode.innerHTML = '00000';

        var $reset = getElementByClassName('reset', ho600s[i]);
        $reset.onclick = reset(ho600s[i]);
        var $all_reset = getElementByClassName('all_reset', ho600s[i]);
        $all_reset.onclick = allReset(ho600s[i]);

        var $county = getElementByClassName('countys', ho600s[i]);
        $county.onchange = selectCountys(ho600s[i]);
        var $district = getElementByClassName('districts', ho600s[i]);
        $district.onchange = selectDistricts(ho600s[i]);
        var $street = getElementByClassName('street', ho600s[i]);

        var $kind = getElementByClassName('kinds', ho600s[i]);
        $kind.onmouseover = createKinds(ho600s[i]);
        $kind.onchange = selectKinds(ho600s[i]);
        var $number = getElementByClassName('number', ho600s[i]);
        $number.onkeyup = typeNumber(ho600s[i]);

        var district = $district.value;
        $district.actb_obj = actb($street, HO600_DISTRICT[district]);

        updateAddress(ho600s[i]);
    }
}

function writeSimpleHo600ZipcodeDIV (classname) {
    if(!classname) classname = '';

    var html = '';
    html += '%3Cdiv class="simple_ho600 '+ classname + '"%3E';
    html += '    %3Cselect name="'+ classname +'_countys" class="countys"%3E';
    html += '        %3Coption value="台北市"%3E台北市%3C/option%3E';
    html += '        %3Coption value="基隆市"%3E基隆市%3C/option%3E';
    html += '        %3Coption value="台北縣"%3E台北縣%3C/option%3E';
    html += '        %3Coption value="桃園縣"%3E桃園縣%3C/option%3E';
    html += '        %3Coption value="新竹市"%3E新竹市%3C/option%3E';
    html += '        %3Coption value="新竹縣"%3E新竹縣%3C/option%3E';
    html += '        %3Coption value="苗栗縣"%3E苗栗縣%3C/option%3E';
    html += '        %3Coption value="台中市"%3E台中市%3C/option%3E';
    html += '        %3Coption value="台中縣"%3E台中縣%3C/option%3E';
    html += '        %3Coption value="彰化縣"%3E彰化縣%3C/option%3E';
    html += '        %3Coption value="南投縣"%3E南投縣%3C/option%3E';
    html += '        %3Coption value="雲林縣"%3E雲林縣%3C/option%3E';
    html += '        %3Coption value="嘉義市"%3E嘉義市%3C/option%3E';
    html += '        %3Coption value="嘉義縣"%3E嘉義縣%3C/option%3E';
    html += '        %3Coption value="台南市"%3E台南市%3C/option%3E';
    html += '        %3Coption value="台南縣"%3E台南縣%3C/option%3E';
    html += '        %3Coption value="高雄市"%3E高雄市%3C/option%3E';
    html += '        %3Coption value="高雄縣"%3E高雄縣%3C/option%3E';
    html += '        %3Coption value="屏東縣"%3E屏東縣%3C/option%3E';
    html += '        %3Coption value="宜蘭縣"%3E宜蘭縣%3C/option%3E';
    html += '        %3Coption value="花蓮縣"%3E花蓮縣%3C/option%3E';
    html += '        %3Coption value="台東縣"%3E台東縣%3C/option%3E';
    html += '        %3Coption value="澎湖縣"%3E澎湖縣%3C/option%3E';
    html += '        %3Coption value="金門縣"%3E金門縣%3C/option%3E';
    html += '        %3Coption value="連江縣"%3E連江縣%3C/option%3E';
    html += '        %3Coption value="南海島"%3E南海島%3C/option%3E';
    html += '        %3Coption value="釣魚台"%3E釣魚台%3C/option%3E';
    html += '    %3C/select%3E';
    html += '    %3Cselect name="'+classname+'_districts" class="districts"%3E';
    html += '        %3Coption value="100"%3E中正區(100)%3C/option%3E';
    html += '        %3Coption value="103"%3E大同區(103)%3C/option%3E';
    html += '        %3Coption value="104"%3E中山區(104)%3C/option%3E';
    html += '        %3Coption value="105"%3E松山區(105)%3C/option%3E';
    html += '        %3Coption value="106"%3E大安區(106)%3C/option%3E';
    html += '        %3Coption value="108"%3E萬華區(108)%3C/option%3E';
    html += '        %3Coption value="110"%3E信義區(110)%3C/option%3E';
    html += '        %3Coption value="111"%3E士林區(111)%3C/option%3E';
    html += '        %3Coption value="112"%3E北投區(112)%3C/option%3E';
    html += '        %3Coption value="114"%3E內湖區(114)%3C/option%3E';
    html += '        %3Coption value="115"%3E南港區(115)%3C/option%3E';
    html += '        %3Coption value="116"%3E文山區(116)%3C/option%3E';
    html += '    %3C/select%3E';
    html += '    %3Cinput title="詳細路街巷號，如： 羅斯福路 1 段 1 號。" type="text" name="'+classname+'_street" class="street" /%3E';
    document.write(unescape(html));
}

function loadSimpleHo600Zipcode () {
    var ho600s = getElementsByClassName('simple_ho600');
    for (var i=0; i<ho600s.length; i++){
        var $county = getElementByClassName('countys', ho600s[i]);
        $county.onchange = selectCountys(ho600s[i]);
    }
}

