(function() {

    /**
     * additional function for form flow plugin
     */
    $.formFlow.addMethod('refreshEventPixel', function(eventPixelSelector ,eventPixelParameterName, eventPixelParameterValue) {
        var eventPixelDomain = $(eventPixelSelector).data('url');
        var eventPixelUrl = eventPixelDomain+"?a=test&"+eventPixelParameterName+"="+eventPixelParameterValue;
        if(eventPixelParameterName) {
            $(eventPixelSelector).attr("src", eventPixelUrl);
        } else {
            $(eventPixelSelector).attr("src", "");
        }
    });
    $.formFlow.addMethod('showLoaderModalWithSubmitDelay', function(timeToRedirect) {
        var deferred = $.Deferred();
        $('#loaderModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#loaderModal').on('shown.bs.modal', function (e) {
            setTimeout(function() {
                deferred.resolve();
            }, timeToRedirect);
        });
        return deferred.promise();
    });
    $.formFlow.addMethod('closeLoaderModal', function(timeToClose) {
        var deferred = $.Deferred();
        setTimeout(function() {
            $('#loaderModal').modal('hide')
        }, timeToClose);
        $('#loaderModal').on('hidden.bs.modal', function (e) {
            deferred.resolve();
        });
        return deferred.promise();
    });
    $.formFlow.addMethod('showInfoModalWithSubmitDelay', function(delay, timeToRedirect, message) {
        var deferred = $.Deferred();
        setTimeout(function() {
            $('#infoModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#infoModal .modal-body p').text(message);
        }, delay);
        $('#infoModal').on('shown.bs.modal', function (e) {
            setTimeout(function() {
                deferred.resolve();
            }, timeToRedirect);
        });
        return deferred.promise();
    });
    $.formFlow.addMethod('showLoaderModal', function(timeToRedirect) {
        $('#loaderModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    });
    $.formFlow.addMethod('infoModal', function(message, timeToShow) {
        $('#infoModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#infoModal .modal-body p').text(message);
        if(timeToShow) {
            setTimeout(function(){
                $('#infoModal').modal('hide')
            }, timeToShow);
        }
    });
    $.formFlow.addField('sliderSettings', {
        values:         [
            {
                "range" : "$0-50",
                "desc"  : "Congrats! You’re ahead of the game. Lock in your advantage by going solar.",
                "color" : "light-green"
            },
            {
                "range" : "$51-100",
                "desc"  : "Nice! Let's see if going solar can reduce your bill even lower.",
                'color' : "dark-green"
            },
            {
                "range" : "$101-150",
                "desc"  : "You’re bill is a bit higher than average, but Solar Save could reduce your bill by at least 70%.",
                "color" : "yellow"
            },
            {
                "range" : "$151-200",
                "desc"  : "You’re paying a lot for electricity! Solar Save could bring your bill down by at least 70%.",
                "color" : "orange"
            },
            {
                "range" : "$201-300",
                "desc"  : "You’re paying a lot for electricity! Solar Save could bring your bill down by at least 70%.",
                "color" : "orange"
            },
            {
                "range" : "$301-400",
                "desc"  : "You’re paying a lot for electricity! Solar Save could bring your bill down by at least 70%.",
                "color" : "orange"
            },
            {
                "range" : "$401-500",
                "desc"  : "You’re paying a lot for electricity! Solar Save could bring your bill down by at least 70%.",
                "color" : "orange"
            },
            {
                "range" : "$501-600",
                "desc"  : "Whoa! That’s a big chunk of change. Solar Save could help you lower this cost at $0 downpayment.",
                "color" : "red"
            },
            {
                "range" : "$601-700",
                "desc"  : "Whoa! That’s a big chunk of change. Solar Save could help you lower this cost at $0 downpayment.",
                "color" : "red"
            },
            {
                "range" : "$701-800",
                "desc"  : "Whoa! That’s a big chunk of change. Solar Save could help you lower this cost at $0 downpayment.",
                "color" : "red"
            },
            {
                "range" : "$801",
                "desc"  : "Whoa! That’s a big chunk of change. Solar Save could help you lower this cost at $0 downpayment.",
                "color" : "red"
            }
        ],
        ranges:         function(val) {
            if (val <= 50) {
                return this.values[0]['range'];
            } else if (val > 50 && val <= 100 ) {
                return this.values[1]['range'];
            } else if (val > 100 && val <= 150 ) {
                return this.values[2]['range'];
            } else if (val > 150 && val <= 200 ) {
                return this.values[3]['range'];
            } else if (val > 200 && val <= 300 ) {
                return this.values[4]['range'];
            } else if (val > 300 && val <= 400 ) {
                return this.values[5]['range'];
            } else if (val > 400 && val <= 500 ) {
                return this.values[6]['range'];
            } else if (val > 500 && val <= 600 ) {
                return this.values[7]['range'];
            } else if (val > 600 && val <= 700 ) {
                return this.values[8]['range'];
            } else if (val > 700 && val <= 800 ) {
                return this.values[9]['range'];
            } else if (val > 800 ) {
                return this.values[10]['range'];
            }
        },
        description:    function(val) {
            switch(val) {
                case '$0-50':
                    return this.values[0]['desc'];
                    break;
                case '$51-100':
                    return this.values[1]['desc'];
                    break;
                case '$101-150':
                    return this.values[2]['desc'];
                    break;
                case '$151-200':
                    return this.values[3]['desc'];
                    break;
                case '$201-300':
                    return this.values[4]['desc'];
                    break;
                case '$301-400':
                    return this.values[5]['desc'];
                    break;
                case '$401-500':
                    return this.values[6]['desc'];
                    break;
                case '$501-600':
                    return this.values[7]['desc'];
                    break;
                case '$601-700':
                    return this.values[8]['desc'];
                    break;
                case '$701-800':
                    return this.values[9]['desc'];
                    break;
                case '$801':
                    return this.values[10]['desc'];
                    break;
            }
        },
        color:          function(val) {
            switch(val) {
                case '$0-50':
                    return this.values[0]['color'];
                    break;
                case '$51-100':
                    return this.values[1]['color'];
                    break;
                case '$101-150':
                    return this.values[2]['color'];
                    break;
                case '$151-200':
                    return this.values[3]['color'];
                    break;
                case '$201-300':
                    return this.values[4]['color'];
                    break;
                case '$301-400':
                    return this.values[5]['color'];
                    break;
                case '$401-500':
                    return this.values[6]['color'];
                    break;
                case '$501-600':
                    return this.values[7]['color'];
                    break;
                case '$601-700':
                    return this.values[8]['color'];
                    break;
                case '$701-800':
                    return this.values[9]['color'];
                    break;
                case '$801':
                    return this.values[10]['color'];
                    break;
            }
        }
    });
    $.formFlow.addMethod('initSlider', function() {
        var sliderSettings = $.formFlow.additionalFields.sliderSettings;
        var sliderElement = document.getElementById("monthly_bill_slider");
        noUiSlider.create(sliderElement, {
            start: 200,
            step: 1,
            tooltips: true,
            range: {
                'min': 0,
                'max': 801
            },
            connect: "lower",
            format: wNumb({
                decimals: 0,
                edit: function(value) {
                    return sliderSettings.ranges(value);
                }
            })
        });
        var $sliderContainer = $('#power_slider_container');
        var sliderValueElement = document.getElementById('power_slider_preview');
        sliderElement.noUiSlider.on('update', function( values, handle ) {
            var newValue = sliderSettings.description(values[handle]);
            sliderValueElement.innerHTML = newValue;
            $sliderContainer.removeClass();
            $sliderContainer.addClass(sliderSettings.color(values[handle]));
            $("#monthly_bill").val(values[handle]);
        });
    });
    $.formFlow.addMethod('setProvidersOnStateSelectChange', function() {
        $("#state").on('change', function() {
            $.formFlow.additionalMethods.setProviders();
        });
    });
    $.formFlow.addMethod('setProviders', function() {
        var url = "data/providers.json";
        $.ajax({
            url         : url,
            dataType    : 'json',
        })
        .done(function(data) {
            var providers = data[$("#state").val()];
            if(providers) {
                var providersOptions = "<option value=''>-Choose-</option>";
                $.each(providers, function( index, value ) {
                    providersOptions += "<option value='" + value + "'>" + value + "</option>";
                });
                $("#current_provider").html(providersOptions);
            }
        })
        .fail(function(data) {
            console.log('Electricity providers loading fail.');
        });
    });
    $.formFlow.addMethod('initAddressIntegration', function() {
        $("#zip_code").addressIntegration({
            zipcodeMode:                                true,
            regionInfluence:                            "US",
            countrySelector:                            false,
            countryShortSelector:                       '#country_short',
            citySelector:                               '#city',
            stateSelector:                              false,
            stateShortSelector:                         '#state',
            postalCodeSelector:                         false,
            routeSelector:                              false,
            streetNumberSelector:                       false,
            loaderSelector:                             '#integrationLoader',
            messageSelector:                            '#integrationMessage',
            customErrorMessage:                         'No results for given zip code.',
            debounceEventsTime:        350,
            callbackEventFired:        function() {
                $("#zip_code").data('status', 'event fired');
                $("#next-step-1").attr("disabled", true);
            },
            callbackInProgress:        function() {
                $("#zip_code").data('status', 'in progress');
                $(".next-step-1").attr("disabled", true);
            },
            callbackSuccess:           function(results) {
                $("#zip_code").data('status', 'success');
                $("#zip_code").data('country', $("#country_short").val());
                $("#zip_code").valid();
                $("#next-step-1").attr("disabled", false);
                //set providers
                $.formFlow.additionalMethods.setProviders();
            },
            callbackError:             function(errorMessage) {
                $("#zip_code").data('status', 'error');
                $("#country_short").val("");
                $("#zip_code").data('country', $("#country_short").val());
                $("#zip_code").valid();
                $("#next-step-1").attr("disabled", false);
            }
        });
    });
    $.formFlow.addMethod('initTooltip', function() {
        // tooltip
        $(".help-icon").click(function(e){
            e.preventDefault();
        });
        if (window.outerWidth > 1399) {
            $('.help-icon-right').tooltip({
                placement    : 'right',
                html         : true,
                trigger      : "hover focus click"
            });
            $('form .help-icon-left').tooltip({
                placement    : 'right',
                html         : true,
                trigger      : "hover focus click"
            });
        } else {
            $('.help-icon-right').tooltip({
                placement    : 'right',
                html         : true,
                trigger      : "hover focus click"
            });
            $('.help-icon-left').tooltip({
                placement    : 'left',
                html         : true,
                trigger      : "hover focus click"
            });
        }
    });
    $.formFlow.addMethod('setHiddenFields', function() {
        if ($("#cover_for").val() === "You & Your Partner") {
            $(".partner-fields").show();
            $("#joint").val("Yes");
            $("#partner_coverage").val("2");
            if($("#partner_title").val() === "Mr") {
                $("#partner_gender").val("M");
            } else {
                $("#partner_gender").val("F");
            }
        } else {
            $(".partner-fields").hide();
            $("#joint").val("No");
            $("#partner_coverage").val("1");
        }
        if ($("#insurance_type").val() === "Life Insurance + Critical Illness") {
            $("#with_cic").val(true);
        } else {
            $("#with_cic").val(false);
        }
        if ($("#cover_type").val() === "Level Cover") {
            $("#cover_type_bool").val("1");
        } else {
            $("#cover_type_bool").val("2");
        }
        var months = {
            "01" : "JAN",
            "02" : "FEB",
            "03" : "MAR",
            "04" : "APR",
            "05" : "MAY",
            "06" : "JUN",
            "07" : "JUL",
            "08" : "AUG",
            "09" : "SEP",
            "10" : "OCT",
            "11" : "NOV",
            "12" : "DEC"
        }
        var dobMonthValue = $("#dob_month").val();
        if(dobMonthValue) {
            $("#dob_month_3let").val(months[dobMonthValue]);
        }
        var dobMonthValuePartner = $("#partner_dob_month").val();
        if(dobMonthValuePartner) {
            $("#partner_dob_month_3let").val(months[dobMonthValuePartner]);
        }
        if( $("#premium_type").val() == "Guaranteed Premiums" ) {
            $("#premium_type_number").val("1");
        } else {
            $("#premium_type_number").val("2");
        }
        if( $("#marketing_agreement").is(":checked") ) {
            $("#opt_in").val("yes");
        } else {
            $("#opt_in").val("no");
        }
        if($("#title").val() === "Mr") {
            $("#gender").val("M");
        } else {
            $("#gender").val("F");
        }
        if( !$("#uk_phone2").val() ) {
            $("#uk_phone2").val($("#uk_phone").val());
        }
    });
    $.formFlow.addMethod('calculateAge', function(year, month, day) {
        var when = moment(year+month+day, "YYYYMMDD");
        age = moment().diff(when, 'years');
        return age;
    });
    $.formFlow.addMethod('setAge', function() {
        var calculateAge = $.formFlow.additionalMethods.calculateAge;
        var partnerDay = $("#partner_dob_day").val();
        var partnerMonth = $("#partner_dob_month").val();
        var partnerYear = $("#partner_dob_year").val();
        var yourDay = $("#dob_day").val();
        var yourMonth = $("#dob_month").val();
        var yourYear = $("#dob_year").val();
        $("#age").val(calculateAge(yourYear,yourMonth,yourDay) );
        if ($("#cover_for").val() === "You & Your Partner") {
            $("#partner_age").val(calculateAge(partnerYear,partnerMonth,partnerDay));
        } else {
            $("#partner_age").val("");
        }
    });
    $.formFlow.addMethod('clearPartnersFields', function() {
        if ($("#cover_for").val() === "You") {
            $("#partner_title, #partner_first_name, #partner_last_name, #partner_dob_day, #partner_dob_month, #partner_dob_year, #partner_age, #partner_smoker, #partner_dob_month_3let"). val("");
        }
    });

    /**
     * additional validators
     */

    //helper functions
    function notConsecutive(phone, consecutiveLength) {
        var consecutive = 0;
        for(var i = 0; i < phone.length; i++) {
            if (i < (phone.length - (consecutiveLength-1)) ) {
                for(var j = 0; j < (consecutiveLength-1); j++) {
                    if( ( parseInt(phone[i+j])+1 ) == ( ( parseInt(phone[i+j+1])) ) ) {
                        consecutive++;
                    }
                }
            }
            if(consecutive == (consecutiveLength - 1)) {
                return false;
            } else {
                consecutive = 0;
            }
        }
        return true;
    }
    function notRepeating(phone, repeatingLength) {
        var repeating = 0;
        for(var i = 0; i < phone.length; i++) {
            if (i < (phone.length - (repeatingLength-1)) ) {
                for(var j = 0; j < (repeatingLength-1); j++) {
                    if( ( parseInt(phone[i+j]) ) == ( ( parseInt(phone[i+j+1])) ) ) {
                        repeating++;
                    }
                }
                if(repeating == (repeatingLength - 1)) {
                    return false;
                } else {
                    repeating = 0;
                }
            }
        }
        return true;
    }

    function checkPostCode (toCheck) {
        // Permitted letters depend upon their position in the postcode.
        var alpha1 = "[abcdefghijklmnoprstuwyz]";                       // Character 1
        var alpha2 = "[abcdefghklmnopqrstuvwxy]";                       // Character 2
        var alpha3 = "[abcdefghjkpmnrstuvwxy]";                         // Character 3
        var alpha4 = "[abehmnprvwxy]";                                  // Character 4
        var alpha5 = "[abdefghjlnpqrstuwxyz]";                          // Character 5
        var BFPOa5 = "[abdefghjlnpqrst]";                               // BFPO alpha5
        var BFPOa6 = "[abdefghjlnpqrstuwzyz]";                          // BFPO alpha6
        // Array holds the regular expressions for the valid postcodes
        var pcexp = new Array ();
        // BFPO postcodes
        pcexp.push (new RegExp ("^(bf1)(\\s*)([0-6]{1}" + BFPOa5 + "{1}" + BFPOa6 + "{1})$","i"));
        // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
        pcexp.push (new RegExp ("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
        // Expression for postcodes: ANA NAA
        pcexp.push (new RegExp ("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
        // Expression for postcodes: AANA  NAA
        pcexp.push (new RegExp ("^(" + alpha1 + "{1}" + alpha2 + "{1}" + "?[0-9]{1}" + alpha4 +"{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
        // Exception for the special postcode GIR 0AA
        pcexp.push (/^(GIR)(\s*)(0AA)$/i);
        // Standard BFPO numbers
        pcexp.push (/^(bfpo)(\s*)([0-9]{1,4})$/i);
        // c/o BFPO numbers
        pcexp.push (/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);
        // Overseas Territories
        pcexp.push (/^([A-Z]{4})(\s*)(1ZZ)$/i);
        // Anguilla
        pcexp.push (/^(ai-2640)$/i);
        // Load up the string to check
        var postCode = toCheck;
        // Assume we're not going to find a valid postcode
        var valid = false;
        // Check the string against the types of post codes
        for ( var i=0; i<pcexp.length; i++) {
            if (pcexp[i].test(postCode)) {
                // The post code is valid - split the post code into component parts
                pcexp[i].exec(postCode);
                // Copy it back into the original string, converting it to uppercase and inserting a space
                // between the inward and outward codes
                postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
                // If it is a BFPO c/o type postcode, tidy up the "c/o" part
                postCode = postCode.replace (/C\/O\s*/,"c/o ");
                // If it is the Anguilla overseas territory postcode, we need to treat it specially
                if (toCheck.toUpperCase() == 'AI-2640') {postCode = 'AI-2640'};
                // Load new postcode back into the form element
                valid = true;
                // Remember that we have found that the code is valid and break from loop
                break;
            }
        }
      // Return with either the reformatted valid postcode or the original invalid postcode
      if (valid) {return true;} else return false;
    }

    //validators
    $.validator.addMethod('emailadvanced', function(value, element) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        pattern.test(emailAddress);
        return this.optional(element) || pattern.test(emailAddress);
    }, 'Please enter a valid email address.');
    $.validator.addMethod('phone', function(phone_number, element) {
        return this.optional(element) || phone_number.match(/^[0-9]+$/);
        }, 'Please enter a valid phone number that contains only digits.'
    );
    $.validator.addMethod('phoneLength', function(phone_number, element) {
        return this.optional(element) || phone_number.length > 9 && phone_number.length < 12;
        }, 'Please enter a phone number that is 10-11 digits.'
    );
    $.validator.addMethod('phoneRepeatingAndConsecutive', function(phone_number, element) {
        return this.optional(element) || (notRepeating(phone_number.split(''), 4) && notConsecutive(phone_number.split(''), 4));
        }, 'Please do not use consecutive or repeating numbers.'
    );
    $.validator.addMethod('phoneUS', function(phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, '');
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
    }, 'Please enter a valid phone number.');
    $.validator.addMethod('zipcodeUSGoogleMaps', function(value, element) {
        var country = false;
        if($(element).data('country') === 'US') {
            country = true;
        } else {
            country = false;
        }
        return this.optional(element) || country;
    }, 'Given zipcode is not from US.');
    $.validator.addMethod('zipcodeUSPending', function(value, element) {
        var status = false;
        if( ($(element).data('status') === 'event fired') || ($(element).data('status') === 'in progress') ) {
            status = false;
        } else {
            status = true;
        }
        return this.optional(element) || status;
    }, 'Your zip code is being processed.');
    $.validator.addMethod('zipcodeUSStatus', function(value, element) {
        var status = false;
        if( ($(element).data('status') === 'error')) {
            status = false;
        } else {
            status = true;
        }
        return this.optional(element) || status;
    }, 'Your zip code is incorrect.');
    $.validator.addMethod('homeownerrequired', function(value, element) {
        if($('#homeowner_1').is(':checked')) {
            if(value !== null) {
                return value.length;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }, 'This field is required for home owner.');
    $.validator.addMethod("partnerrequired", function(value, element) {
        if ($('#cover_for').val() === 'You & Your Partner') {
            if(value !== null) {
                return value.length;
            } else {
                return false;
            }
        }
        return true;
    }, "This field is required for partner.");
    $.validator.addMethod('phoneStart', function(phone_number, element) {
        return this.optional(element) || phone_number.match(/^0.*$/);
        }, 'Please enter a phone number that begins with "0".');
    $.validator.addMethod("phonesUKCustom", function(phone_number, element) {
        phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^0?(?:(?:1\d{8,9}|[23]\d{9}|7(?:[1345789]\d{8}|624\d{6})))$/);
    }, "Please specify a valid uk phone number.");
    $.validator.addMethod("postcodeUK", function(value, element) {
        return this.optional(element) || checkPostCode(value);
    }, "Please specify a valid UK postcode");

})();

