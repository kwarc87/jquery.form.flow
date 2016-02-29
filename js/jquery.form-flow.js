(function() {

    //constructor
    var formFlowObj =  function(element, options) {
        var plugin = this;
        plugin.settings = $.extend({}, settings.defaults, options);
        plugin.$element = $(element);
        plugin.eventPrefix = '.plugin_formFlow';
        plugin.buttonEvent = plugin.settings.buttonEvent + '.' + plugin.eventPrefix;
        plugin.validationRules = {};
    }

    //methods
    formFlowObj.prototype = {
        //parse JSON with form flow and logic
        init: function()  {
            var plugin = this;
            $.getJSON( plugin.settings.jsonPath, function(data) {
                plugin.formFlowJSON = data;
                for (var i=0; i < data.steps.length; i++) {
                    plugin.bindNavigate(i+1, data.steps[i], data.steps);
                    plugin.addValidationRules(data.steps[i]);
                }
                plugin.bindValidation();
            });
        },
        bindNavigate: function(stepNumber, step, steps) {
            var plugin = this;
            var $element = plugin.$element;
            if(stepNumber === (steps.length)) {
                //submit logic bind
                $(plugin.settings.buttonSubmitSelector).on(plugin.buttonEvent, function(e) {
                    e.preventDefault();
                    if(plugin.valid(step.fieldsToValidate) ) {
                        // call function before submit (this can also return promise object)
                        if(plugin.formFlowJSON.beforeSubmit) {
                            var functionToCallOnSubmit = plugin.formFlowJSON.beforeSubmit.type;
                            var functionToCallOnSubmitArguments = plugin.formFlowJSON.beforeSubmit.arguments;
                            var promiseBoolean = settings.additionalMethods[functionToCallOnSubmit].apply(this, functionToCallOnSubmitArguments);
                            if( promiseBoolean && $.isFunction(promiseBoolean.then) ) {
                                promiseBoolean.then(function(){
                                    $element.submit();
                                });
                            } else {
                                $element.submit();
                            }
                        }
                    }
                })
            } else {
                //next step bind
                $(plugin.settings.buttonNextSelector+"[data-step='"+stepNumber+"']").on(plugin.buttonEvent, function(e) {
                    e.preventDefault();
                    if( plugin.valid(step.fieldsToValidate) ) {
                        plugin.checkStep(stepNumber, stepNumber+1, steps);
                    }
                })
            }
            //prev step bind
            if(stepNumber > 1) {
                $(plugin.settings.buttonPrevSelector+"[data-step='"+stepNumber+"']").on(plugin.buttonEvent, function(e) {
                    e.preventDefault();
                    plugin.checkStep(stepNumber, stepNumber-1, steps);
                })
            }
        },
        checkStep: function(prevStepNumber, nextStepNumber, steps) {
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
                        plugin.checkStep(prevStepNumber, nextStepNumber+1, steps);
                    } else {
                        //check previous step in order
                        plugin.checkStep(prevStepNumber, nextStepNumber-1, steps);
                    }
                }
            }
        },
        switchStep: function(prevStepNumber, nextStepNumber, steps) {
            var plugin = this;
            if(steps[prevStepNumber-1]['callbackOnHide']) {
                var callbackOnHide = steps[prevStepNumber-1]['callbackOnHide'];
                if(settings.additionalMethods[callbackOnHide.type]) {
                    settings.additionalMethods[callbackOnHide.type].apply(this, callbackOnHide['arguments']);
                }
            }
            if(steps[nextStepNumber-1]['callbackOnShow']) {
                var callbackOnShow = steps[nextStepNumber-1]['callbackOnShow'];
                if(settings.additionalMethods[callbackOnShow.type]) {
                    settings.additionalMethods[callbackOnShow.type].apply(this, callbackOnShow['arguments']);
                }
            }
            $(plugin.settings.stepSelector+"[data-step='"+prevStepNumber+"']").fadeOut(plugin.settings.animationTime, function() {
                if(steps[prevStepNumber-1]['callbackOnHidden']) {
                    var callbackOnHidden = steps[prevStepNumber-1]['callbackOnHidden'];
                    if(settings.additionalMethods[callbackOnHidden.type]) {
                        settings.additionalMethods[callbackOnHidden.type].apply(this, callbackOnHidden['arguments']);
                    }
                }
                $(plugin.settings.stepSelector+"[data-step='"+nextStepNumber+"']").fadeIn(plugin.settings.animationTime);
                plugin.setIndicator(nextStepNumber);
                if(steps[nextStepNumber-1]['callbackOnShown']) {
                    var callbackOnShown = steps[nextStepNumber-1]['callbackOnShown'];
                    if(settings.additionalMethods[callbackOnShown.type]) {
                        settings.additionalMethods[callbackOnShown.type].apply(this, callbackOnShown['arguments']);
                    }
                }
            });
        },
        checkStepCondition: function(conditionObj) {
            var plugin = this;
            //search method in settings.additionalMethods
            if ( settings.additionalMethods[conditionObj.type] ) {
                return settings.additionalMethods[conditionObj.type].apply(this, conditionObj.arguments);
            //if cannot find given method return true
            } else {
                return true;
            }
        },
        addValidationRules: function(step) {
            var plugin = this;
            if(step.validationRules) {
                plugin.validationRules = $.extend({}, plugin.validationRules, step.validationRules);
            }
        },
        bindValidation: function() {
            var plugin = this;
            var $element = plugin.$element;
            $element.validate({
                ignore: [],
                rules: plugin.validationRules
            });
        },
        setIndicator: function(stepNumber) {
            var plugin = this;
            $(plugin.settings.indicatorSelector).removeClass("active");
            $(plugin.settings.indicatorSelector+":nth-child("+stepNumber+")").addClass("active");
        },
        unbindEvents: function() {
            var plugin = this;
        },
        valid: function(fields) {
            if (fields) {
                return $(fields).valid();
            } else {
                return true;
            }
        },
        unbindEvents: function() {
            var plugin = this;
            $(plugin.settings.buttonNextSelector).off(plugin.buttonEvent);
            $(plugin.settings.buttonPrevSelector).off(plugin.buttonEvent);
            $(plugin.settings.buttonSubmitSelector).off(plugin.buttonEvent);
        },
        destroy: function() {
            var plugin = this;
            var $element = plugin.$element;
            plugin.unbindEvents();
            plugin.$element.data('plugin_formFlow', null);
        }
    }
    var settings = {
        constructor: formFlowObj,
        methods: formFlowObj.prototype,
        defaults: {
            "jsonPath" :                    "form-flow.json",
            "stepSelector" :                ".step",
            "buttonEvent" :                 "click",
            "buttonNextSelector" :          ".btn-next",
            "buttonPrevSelector" :          ".btn-prev",
            "buttonSubmitSelector" :        ".btn-submit",
            "indicatorSelector" :           "#steps-dots li",
            "animationTime" :               250
        },
        additionalMethods: {
            equals: function(element, value) {
                if( $(element).val() ===  value ) {
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
            }
        },
        addMethod: function(methodName, methodBody) {
            settings.additionalMethods[methodName] = methodBody;
        }
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