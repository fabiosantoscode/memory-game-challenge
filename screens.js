'use strict'

function changeScreen(screenName) {
    var forEachFunc = Array.prototype.forEach,
        elements = document.getElementsByTagName('BODY')[0].children
    
    forEachFunc.call(elements, function (elm) {
        var classes = elm.getAttribute('class')
        if (classes && classes.indexOf('screen') !== -1) {
            if (elm.id !== screenName) {
                elm.style.display = 'none'
            }
        }
    })
    
    document.getElementById(screenName).style.display = 'block'
}

