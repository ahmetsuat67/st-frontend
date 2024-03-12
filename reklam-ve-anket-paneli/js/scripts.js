Number.prototype.format = function(c, x, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "," : d,
        t = t == undefined ? "." : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");

};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

String.prototype.ucfirst = function() {
    var str = this;
    str += '';
    var f = str.charAt(0)
        .toUpperCase()
    return f + str.substr(1)
};
String.prototype.ucwords = function() {
    var str = this;
    return (str + '')
        .replace(/^(.)|\s+(.)/g, function($1) {
            return $1.toUpperCase()
        });
};

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

var geoOpenMethod = function(list_name, el) {
    var $c_icon = $('i.fa', el);
    if ($c_icon.hasClass('fa-map')) {
        $c_icon.removeClass('fa-map');
        $c_icon.addClass('fa-map-o');
    } else {
        $c_icon.removeClass('fa-map-o');
        $c_icon.addClass('fa-map');
    }
    $(list_name, el.parent().parent()).toggle();
};

var countGeoTarget = function() {
    var total_geo = $('#targetingGeoList .targeting-list li').length;
    var geo_text = 'Kapalı';
    if (total_geo > 0) {
        geo_text = total_geo + ' hedef seçildi';
        $('.geo-all-selected').hide();
        $('.geo-target-label').text(geo_text);
    } else {
        $('.geo-all-selected').show();
        $('.geo-target-label').text('');
    }
    $('.campaign-summary-geo').text(geo_text);
};

var city_list_template = '<li><span class="list-block"><span class="open-city" data-country="%country_code%" data-areatype="city" data-city="%city_name%"><i class="fa fa-map-marker"></i> %city_name% </span> <span class="select-city select-geo-target" data-areatype="city" data-title="%city_name%" data-country="%country_code%">dahil et</span></span><ul class="district-list"></ul></li>';
var district_list_template = '<li><span class="list-block"><span class="open-district" data-areatype="%area_type%"><i class="fa fa-map-marker"></i> %city_name% </span> <span class="select-district select-geo-target" data-areatype="%area_type%" data-title="%city_name%" data-parentcity="%parent_city%" data-country="%country_code%">dahil et</span></span></li>';
var geo_list_template = '<li class="geo-country-%country_code% %geo_city_class% geo-type-%geo_type% %geo_slug%"><span class="tl-title"><i>%geo_type_title%:</i> %geo_title%, %country_code%</span><span class="tl-close"><i class="fa fa-close"></i></span><input type="hidden" name="targeting[geo][%random%][country]" value="%country_code%"><input type="hidden" name="targeting[geo][%random%][area]" value="%geo_title%"><input type="hidden" name="targeting[geo][%random%][type]" value="%geo_type%"></li>';

function hourCheckHelper() {
    var totalChecked = $('.target-hour-checkbox input[type=checkbox]:checked').length;
    var $hourEl = $('.selected-days-and-hours, .day-hour-target-helper');
    if (totalChecked < 168) {
        $hourEl.text($('.selected-days-and-hours').data('custom'));
    } else {
        $hourEl.text($('.selected-days-and-hours').data('all'));
    }
}

