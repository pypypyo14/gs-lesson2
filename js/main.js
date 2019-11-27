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

function drawCard() {
    let random = createRandomNumber(10);
    if (0 <= random && random < 3) {
        return obj['g']
    } else if (3 <= random && random < 6) {
        return obj['c']
    } else if (6 <= random && random < 9) {
        return obj['p']
    } else if (random == 9) {
        return obj['k']
    };
}

//手札と勝敗数をリセット
function reset() {
    $('.counter').text('0');
    $('li.card').each(function () {
        let card = drawCard();
        $('.message').html('');
        // TODO: すでに場のどこかに筋肉があるならやりなおし！みたいな要素を入れたい。。
        $(this).removeClass().addClass('card remain ' + card.class);
        $(this).children('img').attr('src', card.image);
    });
};

// ライバルの出す手をランダムに決定
function defineRivalsHand() {
    //ライバルの出す手の形を決定
    let remainingCardsNum = $('.rival').children('li.card.remain').length;
    let random = createRandomNumber(remainingCardsNum)
    var rivalSelectHand = $('.rival').children('li.card.remain')[random].className.split(/\s+/)[2];

    // ライバルの出す手が何番目のli要素かを判定(背景色変えるため)
    // ここもっとスマートにできそう。。
    var rivalCardIndex = $('.rival').children('li.card').index($('.rival').children('li.card.remain')[random])

    return { hand: rivalSelectHand, cardIndex: rivalCardIndex };
}

// 勝敗数のカウントアップ
function countUp(selector) {
    let count = parseInt($(selector).text());
    $(selector).text(count + 1);
};

$(function () {
    reset();

    $('.reset').on('click', function () {
        reset();
    });

    // 自分の手札をクリックすると勝負開始
    $('.you').children('.card.remain').on('click', function () {


        // 自分の手札判定
        let yourHand = $(this).attr('class').split(/\s+/)[2];
        let yourCardIndex = $('.you').children('li.card').index($(this));
        let yourCard = $('.you').children('li.card').eq(yourCardIndex);

        // 相手の手札判定
        let rival = defineRivalsHand();
        let rivalHand = rival.hand;
        let rivalCardIndex = rival.cardIndex;
        let rivalCard = $('.rival').children('li.card').eq(rivalCardIndex);

        //選択されたカードに.selectedを付け、手札の選択肢から消滅させる。
        yourCard.addClass('selected').removeClass('remain');
        rivalCard.addClass('selected').removeClass('remain');

        // 勝敗判定
        switch (obj[yourHand][rivalHand]) {
            case 'win':
                countUp('.win');
                $('.message').html('<p>WIN!</p>');
                break;
            case 'draw':
                countUp('.draw');
                $('.message').html('<p>Draw</p>');
                break;
            case 'lose':
                countUp('.lose');
                $('.message').html('<p>lose...</p>');
                break;
        };

        //3秒後、選んだカードの見た目を変える
        setTimeout(function () {
            yourCard.children('img').attr('src', 'img/blank' + yourCardIndex + '.png');
            yourCard.removeClass('selected');
            rivalCard.children('img').attr('src', 'img/blank' + rivalCardIndex + '.png');
            rivalCard.removeClass('selected');
        }, 3000);
    });
});