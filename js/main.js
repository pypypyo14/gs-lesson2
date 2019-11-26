'use strict';

// 手の定義
const obj = {
    g: {
        class: 'g',
        image: 'img/janken_gu.png',
        g: 'draw', //グーには引き分け
        c: 'win',  //チョキには勝つ
        p: 'lose', //パーには負ける
        k: 'lose'  //筋肉にも負ける
    },
    c: {
        class: 'c',
        image: 'img/janken_choki.png',
        g: 'lose',
        c: 'draw',
        p: 'win',
        k: 'lose'
    },
    p: {
        class: 'p',
        image: 'img/janken_pa.png',
        g: 'win',
        c: 'lose',
        p: 'draw',
        k: 'lose'
    },
    k: {
        class: 'k',
        image: 'img/kinniku.png',
        g: 'win',
        c: 'win',
        p: 'win',
        k: 'draw'
    }
}

function createRandomNumber(num) {
    let random = Math.floor(Math.random() * num);
    return random
}

function pick() {
    let random = createRandomNumber(10);
    let card = ''
    if (0 <= random && random < 3) {
        card = obj['g']
    } else if (3 <= random && random < 6) {
        card = obj['c']
    } else if (6 <= random && random < 9) {
        card = obj['p']
    } else if (random == 9) {
        card = obj['k']
    };
    return card;
}

function reset() {
    $('li.card').each(function () {
        let card = pick();
        // TODO: すでに場のどこかに筋肉があるならやりなおし！みたいな要素を入れたい。。
        $(this).removeClass().addClass('card remain ' + card.class);
        $(this).children('img').attr('src', card.image);
    });
};

function defineRivalsHand() {
    let remainingCardsNum = $('.rival').children('li.card.remain').length;
    let random = createRandomNumber(remainingCardsNum)
    var rivalSelectHand = $('.rival').children('li.card.remain')[random].className.split(/\s+/)[2];

    return rivalSelectHand;
}

function deleteRivalCard(rivalSelectHand) {
    $('.rival').children('li.card.remain').each(function () {
        var cardHand = $(this).attr('class').split(/\s+/)[2];
        if (cardHand === rivalSelectHand) {
            $(this).addClass('selected');
            //遅延させてからカードの見た目とクラスを変える
            $(this).delay(3000).queue(function (next) {
                var cardIndex = $('.rival').children('li.card').index(this) + 1;
                $(this).children('img').attr('src', 'img/blank' + cardIndex + '.png');
                $(this).removeClass('remain selected ' + cardHand).addClass('del');
            });
            // eachループをbreak
            return false;
        };
    });
}


$(function () {
    reset();

    $('.reset').on('click', function () {
        reset();
    });

    $('.card').on('click', function () {
        let yourHand = $(this).attr('class').split(/\s+/)[2];
        let rivalsHand = defineRivalsHand();
        if (obj[yourHand][rivalsHand] === 'win') {
            console.log('win')
        } else if (obj[yourHand][rivalsHand] === 'draw') {
            console.log('draw')
        } else if (obj[yourHand][rivalsHand] === 'lose') {
            console.log('lose')
        }
    });
});