$(function() {

    $('[data-toggle="tooltip"]').tooltip();

    $('.open-country').on('click', function() {
        var $c_el = $(this);
        var c_code = $c_el.data('country');
        if ($c_el.hasClass('loaded-cities')) {
            geoOpenMethod('.city-list', $(this));
        } else {
            $('i.fa', $c_el).removeClass('fa-map');
            $('i.fa', $c_el).addClass('fa-spin fa-spinner');
            $.get('/campaign/geo-list', {
                country: c_code
            }, function(data) {
                $('i.fa', $c_el).removeClass('fa-spin fa-spinner');
                $('i.fa', $c_el).addClass('fa-map');
                if (data.status === 'success') {
                    var clen = data.results.length;
                    for (var i = 0; i < clen; i++) {
                        var city_data = city_list_template.replaceAll('%city_name%', data.results[i].title).replaceAll('%country_code%', c_code);
                        $('.city-list', $c_el.parent().parent()).append(city_data);
                    }
                }
                $c_el.addClass('loaded-cities');
                geoOpenMethod('.city-list', $c_el);
            }, 'json');
        }
    });

    $(document).on('click', '.edit-days-and-hour', function() {
        $('.day-hour-targeting').toggle();
    });

    $(document).on('change', '.target-hour-checkbox input[type=checkbox]', function() {
        hourCheckHelper();
    });

    $(document).on('mouseover', '.ad-unit-list li.checkbox', function() {
        var ad_unit_group_id = $(this).data('unitgroup');
        $('.ad-unit-group-carousel').hide();
        $('.ad-unit-group-carousel-' + ad_unit_group_id).show();
    });
    $(document).on('mouseleave', '.ad-unit-preview-selection', function() {
        $('.ad-unit-group-carousel').hide();
        $('.ad-unit-group-carousel-default').show();
    });

    $('.ad-unit-list li.checkbox input[type=checkbox]').on('change', function() {
        calculateImpression();
    });

    $('#os_all').on('change', function() {
        var checked = false;
        if ($(this).is(':checked')) {
            checked = true;
        }
        $('.unit-os-custom .checkbox input[type=checkbox]').prop('checked', true);
    });

    $('#browser_all').on('change', function() {
        var checked = false;
        if ($(this).is(':checked')) {
            checked = true;
        }
        $('.unit-browser-custom .checkbox input[type=checkbox]').prop('checked', true);
    });

    $('.unit-platform-item input[type=checkbox]').on('change', function() {
        var platform_type = $(this).data('platform');
        var pl_id = $(this).val();
        if ($(this).is(':checked')) {
            $('.unit-os-platform-' + platform_type).show();
            $('.ad-unit-item-platform-' + pl_id).show();
            $('.ad-unit-item-platform-' + pl_id + ' input[type=checkbox]').prop('checked', true);
        } else {
            $('.unit-os-platform-' + platform_type).hide();
            $('.ad-unit-item-platform-' + pl_id).hide();
            $('.ad-unit-item-platform-' + pl_id + ' input[type=checkbox]').prop('checked', false);
        }
        calculateImpression();
    });

    $('.unit-os-all input[type=checkbox]').on('change', function() {
        if ($(this).is(':checked')) {
            $('.unit-os-custom').hide();
        } else {
            $('.unit-os-custom').show();
        }
    });

    $('.unit-browser-all input[type=checkbox]').on('change', function() {
        if ($(this).is(':checked')) {
            $('.unit-browser-custom').hide();
        } else {
            $('.unit-browser-custom').show();
        }
    });


    $('.day-target-name').on('click', function() {
        var $dayParentEl = $(this).parent();
        var dayCheckeds = $('input[type=checkbox]:checked', $dayParentEl).length;
        var $hourCheckEl = $('input[type=checkbox]', $dayParentEl);
        if (dayCheckeds === 24) {
            $hourCheckEl.prop('checked', false);
        } else if (dayCheckeds === 0) {
            $hourCheckEl.prop('checked', true);
        } else {
            if (dayCheckeds < 12) {
                $hourCheckEl.prop('checked', false);
            } else {
                $hourCheckEl.prop('checked', true);
            }
        }
        hourCheckHelper();
    });

    $('#adUnitAdSelector').on('change', function() {
        $('.campaign-ad-box').hide();
        $('#campaign_ad_unit_' + $(this).val()).show();
    });

    if ($('.unit-platform-only-selected-platform').length > 0) {
        $('.unit-platform-item input[type=checkbox]').each(function() {
            var platform_type = $(this).data('platform');
            var pl_id = $(this).val();
            if ($(this).is(':checked')) {
                $('.unit-os-platform-' + platform_type).show();
                $('.ad-unit-item-platform-' + pl_id).show();
                $('.ad-unit-item-platform-' + pl_id + ' input[type=checkbox]').prop('checked', true);
            } else {
                $('.unit-os-platform-' + platform_type).hide();
                $('.ad-unit-item-platform-' + pl_id).hide();
                $('.ad-unit-item-platform-' + pl_id + ' input[type=checkbox]').prop('checked', false);
            }
        });
        $('.unit-platform-only-selecteds').show();
    }

    $(document).on('click', '.select-geo-target', function() {
        var c_code = $(this).data('country');
        var c_title = $(this).data('title');
        var c_type = $(this).data('areatype');
        var c_rand = Math.ceil(Math.random() * 1000000);
        var c_geo_city_class = '';
        var c_slug = slugify('geo-slug-' + c_code + '-' + c_title + '-' + c_type);
        if ($('#targetingGeoList .targeting-list li.' + c_slug).length === 0) {
            var geo_type_title = 'Bölge';
            if ($(this).hasClass('select-country')) {
                geo_type_title = 'Ülke';
            }
            if (c_type !== 'country') {
                $('#targetingGeoList .targeting-list li.geo-country-' + c_code + '.geo-type-country').remove();
            } else {
                $('#targetingGeoList .targeting-list li.geo-country-' + c_code).not('.geo-type-country').remove();
            }
            var template = geo_list_template.replaceAll('%country_code%', c_code);
            if (c_type !== 'country') {
                if ($(this).data('parentcity') !== undefined) {
                    var parent_city = $(this).data('parentcity');
                    c_geo_city_class = 'geo-city-' + c_code + '-' + parent_city;
                    var c_parent_city_el = $('.' + slugify('geo-slug-' + c_code + '-' + parent_city + '-city'));
                    if (c_parent_city_el.length > 0) {
                        c_parent_city_el.remove();
                    }
                } else {
                    var sub_cities = $('.geo-city-' + c_code + '-' + slugify(c_title));
                    if (sub_cities.length > 0) {
                        sub_cities.remove();
                    }
                }
            }
            template = template.replaceAll('%geo_city_class%', c_geo_city_class);
            template = template.replaceAll('%geo_type%', c_type);
            template = template.replaceAll('%geo_type_title%', geo_type_title);
            template = template.replaceAll('%geo_title%', c_title);
            template = template.replaceAll('%random%', c_rand);
            template = template.replaceAll('%geo_slug%', c_slug);
            $('#targetingGeoList .targeting-list').append(template);
            countGeoTarget();
        }
    });

    $(document).on('click', '#targetingGeoList .targeting-list li span.tl-close i.fa', function() {
        $(this).parent().parent().remove();
        countGeoTarget();
    });

    var impTypeSelect = function() {
        var curr_val = $('.avt-select').val();
        $('.avt-info').hide();
        $('.ad-view-type-' + curr_val).show();
        $('.impresssion-type-helper').text($('.avt-select option[value=' + curr_val + ']').text());
    };

    $('.avt-select').on('change', function() {
        impTypeSelect();
    });

    $('#unitGroupSelector').on('change', function() {
        var selVal = $(this).val();
        if (selVal === '0') {
            $('.publisher-platform-selection').hide();
            $('#unit_group_custom').show();
            $('#publisher_platform_select_custom').show();
        } else {
            $('.publisher-platform-selection').hide();
            $('#unit_group_custom').hide();
            $('#publisher_platform_select_' + selVal).show();
        }
    });

    impTypeSelect();
    hourCheckHelper();
    countGeoTarget();
});

