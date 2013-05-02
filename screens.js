'use strict'

function changeScreen(screenName) {
    var sliceFunc = Array.prototype.slice,
        elements = document.getElementsByClassName('screen')

    // Turning HTMLCollection into a regular array makes it faster and enables map()
    elements = sliceFunc.call(elements, 0)

    elements.map(function (item) {
        if (item.id !== screenName) {
            item.style.display = 'none'
        }
    })
    document.getElementById(screenName).style.display = 'block'
}

