(function() {

    /**
     * additional function for form flow plugin
     */
    $.formFlow.addMethod('showLoader', function(timeToRedirect) {
        var deferred = $.Deferred();
        $('#loaderModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#loaderModal').on('shown.bs.modal', function (e) {
            setTimeout(function(){
                deferred.resolve();
            }, timeToRedirect);
        });
        return deferred.promise();
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
    $.formFlow.addMethod('consoleLog', function(message) {
        console.log(message);
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

    /**
     * slider
     */

    var sliderValues = [
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
    ];

    function sliderRanges(val) {
        if (val <= 50) {
            return sliderValues[0]['range'];
        } else if (val > 50 && val <= 100 ) {
            return sliderValues[1]['range'];
        } else if (val > 100 && val <= 150 ) {
            return sliderValues[2]['range'];
        } else if (val > 150 && val <= 200 ) {
            return sliderValues[3]['range'];
        } else if (val > 200 && val <= 300 ) {
            return sliderValues[4]['range'];
        } else if (val > 300 && val <= 400 ) {
            return sliderValues[5]['range'];
        } else if (val > 400 && val <= 500 ) {
            return sliderValues[6]['range'];
        } else if (val > 500 && val <= 600 ) {
            return sliderValues[7]['range'];
        } else if (val > 600 && val <= 700 ) {
            return sliderValues[8]['range'];
        } else if (val > 700 && val <= 800 ) {
            return sliderValues[9]['range'];
        } else if (val > 800 ) {
            return sliderValues[10]['range'];
        }
    }

    function sliderDescription(val) {
        switch(val) {
            case '$0-50':
                return sliderValues[0]['desc'];
                break;
            case '$51-100':
                return sliderValues[1]['desc'];
                break;
            case '$101-150':
                return sliderValues[2]['desc'];
                break;
            case '$151-200':
                return sliderValues[3]['desc'];
                break;
            case '$201-300':
                return sliderValues[4]['desc'];
                break;
            case '$301-400':
                return sliderValues[5]['desc'];
                break;
            case '$401-500':
                return sliderValues[6]['desc'];
                break;
            case '$501-600':
                return sliderValues[7]['desc'];
                break;
            case '$601-700':
                return sliderValues[8]['desc'];
                break;
            case '$701-800':
                return sliderValues[9]['desc'];
                break;
            case '$801':
                return sliderValues[10]['desc'];
                break;
        }
    }

    function sliderColor(val) {
        switch(val) {
            case '$0-50':
                return sliderValues[0]['color'];
                break;
            case '$51-100':
                return sliderValues[1]['color'];
                break;
            case '$101-150':
                return sliderValues[2]['color'];
                break;
            case '$151-200':
                return sliderValues[3]['color'];
                break;
            case '$201-300':
                return sliderValues[4]['color'];
                break;
            case '$301-400':
                return sliderValues[5]['color'];
                break;
            case '$401-500':
                return sliderValues[6]['color'];
                break;
            case '$501-600':
                return sliderValues[7]['color'];
                break;
            case '$601-700':
                return sliderValues[8]['color'];
                break;
            case '$701-800':
                return sliderValues[9]['color'];
                break;
            case '$801':
                return sliderValues[10]['color'];
                break;
        }
    }

    var slider = document.getElementById('monthly_bill_slider');

    noUiSlider.create(slider, {
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
                return sliderRanges(value);
            }
        })
    });

    var $sliderContainer = $('#power_slider_container');
    var sliderValueElement = document.getElementById('power_slider_preview');

    slider.noUiSlider.on('update', function( values, handle ) {
        var newValue = sliderDescription(values[handle]);
        sliderValueElement.innerHTML = newValue;
        $sliderContainer.removeClass();
        $sliderContainer.addClass(sliderColor(values[handle]));
        $("#monthly_bill").val(values[handle]);
    });

})();