$(document).on('keydown', '.disable-keyboard', function(e) {
    return false;
});

$('.only-alphanumeric').keypress(function(e) {
    var regex = new RegExp("^[a-zA-Z0-9ığĞüÜİşŞçÇöÖ \']+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (e.key !== undefined && e.charCode === 0) {
        return;
    }
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
});

if ($('.btn-hover-unblur').length > 0) {
    $('.btn-hover-unblur').mouseover(function() {
        $('.home-background').addClass('hovered');
    }).mouseout(function() {
        $('.home-background').removeClass('hovered');
    });
}

var $impCount = $('.impression-count');
if ($impCount.length > 0) {
    var totalImpression = $impCount.data('total');
    setInterval(function() {
        var totalLen = totalImpression.toString().length;
        $impCount.html('');
        totalImpression = Math.ceil(parseInt(totalImpression) + 1);
        totalImpression = totalImpression.toString();
        for (var i = 0; i < totalLen; i++) {
            $impCount.append('<li>' + totalImpression[i] + '</li>');
        }
    }, 300);
}

$('.campaign-dates-start-date').on('change', function(e) {
    dateHelperInit();
});

function dateHelperInit() {
    var campaign_start_date = $('.campaign-dates-start-date').val() + ' ' + $('.campaign-dates-start-time').val();
    var campaign_end_date = $('.campaign-dates-end-date').val() + ' ' + $('.campaign-dates-end-time').val();
    fillDateHelper(campaign_start_date, campaign_end_date);
}

