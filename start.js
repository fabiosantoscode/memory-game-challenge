'use strict'

function onReadyStateChange () {
    if (document.readyState === 'complete') {
        onReady()
    }
}

document.onreadystatechange = onReadyStateChange

function onReady() {
    firstScreen()
}

function firstScreen() {
    changeScreen('start')
    var startGame = document.getElementById('start-game-button')

    startGame.onclick = function () {
        fetchBadges() // game.js
    }
}

