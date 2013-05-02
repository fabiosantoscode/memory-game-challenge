'use strict'

function onReadyStateChange () {
    if (document.readyState === 'complete') {
        onReady()
    }
}

document.onreadystatechange = onReadyStateChange

function onReady() {
    fetchBadges()
}

// JSONP to https://services.sapo.pt/Codebits/listbadges
function fetchBadges() {
    var script = document.createElement('SCRIPT')
    script.src = "https://services.sapo.pt/Codebits/listbadges?callback=onBadgesReceived"
    script.type="text/javascript"
    document.getElementsByTagName('BODY')[0].appendChild(script)
}

function onBadgesReceived(data) {
    var backOfBadge = 'https://i2.wp.com/codebits.eu/logos/defaultavatar.jpg',
        tableElement = document.getElementById('game-table'),
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
    console.log(e)
    // TODO find out which badge and call onClickOnBadge
}

function onClickOnBadge(e) {
    
}