'use strict';

// 手の定義
const obj = {
    gu: {
        class: 'gu',
        image: 'img/janken_gu.png',
        num: 0
    },
    choki: {
        class: 'choki',
        image: 'img/janken_choki.png',
        num: 1
    },
    pa: {
        class: 'pa',
        image: 'img/janken_pa.png',
        num: 2
    },
    kinniku: {
        class: 'kinniku',
        image: 'img/kinniku.png',
        num: 3
    }
}

function createRandomNumber(num) {
    let random = Math.floor(Math.random() * num);
    return random
}

function drawCard() {
    let random = createRandomNumber(100);
    if (0 <= random && random < 31) {
        return obj['gu']
    } else if (31 <= random && random < 62) {
        return obj['choki']
    } else if (62 <= random && random < 93) {
        return obj['pa']
    } else { //レア
        return obj['kinniku']
    };
}

function resetCard() {
    $('li.card').each(function () {
        let card = drawCard();
        $('.message').html('');
        $(this).removeClass().addClass('card remain ' + card.class);
        $(this).children('img').attr('src', card.image);
    });
}

// リセット
function initializeReset() {
    $('.counter').text('0');
    if (localStorage.getItem('maxWinning')) {
        $('.max-winning').text(localStorage.getItem('maxWinning'));
    } else {
        $('.max-winning').text('0');
    }
    resetCard();
};

function nextChallenge() {
    $('.counter-list').children('li').children('.counter').text('0');
    resetCard();
    let nowWinning = parseInt($('.winning').text())
    let maxWinning = parseInt($('.max-winning').text())

    if (nowWinning > maxWinning) {
        $('.max-winning').text(nowWinning);
        localStorage.setItem('maxWinning', nowWinning);
    };
};

// ライバルの出す手をランダムに決定
function defineRivalsHand() {
    //ライバルの出す手の形を決定
    let remainingCardsNum = $('.rival').children('li.card.remain').length;
    let random = createRandomNumber(remainingCardsNum)
    var rivalSelectHand = $('.rival').children('li.card.remain')[random].className.split(/\s+/)[2];

    // ライバルの出す手が何番目のli要素かを判定
    var rivalCardIndex = $('.rival').children('li.card').index($('.rival').children('li.card.remain')[random])

    return { hand: rivalSelectHand, cardIndex: rivalCardIndex };
}

// 勝敗数のカウントアップ
function countUp(selector) {
    let count = parseInt($(selector).text());
    $(selector).text(count + 1);
};

// 勝ち抜き判定。
function judge_winning() {
    // 画面表示が切り替わってから実行させるためちょっと遅延させる
    setTimeout(function () {
        let win = parseInt($('.win').text());
        let lose = parseInt($('.lose').text());
        let draw = parseInt($('.draw').text());
        // 勝ち+引き分け数が負け数より多ければ、次の挑戦者へ。負けたら終わり
        if (win + draw > lose) {
            countUp('.winning');
            nextChallenge();
        };
    }, 15);
};

function drawResult(result, msg) {
    countUp(`.${result}`);
    $('.message').html(`<p>${msg}</p>`);
};

$(function () {
    initializeReset();

    $('.reset').on('click', function () {
        initializeReset();
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

        //選択されたカードに選択済みの背景色(.selected)とクリック無効効果(.done)をつける。
        // 手札から消滅させる(.remain を外す)。
        yourCard.addClass('selected done').removeClass('remain');
        rivalCard.addClass('selected done').removeClass('remain');

        // 勝敗判定
        if (obj[yourHand] == 'kinniku') {
            drawResult('win', 'WIN!');
        } else {
            // 参考: https://qiita.com/mpyw/items/3ffaac0f1b4a7713c869
            let result = (obj[yourHand].num - obj[rivalHand].num + 3) % 3
            switch (result) {
                case 2:
                    drawResult('win', 'WIN!');
                    break;
                case 1:
                    drawResult('draw', 'draw');
                    break;
                case 0:
                    drawResult('lose', 'lose...');
                    break;
            };
        };

        //0.01秒後、選んだ手札は画像を変える
        setTimeout(function () {
            yourCard.children('img').attr('src', 'img/blank' + yourCardIndex + '.png');
            yourCard.removeClass('selected');
            rivalCard.children('img').attr('src', 'img/blank' + rivalCardIndex + '.png');
            rivalCard.removeClass('selected');
        }, 10);

        // 手札がなくなったら勝ち抜き判定
        if ($('.you').children('li.card.remain').length === 0) {
            judge_winning();
        }
    });
});