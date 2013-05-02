'use strict'

// Make this function available in older browsers.
Array.prototype.map = Array.prototype.map ||
    function (func) {
        for (var i = 0; i < this.length; i ++) {
            this[i] = func(this[i], i)
        }
        return this
    }