function fillDateHelper(start_datex, end_datex) {
    var start_date = start_datex.split(' ')[0];
    var end_date = end_datex.split(' ')[0];
    $('.campaign-date-helper-start').text(start_datex);
    $('.campaign-date-helper-end').text(end_datex);
    var days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    var date_format = "DD.MM.YYYY";
    $('.date-start-day').text(days[moment(start_date, date_format).format('e')]);
    $('.date-end-day').text(days[moment(end_date, date_format).format('e')]);
    calculateBudget();
}

if ($('.campaign-dates-start-date').length > 0) {
    dateHelperInit();
}

$('#budgetType li').on('click', function() {
    $('#budgetTypeBtn').text($(this).text());
    $('#campaign_budget_type').val($(this).data('budgettype'));
    if ($(this).data('budgettype') == 'daily') {
        $('#campaign_budget_daily_text').show();
    } else {
        $('#campaign_budget_daily_text').hide();
    }
    calculateBudget();
});

$('#campaign_budget_amount').mask('000.000.000', {
    reverse: true
});

$('#campaign_budget_amount').on('keyup', function() {
    calculateImpression();
    calculateBudget();
});

$('.time-format').mask('00:00');


function getIntBudget() {
    var temp_budget = $('#campaign_budget_amount').val();
    temp_budget = temp_budget.replace(/\./g, '');
    return Math.ceil(temp_budget);
}

function calculateImpression() {
    var array_cpm = [];
    var array_cpc = [];
    var ad_unit_list = '';
    var ad_platform_list = '';
    $('.ad-unit-list input[type=checkbox]:checked').each(function(index) {
        var $unitGroupEl = $(this);
        var unitGroupId = $unitGroupEl.val();
        ad_unit_list += '<li>' + $unitGroupEl.parent().find('.c-label').eq(0).text() + '</li>';
        $('.unit-platform-item').each(function() {
            var $plEl = $('input[type=checkbox]', $(this));
            if ($plEl.is(':checked')) {
                var tmp_platform_id = $plEl.val();
                var $unitEl = $('.ad-unit-group-' + unitGroupId + '.ad-unit-group-platform-' + tmp_platform_id);
                if ($unitEl.length > 0) {
                    var curr_cpm = $unitEl.data('cpm');
                    var curr_cpc = $unitEl.data('cpc');
                    if (array_cpm.indexOf(curr_cpm) === -1) {
                        array_cpm.push(curr_cpm);
                    }
                    if (array_cpc.indexOf(curr_cpc) === -1) {
                        array_cpc.push(curr_cpc);
                    }
                }
            }
        });
    });
    $('.unit-platform-item').each(function() {
        var $plEl = $('input[type=checkbox]', $(this));
        if ($plEl.is(':checked')) {
            ad_platform_list += '<li>' + $(this).find('.c-label').eq(0).text() + '</li>';
        }
    });
    $('.ad-platform-summary').html(ad_platform_list);
    $('.ad-unit-summary').html(ad_unit_list);
    var cpm_min = Math.min.apply(null, array_cpm),
        cpm_max = Math.max.apply(null, array_cpm);
    //var cpm = $('#cpmCost').val();
    var budget = getIntBudget();
    var min_imp = (budget / cpm_max) * 1000;
    var max_imp = (budget / cpm_min) * 1000;
    var temp_imp = 0;
    if (max_imp > 0) {
        if (min_imp === max_imp) {
            temp_imp = max_imp.format(0, 3, '.');
        } else {
            temp_imp = min_imp.format(0, 3, '.') + ' - ' + max_imp.format(0, 3, '.');
        }
    }
    $('#campaign_estimated_impression').text(temp_imp);
}

