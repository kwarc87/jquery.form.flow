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
    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
    };

    //validators
    $.validator.addMethod('emailadvanced', function(value, element) {
        return this.optional(element) || isValidEmailAddress(value);
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

})();

