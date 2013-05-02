'use strict'

window.revealedTiles = []
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
        asHTML,
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
    
    asHTML = shuffledPairs
        .map(function (imageUrl) {
            var img = document.createElement('IMG')
            img.src = backOfBadge
            img.width = 95
            img.height = 95
            img.setAttribute('data-real-source', imageUrl)
            img.setAttribute('class', 'badge hidden')
            
            var td = document.createElement('TD')
            td.appendChild(img)
            
            return td
        })
    
    rowArrays = [
        asHTML.slice(0, 6),
        asHTML.slice(6, 12),
        asHTML.slice(12, 18)
    ]
    
    console.log(rowArrays)
    
    rowElements = rowArrays
        .map(function (row) {
            var tr = document.createElement('TR')
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
    
    tableElement.innerHTML = tableInnerHTML
    
    prepareGame()
}

function prepareGame() {
    var table = document.getElementById('game-table')
    table.onclick = onClickOnTable
}

function onClickOnTable(e) {
    // call the event function with the <img> element as `this`
    onClickOnBadge.call(e.originalTarget)
    return false
}

function isRevealed(image) {
    var found = false
    for (var i = 0; i < window.revealedTiles.length; i++) {
        if (window.revealedTiles[i] === image) {
            found=true;
            break;
        }
    }
    return found
}

function onClickOnBadge() {
    // Do not reveal already revealed badges. For that we try to find this img in the revealedTiles thing.
    if (isRevealed(this)) {
        return
    }
    
    // Do not reveal after revealing 2 images. There's a short interval.
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