String.prototype.turkishToLower = function() {
    var string = this;
    var letters = {
        "İ": "i",
        "I": "ı",
        "Ş": "ş",
        "Ğ": "ğ",
        "Ü": "ü",
        "Ö": "ö",
        "Ç": "ç"
    };
    string = string.replace(/(([İIŞĞÜÇÖ]))/g, function(letter) {
        return letters[letter];
    })
    return string.toLowerCase();
}

String.prototype.turkishToUpper = function() {
    var string = this;
    var letters = {
        "i": "İ",
        "ş": "Ş",
        "ğ": "Ğ",
        "ü": "Ü",
        "ö": "Ö",
        "ç": "Ç",
        "ı": "I"
    };
    string = string.replace(/(([iışğüçö]))/g, function(letter) {
        return letters[letter];
    })
    return string.toUpperCase();
}

function calculateBudget() {
    var budget_type = $('#campaign_budget_type').val();
    if (budget_type == 'daily') {
        var campaign_start_date = $('.campaign-dates-start-date').val() + ' 00:00';
        var campaign_end_date = $('.campaign-dates-end-date').val() + ' 00:01';
        var start_date = moment(campaign_start_date, 'DD.MM.YYYY HH:mm');
        var end_date = moment(campaign_end_date, 'DD.MM.YYYY HH:mm');
        var days = end_date.diff(start_date, 'days') + 1;
    } else {
        var days = 1;
    }
    var budget = getIntBudget() * days;
    $('.campaign-budget-helper').text(budget.format(0, 3, '.'));
}

$(document).on('keyup', '.to-lower-case', function(event) {
    if (event.ctrlKey === false) {
        var val = $(this).val();
        val = val.replaceAll('i̇', 'i'); // word i hack
        $(this).val(val.turkishToLower());
    }
});

$(document).on('keyup', '.to-ucwords', function(event) {
    if (event.ctrlKey === false) {
        $(this).val($(this).val().ucwords());
    }
});
$(document).on('keyup', '.to-ucfirst', function(event) {
    if (event.ctrlKey === false) {
        $(this).val($(this).val().ucfirst());
    }
});

$('#saveAddressCheckbox').on('change', function() {
    if ($(this).is(':checked')) {
        $('#saveAddressInput').show();
    } else {
        $('#saveAddressInput').hide();
    }
});

$(document).on('keyup', '.campaign-ad-title', function() {
    var ad_title_input_id = $(this).attr('id');
    var max_len = $(this).attr('maxlength');
    if (max_len !== undefined) {
        var remain_char = max_len - $(this).val().length;
        $('.text-helper span.input-counter', $(this).parent()).text(remain_char);
    }
    var ad_title_preview1_id = ad_title_input_id.replace('_title', '_preview1_title');
    var ad_title_preview2_id = ad_title_input_id.replace('_title', '_preview2_title');
    $('#' + ad_title_preview1_id + ', #' + ad_title_preview2_id).text($(this).val());
});

$(document).on('keyup', '.campaign-ad-description', function() {
    var ad_description_input_id = $(this).attr('id');
    var ad_description_preview1_id = ad_description_input_id.replace('_description', '_preview1_description');
    var ad_description_preview2_id = ad_description_input_id.replace('_description', '_preview2_description');
    var max_len = $(this).attr('maxlength');
    if (max_len !== undefined) {
        var remain_char = max_len - $(this).val().length;
        $('.text-helper span.input-counter', $(this).parent()).text(remain_char);
    }
    $('#' + ad_description_preview1_id + ', #' + ad_description_preview2_id).text($(this).val());
});

