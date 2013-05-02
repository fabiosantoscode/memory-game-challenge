(function () {
'use strict'

// Make these functions available in older browsers.
Array.prototype.map = Array.prototype.map ||
    function (func) {
        for (var i = 0; i < this.length; i ++) {
            this[i] = func(this[i], i)
        }
        return this
    }

Array.prototype.forEach = Array.prototype.forEach ||
    function (func) {
        for (var i = 0; i < this.length; i ++) {
            func(this[i], i)
        }
    }

// function to change the active "screen".
function changeScreen(screenName) {
    var forEachFunc = Array.prototype.forEach,
        elements = document.getElementsByTagName('BODY')[0].children

    forEachFunc.call(elements, function (elm) {
        // OldIE doesn't have getElementsByClassName
        var classes = elm.getAttribute('class')
        if (classes && classes.indexOf('screen') !== -1) {
            if (elm.id !== screenName) {
                elm.style.display = 'none'
            }
        }
    })
    
    document.getElementById(screenName).style.display = 'block'
}

// Check readyState changes, call initialization when document ready.
function onReadyStateChange () {
    if (document.readyState === 'complete') {
        firstScreen()
    }
}

document.onreadystatechange = onReadyStateChange

function firstScreen() {
    changeScreen('start')
    var startGame = document.getElementById('start-game-button')

    startGame.onclick = function () {
        fetchBadges() // game.js
    }
}

window.revealedTiles = []
window.hiddenTiles = 18
window.backOfBadge = 'https://i2.wp.com/codebits.eu/logos/defaultavatar.jpg'
window.timeToLookBeforeHiding = 1000
window.gameCounterTime = 0

// JSONP to https://services.sapo.pt/Codebits/listbadges
function fetchBadges() {
    var script = document.createElement('SCRIPT')
    script.src = "https://services.sapo.pt/Codebits/listbadges?callback=onBadgesReceived"
    script.type="text/javascript"
    document.getElementsByTagName('BODY')[0].appendChild(script)
    changeScreen('game')
}

function randomResult() {
    return Math.random() > 0.5 ? -1 : 1
}

// JSONP function. Exposed to window object
window.onBadgesReceived =
function onBadgesReceived(data) {
    var tableElement = document.getElementById('game-table'),
        randomNineURLs,
        shuffledPairs,
        asElements,
        rowArrays,
        rowElements,
        tableInnerHTML

    randomNineURLs = data
        .sort(randomResult) // This will shuffle everything
        .slice(0, 9) // Then this gets the first nine items
        .map(function (item) {
            return item.img
        })
    
    shuffledPairs = randomNineURLs
        .concat(randomNineURLs) // This doubles everything
        .sort(randomResult)
    
    asElements = shuffledPairs
        .map(function (imageUrl) {
            var img = document.createElement('IMG')
            img.src = backOfBadge
            img.width = 95
            img.height = 95
            img.setAttribute('data-real-source', imageUrl)
            img.setAttribute('class', 'badge hidden')
            
            return img
        })
    
    rowArrays = [
        asElements.slice(0, 6),
        asElements.slice(6, 12),
        asElements.slice(12, 18)
    ]
    
    console.log(rowArrays)
    
    rowElements = rowArrays
        .map(function (row) {
            var tr = document.createElement('DIV') // This used to be a TR, but http://stackoverflow.com/a/4943362/1011311
            tr.setAttribute('class', 'game-table-row')
            row.map(function (td) {
                tr.appendChild(td)
            })
            return tr
        })
    
    tableInnerHTML = rowElements
        .map(function (item) {
            return item.outerHTML
        })
        .join('')

    console.log(tableInnerHTML)
    tableElement.innerHTML = tableInnerHTML
    
    prepareGame()
}

function prepareGame() {
    var table = document.getElementById('game-table'),
        counter = document.getElementById('game-counter')
    window.gameCounterInterval = setInterval(function () {
        window.gameCounterTime += 1
        counter.innerHTML = window.gameCounterTime.toString()
    }, 1000)
    table.onclick = onClickOnTable
}

function onClickOnTable(e) {
    // Get event on IE
    e = e || window.event
    // Get event target on several browsers
    var target = e.originalTarget || e.srcElement || e.target
    // call the event function with the <img> element as `this`
    onClickOnBadge.call(target)
    return false
}

function onClickOnBadge() {
    // Do not reveal already revealed badges. For that we try to find this img in the revealedTiles thing.
    if (this.getAttribute('data-real-source') === this.src) {
        return
    }

    // Let the user see the 2 tiles now.
    if (window.revealedTiles.length === 2) {
        return
    }
    
    // Reveal
    this.src = this.getAttribute('data-real-source')
    
    window.revealedTiles.push(this)
    
    if (window.revealedTiles.length === 2) {
        // Check if the player found it.
        if (revealedTiles[0].src === revealedTiles[1].src) {
            // Unreveal nothing
            window.revealedTiles = []
            window.hiddenTiles -= 2
            checkEndGame()
        } else {
            // Unreveal later
            setTimeout(function () {
                window.revealedTiles.map(function (image) {
                    image.src = backOfBadge
                })
                window.revealedTiles = []
            }, window.timeToLookBeforeHiding)
        }
    }
}


function checkEndGame() {
    if (window.hiddenTiles === 0) {
        clearInterval(window.gameCounterInterval)
        onEndGame(window.gameCounterTime) // end.js
    }
}


window.twitterBaseURL = 'https://twitter.com/intent/tweet/?text='
window.baseTweet = 'Memory JavaScript FTW em: '

function onLoseGame() {
    changeScreen('lose-game')
}

function onEndGame(time) {
    changeScreen('end-game')

    var timeSpanSpan = document.getElementById('game-finish-time'),
        shareLink = document.getElementById('twitter-share')
    timeSpanSpan.innerHTML = time.toString()
    shareLink.href = twitterBaseURL + escape(baseTweet + time)
}


}())
