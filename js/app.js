var mins = 0;
var secs = 0;
var array = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb']
var domMins = $('#mins');
var domSecs = $('#secs');
var domMoves = $('.moves');
var click = 0;
var done = 0;
var moves = 0;
var interval;
var firstClick = 0;
var openedCards = [];
var checkClasses = [];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

window.onload = startGame();

function startGame() {
    array = shuffle(array);
    $('.deck li i').removeClass();
    var temporary = $('.deck li i');
    var j = 0;
    for (i = 0; i < temporary.length; i++) {
        $(temporary[i]).addClass(array[j]);
        if (i === 7) {
            shuffle(array);
            j = -1;
        }
        j++;
    }
}

$('.restart').on('click', function() { resetGame(false) });

$('.deck').on('click', 'li', function(e) {
    if (firstClick === 0) {
        startTimer();
        firstClick++;
    }
    if ((!alreadyOpened(this)) && (click < 2)) {
        openedCards[click] = this;
        click++;
        click === 2 ? $(domMoves).text(++moves) : null; //set moves after every 2 clicks
        $(this).addClass('show open');
        $(domMoves).text(moves);
        var that = this;
        setTimeout(function() {
            $(openedCards[click - 1]).removeAttr('style');
            if (click == 2) {
                checkMatchingCards();
            } else {
                for (i = 0; i < 2; i++) {
                    $(openedCards[i]).removeClass('animated');
                }
            }
        }, 300);
    }
});

function checkMatchingCards() {
    for (i = 0; i < 2; i++) {
        checkClasses[i] = $(openedCards[i]).children();
        checkClasses[i] = $(checkClasses[i]).attr('class');
    }
    if (checkClasses[0] === checkClasses[1]) {
        setCards();
    } else {
        hideCards();
    }
}

function hideCards() {
    setTimeout(function() {
        $(openedCards[0]).removeClass('show open');
        $(openedCards[1]).removeClass('show open');
        click = 0;
    }, 400);
}

function setCards() {
    for (i = 0; i < 2; i++) {
        $(openedCards[i]).removeClass('show open');
        $(openedCards[i]).addClass('match');
    }
    setTimeout(function() {
        click = 0;
        done++;
        if (done === 8) {
            resetGame(true);
        }
    }, 30);
}

function alreadyOpened(card) {
    var temp = $(card).attr('class');
    temp = temp.split(' ');
    for (i = 0; i < temp.length; i++) {
        if (temp[i] === 'match') {
            return true;
        } else if (i === temp.length - 1) {
            return false;
        }
    }
}

function startTimer() {
    interval = setInterval(function() {
        secs++;
        if (secs === 60) {
            mins++;
            secs = 0;
            domMins.text(mins < 10 ? ('0' + mins) : mins);
        }
        domSecs.text(secs < 10 ? ('0' + secs) : secs);
    }, 1000);
}

function resetGame(type) {
    clearInterval(interval);
    secs = secs < 10 ? ('0' + secs) : secs;
    mins = mins < 10 ? ('0' + mins) : mins;
    if (type) {
        alert('Time taken: ' + mins + ':' + secs + '.' + 'You took in total ' + moves + '.');
    }
    mins = secs = click = firstClick = moves = 0;
    domSecs.text('00');
    domMins.text('00');
    domMoves.text('0');
    $('.deck li').removeClass('match open show');
    startGame();
}