$(document).on('change', '.campaign-ad-image', function() {
    var fileEl = $(this);
    var validation = {
        width: 0,
        height: 0
    };
    if (typeof $(this).data('width') !== 'undefined' && $(this).data('width') > 0 && $(this).data('height') > 0) {
        validation.width = $(this).data('width');
        validation.height = $(this).data('height');
    }
    var imgPath = this.files[0].name;
    var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
    if (extn === "png" || extn === "jpg" || extn === "jpeg") {
        var ad_image_input_id = $(this).attr('id');
        var ad_image_preview1_id = ad_image_input_id.replace('_image', '_preview1_image');
        var ad_image_preview2_id = ad_image_input_id.replace('_image', '_preview2_image');
        var reader = new FileReader();
        reader.onload = function(e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function() {
                if ((validation.width === 0 && validation.height === 0) || (image.width === validation.width && image.height === validation.height)) {
                    $('#' + ad_image_preview1_id).attr('src', e.target.result);
                    $('#' + ad_image_preview2_id).attr('src', e.target.result);
                } else {
                    fileEl.val('');
                    alert("Seçtiğiniz görsel " + validation.width + "x" + validation.height + " boyutlarında olmalıdır.");
                }
            };
        };
        reader.readAsDataURL(this.files[0]);
    } else {
        fileEl.val('');
        alert("Geçersiz görsel formatı.");
    }
});
var brandEl = false;
if ($('.ad-preview-brand').length > 0) {
    brandEl = $('.ad-preview-brand');
}
$('#campaign_brand').on('keyup', function() {
    if (brandEl !== false) {
        brandEl.text($(this).val().toLowerCase());
    }
});

$('#addMoreCampaignAdBtn').on('click', function() {
    var nextCampaignAdId = $('.campaign-ad-box').length;
    var firstAdHtml = '<div class="row campaign-ad-box">' + $('.campaign-ad-box').eq(0).html() + '</div>';
    firstAdHtml = firstAdHtml.replaceAll('\\[0\\]', '[' + nextCampaignAdId + ']');
    firstAdHtml = firstAdHtml.replaceAll('_0_', '_' + nextCampaignAdId + '_');
    $('#campaignAds').append(firstAdHtml);
    $('#ad_' + nextCampaignAdId + '_preview1_title').html('');
    $('#ad_' + nextCampaignAdId + '_preview2_title').html('');
    $('#ad_' + nextCampaignAdId + '_preview1_description').html('');
    $('#ad_' + nextCampaignAdId + '_preview2_description').html('');
    $('#ad_' + nextCampaignAdId + '_preview1_image').attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    $('#ad_' + nextCampaignAdId + '_preview2_image').attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    $('.delete-campaign-ad').show();
    scrollToElement($('.campaign-ad-box').last());
});

$('#deleteMoreCampaignAdBtn').on('click', function() {
    var lastCampaignAdId = $('.campaign-ad-box').length;
    if (lastCampaignAdId > 1) {
        $('.campaign-ad-box').last().remove();
        if ($('.campaign-ad-box').length == 1) {
            $('.delete-campaign-ad').hide();
        }
        scrollToElement($('.campaign-ad-box').last());
    }
});

if ($('.has-error').length > 0) {
    scrollToElement($('.has-error').eq(0));
}
if ($('#campaign_budget_amount').length > 0) {
    calculateImpression();
}

$('.phone-mask').mask('(000) 000 0000');
$('.citizen-mask').mask('00000000000');
$('.tax-mask').mask('00000000000');

if ($('.credit-card-no').length > 0) {
    $('.credit-card-no').validateCreditCard(function(result) {
        if (result.card_type !== null) {
            $(this).css('background-image', 'url(/assets/img/ccbrands/' + result.card_type.name + '.png)');
        }
    });
}

function scrollToElement(el) {
    $('html, body').animate({
        scrollTop: $(el).offset().top - 50
    }, 200);
}

if ($('ul.invoice-choice').length > 0) {
    $('ul.invoice-choice li').on('click', function() {
        var invoiceType = $(this).data('invoice');
        $('.invoice-form').removeClass('invoice-form-personal');
        $('.invoice-form').removeClass('invoice-form-company');
        $('.invoice-form').addClass('invoice-form-' + invoiceType);
        $('#invoice_type').val(invoiceType);
    });
}

