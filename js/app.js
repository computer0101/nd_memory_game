var mins = 0,
    secs = 0,
    array = ['fa fa-diamond', 'fa fa-paper-plane-o',
        'fa fa-anchor', 'fa fa-bolt',
        'fa fa-cube', 'fa fa-leaf',
        'fa fa-bicycle', 'fa fa-bomb',
        'fa fa-diamond', 'fa fa-paper-plane-o',
        'fa fa-anchor', 'fa fa-bolt',
        'fa fa-cube', 'fa fa-leaf',
        'fa fa-bicycle', 'fa fa-bomb'
    ],
    domMins = $('#mins'),
    domSecs = $('#secs'),
    domMoves = $('.moves'),
    click = 0,
    done = 0,
    moves = 0,
    stars = 0,
    interval, firstClick = 0,
    openedCards = [],
    checkClasses = [];

//Initialize 'wow'.
(new WOW).init();

// Shuffle function
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

//checks if the clicked card is already opened. It is called in event listener of click on card. line 60
function alreadyOpened(card) {
    var temp = $(card).attr('class');
    temp = temp.split(' ');
    for (i = 0; i < temp.length; i++) {
        if (temp[i] === 'match' || temp[i] === 'open') {
            return true;
        } else if (i === temp.length - 1) {
            return false;
        }
    }
}

//handles and keeps track of time when the game starts and stops when it is over.
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

//checks and sets stars on page based on current number of moves.
function checkStars() {
    if (moves === 11) {
        $('.stars').children()[2].remove();
        stars = 2;
    } else if (moves === 15) {
        $('.stars').children()[1].remove();
        stars = 1;
    }
}

//Resets the game.
function resetGame(type) {
    clearInterval(interval);
    secs = secs < 10 ? ('0' + secs) : secs;
    mins = mins < 10 ? ('0' + mins) : mins;
    var stars = moves < 11 ? (3) : (moves < 15 ? (2) : (1));
    startGame();
    if (type) {
        $('.show-time').html('Time taken  ' + mins + ' : ' + secs);
        $('.show-moves').html('Total moves  ' + moves);
        $('.show-star').children().remove();
        for (i = 0; i < stars; i++) {
            $('.show-star').append('<i class="fa fa-star"></i>');
        }
        $('.modal').css('display', 'block')
    }
    mins = secs = click = firstClick = moves = done = 0;
    domSecs.text('00');
    domMins.text('00');
    domMoves.text('0');
    $('.stars').html('<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>');
    $('.deck li').removeClass('match open show');
}

//handles the functionality of hiding the cards if they did not match.
function hideCards() {
    setTimeout(function() {
        $(openedCards[0]).removeClass('show open shake');
        $(openedCards[1]).removeClass('show open shake');
        click = 0;
    }, 400);
}

//handles the functionality of setting the cards if they are matching.
function setCards() {
    for (i = 0; i < 2; i++) {
        $(openedCards[i]).removeClass('show open rubberBand');
        $(openedCards[i]).addClass('match');
    }
    setTimeout(function() {
        click = 0;
        done++;
        if (done === 8) {
            resetGame(true); //checks if all cards are opened by checking 'done'
        }
    }, 30);
}

//handles funcitonality of checking opened cards.
function checkMatchingCards() {
    for (i = 0; i < 2; i++) {
        checkClasses[i] = $(openedCards[i]).children();
        checkClasses[i] = $(checkClasses[i]).attr('class');
    }
    if (checkClasses[0] === checkClasses[1]) { //if two opened cards are same then set them to open...
        $(openedCards[0]).addClass('rubberBand');
        $(openedCards[1]).addClass('rubberBand');
        setTimeout(() => {
            setCards(); //calling to set cards open as they are matched.
        }, 300);
    } else { //if two opened cards are different then hide them...
        $(openedCards[0]).addClass('shake');
        $(openedCards[1]).addClass('shake');
        setTimeout(() => {
            hideCards(); //calling to hide cards as they are not matching.
        }, 300);
    }
}

$('.close-modal').on('click', function() {
    $('.modal').css('display', 'none');
});

//Listening for click 'event' on 'reset' button
$('.restart').on('click', function() { resetGame(false) });

//Listening for click 'click' event on each card
$('.deck').on('click', 'li', function(e) {
    if (firstClick === 0) {
        //Start timer when user clicks first card.
        startTimer();
        firstClick++;
    }
    if ((!alreadyOpened(this)) && (click < 2)) {
        openedCards[click] = this;
        click++;
        click === 2 ? $(domMoves).text(++moves) : null; //increment and then set 'moves' after every 2 clicks...
        click === 2 ? checkStars() : null; //check number of stars on every increment to 'moves'
        $(this).addClass('show open flipInY');
        $(domMoves).text(moves);
        var that = this;
        setTimeout(function() {
            $(that).removeClass('flipInY');
            if (click == 2) { //check's if two opened cards are matching.
                checkMatchingCards();
            }
        }, 300);
    }
});

//Call below function to start the game.
function startGame() {
    array = shuffle(array);
    $('.deck li i').removeClass();
    var temporary = $('.deck li i');
    for (i = 0; i < temporary.length; i++) {
        $(temporary[i]).addClass(array[i]);
    }
}

window.onload = startGame;