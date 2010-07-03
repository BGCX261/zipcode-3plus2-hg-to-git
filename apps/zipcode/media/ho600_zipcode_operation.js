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

        $district.actb_obj.actb_keywords = HO600_DISTRICT[$district.value];

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

window.onload = function loadHo600 () {
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