function calculateBalancePayments() {
    var balanceStr = $('#balance_amount').val();
    balanceStr = Math.ceil(balanceStr);
    var taxVal = $('#balance_amount').data('tax');
    taxVal = parseFloat(taxVal);
    var balanceTax = balanceStr * (taxVal / 100);
    var balanceWithTax = balanceStr + balanceTax;
    $('.balance-tax .balance-money strong').text(balanceTax.format(2, 3, ',', '.'));
    $('.balance-with-tax .balance-money strong').text(balanceWithTax.format(2, 3, ',', '.'));
}

if ($('#balance_amount').length > 0) {
    $('#balance_amount').on('keyup', function() {
        calculateBalancePayments();
    });
    calculateBalancePayments();
}


$('#remoteAjax').on('show.bs.modal', function(e) {
    var button = $(e.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body').load(button.data("remote"));
});


function shadeColor(color, percent) {
    var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}

var chart_color = '#81C14B';
if (window.chart_style_color !== undefined) {
    chart_color = window.chart_style_color;
}
var chart_area_color = shadeColor(chart_color, 0.7);
if (window.stats_labels !== undefined) {
    window.stats_labels[window.stats_labels.length - 1] = '';
    var max_views_variable = getMaxOfArray(window.stats_array);
    var min_views_variable = getMinOfArray(window.stats_array);
    var calculated_step = max_views_variable - min_views_variable;
    if (calculated_step <= 0) {
        calculated_step = 1;
        if (max_views_variable > 1) {
            calculated_step = max_views_variable / 10;
        }
    }
    var max_views = Math.ceil(max_views_variable + (calculated_step * 0.1));
    calculated_step = Math.ceil(max_views / 10);
    var chart_config = {
        type: 'line',
        data: {
            labels: window.stats_labels,
            datasets: [{
                label: window.chart_label,
                backgroundColor: chart_area_color,
                borderColor: chart_color,
                data: window.stats_array,
                fill: true,
                lineTension: 0.4,
                borderWidth: 2,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: chart_color,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: chart_color,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                pointRadius: 4,
                pointHitRadius: 10,
                spanGaps: false
            }]
        },
        options: {
            elements: {
                line: {
                    tension: 0.5
                }
            },
            animation: {
                duration: 600,
                easing: 'easeInQuad'
            },
            legend: {
                display: false
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                },
                margin: {
                    right: -20
                }
            },
            responsive: false,
            title: {
                display: false,
                text: 'İstatistik'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            drawBorder: false,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    },
                    ticks: {
                        autoSkip: false,
                        padding: 0,
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: window.chart_label
                    },
                    ticks: {
                        min: 0,
                        max: max_views,
                        stepSize: calculated_step
                    }
                }]
            }
        }
    };
}


if ($('.stats-dates').length > 0) {
    $('.stats-dates').dateRangePicker({
        separator: ' to ',
        language: 'tr',
        format: 'DD.MM.YYYY',
        startDate: window.campaign_start_date,
        endDate: window.datepicker_end,
        startOfWeek: 'monday',
        autoClose: true,
        time: {
            enabled: false
        },
        getValue: function() {
            if ($('.stats-dates-start-date').val() && $('.stats-dates-end-date').val())
                return $('.stats-dates-start-date').val() + ' to ' + $('.stats-dates-end-date').val();
            else
                return '';
        },
        setValue: function(s, s1, s2) {
            $('.stats-dates-start-date').val(s1);
            $('.stats-dates-end-date').val(s2);
        }
    }).bind('datepicker-change', function(event, obj) {
        $('.campaign-stats-chart-loading').show();
        var req_params = {
            start_date: $('.stats-dates-start-date').val(),
            end_date: $('.stats-dates-end-date').val(),
            chart_type: $('#chart_type').val()
        };
        $.get(window.ajax.campaign_stats, req_params, function(data) {
            var temp_labels = data.labels;
            temp_labels[temp_labels.length - 1] = '';
            chart_config.data.labels = data.labels;
            chart_config.data.datasets[0].data = data.data;
            var max_views_variable = getMaxOfArray(data.data);
            var min_views_variable = getMinOfArray(data.data);
            var calculated_step = max_views_variable - min_views_variable;
            if (calculated_step <= 0) {
                calculated_step = 1;
                if (max_views_variable > 1) {
                    calculated_step = max_views_variable / 10;
                }
            }
            var max_views = Math.ceil(max_views_variable + (calculated_step * 0.1));
            calculated_step = Math.ceil(max_views / 10);
            chart_config.options.scales.yAxes[0].ticks.max = max_views;
            chart_config.options.scales.yAxes[0].ticks.stepSize = calculated_step;
            window.chartStats.update();
            $('.campaign-stats-chart-loading').hide();
        }, 'json');
    });
}

