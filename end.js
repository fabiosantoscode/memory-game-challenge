'use strict'

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

