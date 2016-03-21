(function() {

    //constructor
    var formFlowObj =  function(element, options) {
        var plugin = this;
        plugin.settings = $.extend({}, settings.defaults, options);
        plugin.$element = $(element);
        plugin.eventPrefix = '.plugin_formFlow';
        plugin.buttonEvent = plugin.settings.buttonEvent + '.' + plugin.eventPrefix;
        plugin.validationRules = {};
        plugin.validationMessages = {};
    }

    //helper functions
    var isEmpty =  function (obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }

    //methods
    formFlowObj.prototype = {
        //parse JSON with form flow and logic
        init: function() {
            var plugin = this;
            if(typeof plugin.settings.jsonPathOrObject === 'object') {
                plugin.parseJSON(plugin.settings.jsonPathOrObject);
            } else {
                $.getJSON(plugin.settings.jsonPathOrObject, function(data) {
                    plugin.parseJSON(data);
                });
            }
        },
        parseJSON: function(JSON) {
            var plugin = this;
            plugin.formFlowJSON = JSON;
            for (var i=0; i < JSON.steps.length; i++) {
                plugin.bindNavigation(i+1, JSON.steps[i], JSON.steps);
                plugin.addValidationRules(JSON.steps[i]);
                plugin.addValidationMessages(JSON.steps[i]);
            }
            plugin.bindValidation();
            plugin.executeCallbackInitFromJSON();
        },
        checkIfArray: function(value) {
            if( Object.prototype.toString.call(value) === '[object Array]' ) {
                return true;
            } else {
                return false;
            }
        },
        executeSingleCallbackFromJSON: function(callback, dir) {
            var plugin = this;
            if(callback && settings.additionalMethods[callback.type]) {
                return settings.additionalMethods[callback.type].apply(plugin, callback['arguments']);
            }
        },
        executeCallbackInitFromJSON: function() {
            var plugin = this;
            if(plugin.formFlowJSON.init) {
                //check if init from JSON is an Array with callbacks or single callback
                if(plugin.checkIfArray(plugin.formFlowJSON.init)) {
                    //execute each init callback
                    for (var i=0; i < plugin.formFlowJSON.init.length; i++) {
                        plugin.executeSingleCallbackFromJSON(plugin.formFlowJSON.init[i]);
                    }
                } else {
                    //execute single init callback
                    plugin.executeSingleCallbackFromJSON(plugin.formFlowJSON.init);
                }
            }
        },
        executeCallbackBeforeSubmitFromJSON: function() {
            var plugin = this;
            var $element = plugin.$element;
            if(plugin.formFlowJSON.beforeSubmit) {
                if(plugin.checkIfArray(plugin.formFlowJSON['beforeSubmit'])) {
                    for (var i=0; i < plugin.formFlowJSON['beforeSubmit'].length; i++) {
                        plugin.executeSingleCallbackFromJSON(plugin.formFlowJSON['beforeSubmit'][i]);
                    }
                    $element.submit();
                } else {
                    var promiseBoolean = plugin.executeSingleCallbackFromJSON(plugin.formFlowJSON['beforeSubmit']);
                    if( promiseBoolean && $.isFunction(promiseBoolean.then) ) {
                        promiseBoolean.then(function() {
                            $element.submit();
                        });
                    } else {
                        $element.submit();
                    }
                }
            } else {
                $element.submit();
            }
        },
        bindNavigation: function(stepNumber, step, steps) {
            var plugin = this;
            var $element = plugin.$element;
            if(stepNumber === (steps.length)) {
                plugin.bindSubmit(step);
            } else {
                plugin.bindNextStep(stepNumber, step, steps);
            }
            if(stepNumber > 1) {
                plugin.bindPrevStep(stepNumber, step, steps);
            }
        },
        bindSubmit: function(step) {
            var plugin = this;
            var $element = plugin.$element;
            //submit logic bind
            $element.find(plugin.settings.buttonSubmitSelector).on(plugin.buttonEvent, function(e) {
                e.preventDefault();
                if(plugin.valid(step.fieldsToValidate) ) {
                    plugin.executeCallbackBeforeSubmitFromJSON();
                }
            });
        },
        bindNextStep: function(stepNumber, step, steps) {
            var plugin = this;
            var $element = plugin.$element;
            $element.find(plugin.settings.buttonNextSelector+"[data-step='"+stepNumber+"']").on(plugin.buttonEvent, function(e) {
                e.preventDefault();
                if( plugin.valid(step.fieldsToValidate) ) {
                    plugin.checkStepLogic(stepNumber, stepNumber+1, steps);
                }
            });
        },
        bindPrevStep: function(stepNumber, step, steps) {
            var plugin = this;
            var $element = plugin.$element;
            $element.find(plugin.settings.buttonPrevSelector+"[data-step='"+stepNumber+"']").on(plugin.buttonEvent, function(e) {
                e.preventDefault();
                plugin.checkStepLogic(stepNumber, stepNumber-1, steps);
            });
        },
        checkStepLogic: function(prevStepNumber, nextStepNumber, steps) {
            var plugin = this;
            if(steps[nextStepNumber-1]['type'] !== "optional") {
                //switch step
                plugin.switchStep(prevStepNumber, nextStepNumber, steps);
            } else if(steps[nextStepNumber-1]['type'] === "optional") {
                //check step condition
                if( plugin.checkStepCondition(steps[nextStepNumber-1]['condition']) ) {
                    //switch step
                    plugin.switchStep(prevStepNumber, nextStepNumber, steps);
                } else {
                    //if condition is fail skip next step and check another step in order
                    if(prevStepNumber < nextStepNumber) {
                        //check next step in order
                        if((nextStepNumber+1) <= steps.length) {
                            plugin.checkStepLogic(prevStepNumber, nextStepNumber+1, steps);
                        }
                    } else {
                        //check previous step in order
                        if(!((nextStepNumber-1) < 1)) {
                            plugin.checkStepLogic(prevStepNumber, nextStepNumber-1, steps);
                        }
                    }
                }
            }
        },
        checkStepCondition: function(conditionObj) {
            var plugin = this;
            //find method in settings.additionalMethods
            if ( settings.additionalMethods[conditionObj.type] ) {
                return settings.additionalMethods[conditionObj.type].apply(this, conditionObj.arguments);
            } else {
                //if cannot find given method return true
                return true;
            }
        },
        switchStep: function(prevStepNumber, nextStepNumber, steps) {
            var plugin = this;
            var $element = plugin.$element;
            var callbackOnHide = steps[prevStepNumber-1]['callbackOnHide'];
            var callbackOnHidden = steps[prevStepNumber-1]['callbackOnHidden'];
            var callbackOnShow = steps[nextStepNumber-1]['callbackOnShow'];
            var callbackOnShown = steps[nextStepNumber-1]['callbackOnShown'];
            //callback on step hide
            if(callbackOnHide) {
                plugin.executeStepCallbackFromJSON(callbackOnHide, prevStepNumber, nextStepNumber);
            }
            //hide step animation
            $element.find(plugin.settings.stepSelector+"[data-step='"+prevStepNumber+"']").fadeOut(plugin.settings.animationTime, function() {
                //callback on step hidden
                if(callbackOnHidden) {
                    plugin.executeStepCallbackFromJSON(callbackOnHidden, prevStepNumber, nextStepNumber);
                }
                //callback on step show
                if(callbackOnShow) {
                    plugin.executeStepCallbackFromJSON(callbackOnShow, prevStepNumber, nextStepNumber);
                }
                //set indicator
                if(plugin.settings.indicatorSelector) {
                    plugin.setIndicator(nextStepNumber);
                }
                //show step animation
                $element.find(plugin.settings.stepSelector+"[data-step='"+nextStepNumber+"']").fadeIn(plugin.settings.animationTime, function(){
                    //callback on step shown
                    if(callbackOnShown) {
                        plugin.executeStepCallbackFromJSON(callbackOnShown, prevStepNumber, nextStepNumber);
                    }
                });
            });
        },
        executeStepCallbackFromJSON: function(callback, prevStepNumber, nextStepNumber) {
            var plugin = this;
            //check if step callback is an Array with callbacks or single callback
            if( plugin.checkIfArray(callback)) {
                for (var i=0; i < callback.length; i++) {
                    plugin.checkCallbackDirection(callback[i], prevStepNumber, nextStepNumber);
                }
            } else {
                //step callback in both directions (next and previous)
                plugin.checkCallbackDirection(callback, prevStepNumber, nextStepNumber);
            }
        },
        checkCallbackDirection: function(callback, prevStepNumber, nextStepNumber) {
            var plugin = this;
            //step callback in both directions (next and previous)
            if((callback['direction'] === 'both') || (!callback['direction'])) {
                plugin.executeSingleCallbackFromJSON(callback);
            }
            //step callback when next step
            if((prevStepNumber < nextStepNumber) && (callback['direction'] === 'next')) {
                plugin.executeSingleCallbackFromJSON(callback);
            }
            //step callback when previous step
            if((prevStepNumber > nextStepNumber) && (callback['direction'] === 'prev')) {
                plugin.executeSingleCallbackFromJSON(callback);
            }
        },
        addValidationRules: function(step) {
            var plugin = this;
            if(step.validationRules) {
                plugin.validationRules = $.extend({}, plugin.validationRules, step.validationRules);
            }
        },
        addValidationMessages: function(step) {
            var plugin = this;
            if(step.validationMessages) {
                plugin.validationMessages = $.extend({}, plugin.validationMessages, step.validationMessages);
            }
        },
        bindValidation: function() {
            var plugin = this;
            var $element = plugin.$element;
            var validationObj = {
                ignore: [],
                rules: plugin.validationRules
            };
            console.log(plugin.validationMessages);
            if(!isEmpty(plugin.validationMessages)) {
                validationObj['messages'] = plugin.validationMessages;
            }
            console.log(validationObj);
            $element.validate(validationObj);
        },
        unbindValidation: function() {
            var plugin = this;
            var $element = plugin.$element;
            $element.removeData('validator');
            $element.off('validate').off('submit');
        },
        setIndicator: function(stepNumber) {
            var plugin = this;
            var $element = plugin.$element;
            $element.find(plugin.settings.indicatorSelector).removeClass("active");
            $element.find(plugin.settings.indicatorSelector+":nth-child("+stepNumber+")").addClass("active");
        },
        valid: function(fields) {
            var plugin = this;
            var $element = plugin.$element;
            if($element.data('validator')) {
                if (fields) {
                    return $(fields).valid();
                } else {
                    return true;
                }
            } else {
                return true;
            }
        },
        unbindEvents: function() {
            var plugin = this;
            var $element = plugin.$element;
            $element.find(plugin.settings.buttonNextSelector).off(plugin.buttonEvent);
            $element.find(plugin.settings.buttonPrevSelector).off(plugin.buttonEvent);
            $element.find(plugin.settings.buttonSubmitSelector).off(plugin.buttonEvent);
        },
        destroy: function() {
            var plugin = this;
            var $element = plugin.$element;
            plugin.unbindEvents();
            plugin.unbindValidation();
            plugin.$element.data('plugin_formFlow', null);
        }
    }
    var settings = {
        constructor: formFlowObj,
        methods: formFlowObj.prototype,
        defaults: {
            "jsonPathOrObject" :            "form-flow.json", // path to JSON or JSON object with form logic to parse
            "stepSelector" :                ".step", // selector for step class
            "buttonEvent" :                 "click", // event for navigation buttons
            "buttonNextSelector" :          ".btn-next", // selector for next button
            "buttonPrevSelector" :          ".btn-prev", // selector for back button
            "buttonSubmitSelector" :        ".btn-submit", // selector for button submit
            "indicatorSelector" :           ".steps-dots li", // selector for indicator, can be set to false
            "animationTime" :               250 // animation time for step switching
        },
        additionalMethods: {
            equals: function(element, value) {
                if( $(element).val() === value ) {
                    return true;
                } else {
                    return false;
                }
            },
            biggerThan: function(element, value) {
                if( $(element).val() > value ) {
                    return true;
                } else {
                    return false;
                }
            },
            biggerOrEqualThan: function(element, value) {
                if( $(element).val() >= value ) {
                    return true;
                } else {
                    return false;
                }
            },
            smallerThan: function(element, value) {
                if( $(element).val() < value ) {
                    return true;
                } else {
                    return false;
                }
            },
            smallerOrEqualThan: function(element, value) {
                if( $(element).val() <= value ) {
                    return true;
                } else {
                    return false;
                }
            },
            isChecked: function(element) {
                if( $(element).is(':checked') ) {
                    return true;
                } else {
                    return false;
                }
            },
            showHideElementWhenInputValueIsEqual: function(inputSelector, inputValueToShow, elementToShowHide) {
                if ($(inputSelector).val() === inputValueToShow) {
                    $(elementToShowHide).show();
                } else {
                    $(elementToShowHide).hide();
                }
            },
            showHideElementOnInputChangeWhenValueIsEqual: function(inputSelector, inputValueToShow, elementToShowHide) {
                $(inputSelector).on("change", function() {
                    if ($(inputSelector).val() === inputValueToShow) {
                        $(elementToShowHide).show();
                    } else {
                        $(elementToShowHide).hide();
                    }
                });
            },
        },
        addMethod: function(methodName, methodBody) {
            settings.additionalMethods[methodName] = methodBody;
        },
        additionalFields: { },
        addField: function(fieldName, fieldBody) {
            settings.additionalFields[fieldName] = fieldBody;
        },
    };

    //plugin
    $.formFlow = settings;

    $.fn.formFlow = function (methodOrOptions) {
        var methodsParameters = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            if ( ! $.data( this, 'plugin_formFlow' ) ) {
                var obj = new settings.constructor(this, methodOrOptions);
                obj.init();
                $.data(this, 'plugin_formFlow', obj);
            } else if (typeof methodOrOptions === 'object') {
                $.error('jQuery.formFlow already initialized');
            } else {
                var plugin = $(this).data('plugin_formFlow');
                if ( plugin[methodOrOptions] ) {
                    plugin[methodOrOptions].apply(plugin, methodsParameters);
                } else {
                    $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.formFlow' );
                }
            }
        });
    };

})();