if ($('#chartForm').length > 0) {
    $('.btn-group-campaign-chart .btn, .btn-group-publisher-chart .btn').on('click', function() {
        var chart_type = $(this).data('ctype');
        $('#chart_type').val(chart_type);
        $('#chartForm').submit();
    });
}

if ($('#canvas').length > 0) {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.chartStats = new Chart(ctx,
        chart_config
    );
}

if ($('.box-panel-sidebar').length > 0) {
    var panel_sidebar_height = $('.box-panel-sidebar').height();
    var panel_header_height = 100; //$('.box-panel-header').height();
    $('.box-panel-fix-height canvas').css('height', (panel_sidebar_height - panel_header_height) + 'px');
}


if ($(".tiny-bar").length > 0) {
    $(".tiny-bar").peity("bar", {
        width: 50,
        height: 20,
        fill: ['#ededed']
    });
}

$(document).on('change', '.optional-field-control', function() {
    $formGroup = $(this).parent().parent();
    var isChecked = $(this).is(':checked');
    if (isChecked === true) {
        $formGroup.removeClass('hide-optional-fields');
    } else {
        $formGroup.addClass('hide-optional-fields');
    }
});

$(document).on('submit', '#ajaxCampaignEditForm', function(e) {
    e.preventDefault();
    var $resEl = $('#ajaxCampaignResponse');
    var serializeForm = $(this).serialize();
    var url = $(this).attr('action');
    $.post(url, serializeForm, function(json) {
        if (json.status === 'success') {
            location.reload();
        } else {
            $resEl.html('<div class="alert alert-danger">' + json.message + '</div>');
        }
    }, 'json');
});

if (window.autocomplete_data !== null && $('input.autocomplete-input').length > 0) {
    $('input.autocomplete-input').typeahead({
        autoSelect: false,
        source: window.autocomplete_data,
    });
}

if ($('.btn-select-address').length > 0) {
    $('#addNewAddressBtn').on('click', function() {
        $('.invoice-form').removeClass('show-address-list');
        $('.invoice-form').addClass('show-address-new');
        $('.address-box').removeClass('selected-address');
        $('#selected_address').val(0);
        $('#add_address').val(1);
    });
    $('#showAddressBtn').on('click', function() {
        $('.invoice-form').removeClass('show-address-new');
        $('.invoice-form').addClass('show-address-list');
        $('.address-box').removeClass('selected-address');
        $('#selected_address').val(0);
        $('#add_address').val(0);
    });
    $('.btn-select-address').on('click', function() {
        var selected_address = $(this).data('address');
        $('.address-box').removeClass('selected-address');
        $('#address_box_' + selected_address).addClass('selected-address');
        $('#selected_address').val(selected_address);
    });
}

$('#campaign_group_list li span, .campaign-filter-link').on('click', function() {
    $('#input_campaign_group').val($(this).data('cg'));
    $('#campaignFilterForm').submit();
});

$('#campaign_status_list li span').on('click', function() {
    $('#input_campaign_status').val($(this).data('cs'));
    $('#campaignFilterForm').submit();
});

$('#campaign_order_list li span').on('click', function() {
    $('#input_campaign_order').val($(this).data('co'));
    $('#campaignFilterForm').submit();
});

if ($("#demo_views").length > 0) {
    $("#demo_views").responsiveSlides({
        auto: false,
        pagination: true,
        nav: true,
        fade: 500
    });
}