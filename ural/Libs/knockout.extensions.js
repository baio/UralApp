//http://www.knockmeout.net/2011/03/guard-your-model-accept-or-cancel-edits.html

//wrapper to an observable that requires accept/cancel
ko._observable = function(initialValue) {
    //private variables
    var _actualValue = ko.observable(initialValue);
    var _tempValue = initialValue;

    //dependentObservable that we will return
    var result = ko.dependentObservable({
        //always return the actual value
        read: function() {
            return _actualValue();
        },
        //stored in a temporary spot until commit
        write: function(newValue) {
            _tempValue = newValue;
        }
    });

    //if different, commit temp value
    result.commit = function() {
        if (_tempValue !== _actualValue()) {
            _actualValue(_tempValue);
        }
    };

    //force subscribers to take original
    result.reset = function() {
        _actualValue.valueHasMutated();
        _tempValue = _actualValue();   //reset temp value
    };

    return result;
};

ko.numericObservable = function(initialValue) {
    var _actual = ko.observable(initialValue);

    var result = ko.dependentObservable({
        read: function() {
            return _actual();
        },
        write: function(newValue) {
            var parsed = parseFloat(newValue);
            _actual(isNaN(parsed) ? newValue: parsed);
        }
    });

    return result;
};

ko.isComputed = function (instance) {
    if ((instance === null) || (instance === undefined) || (instance.__ko_proto__ === undefined)) return false;
    if (instance.__ko_proto__ === ko.dependentObservable) return true;
    return ko.isComputed(instance.__ko_proto__); // Walk the prototype chain
};