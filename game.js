'use strict'

window.revealedTiles = []
window.hiddenTiles = 18
window.backOfBadge = 'https://i2.wp.com/codebits.eu/logos/defaultavatar.jpg'
window.timeToLookBeforeHiding = 1000

// JSONP to https://services.sapo.pt/Codebits/listbadges
function fetchBadges() {
    var script = document.createElement('SCRIPT')
    script.src = "https://services.sapo.pt/Codebits/listbadges?callback=onBadgesReceived"
    script.type="text/javascript"
    document.getElementsByTagName('BODY')[0].appendChild(script)
}

function onBadgesReceived(data) {
    var tableElement = document.getElementById('game-table'),
        randomNineURLs,
        shuffledPairs,
        asElements,
        rowArrays,
        rowElements,
        tableInnerHTML

    randomNineURLs = data
        .sort(Math.random) // This will shuffle everything
        .slice(0, 9) // Then gets the first nine items
        .map(function (item) {
            return item.img
        })
    
    shuffledPairs = randomNineURLs
        .concat(randomNineURLs) // This doubles everything
        .sort(Math.random)
    
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
    var table = document.getElementById('game-table')
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
            setTimeout(unReveal, window.timeToLookBeforeHiding)
        }
    }
}

function unReveal() {
    window.revealedTiles.map(function (image) {
        image.src = backOfBadge
    })
    window.revealedTiles = []
}

function checkEndGame() {
    if (window.hiddenTiles === 0) {
        onEndGame() // end.js
    }
}

