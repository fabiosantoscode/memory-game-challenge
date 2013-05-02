'use strict'

function onReadyStateChange () {
    if (document.readyState === 'complete') {
        onReady()
    }
}

document.onreadystatechange = onReadyStateChange

function onReady() {
    fetchBadges() // game.js
}

