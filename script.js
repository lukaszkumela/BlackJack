let blackjackGame={
    'you': {'scoreSpan':'#blackjack-result','div':'#your-box', 'score': 0},
    'dealer': {'scoreSpan':'#Dealer-result','div':'#dealer-box', 'score': 0},
    'cards': ['2','3','4','5','6','7','8','9','10','J','Q','K','A'] ,
    'cardMap': {'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,
    '10': 10,'J':10 ,'Q': 10,'K': 10,'A': [1,11]},
    'wins':0,
    'losses':0,
    'draws': 0,
    'stand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const HITSOUND = new Audio('sounds/swish.m4a')
const WINSOUND = new Audio('sounds/cash.mp3')
const LOSTSOUND = new Audio('sounds/aww.mp3')


document.querySelector('#blackjack-Hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-Stand-button').addEventListener('click', blackjackStand);
document.querySelector('#blackjack-Deal-button').addEventListener('click', blackjackDeal);

function blackjackHit(){
    if(blackjackGame['stand']===false){
        let card = randomCard();
        ShowCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}

function ShowCard(card, activePLayer){
    if(activePLayer['score']<=21)
    {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePLayer ['div']).appendChild(cardImage);
        HITSOUND.play();
    }
}

function sleep(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

async function blackjackStand(){
    blackjackGame['stand'] = true;
    while(DEALER['score'] <= 15  && blackjackGame['stand']===true){
        let card = randomCard();
        ShowCard(card, DEALER);
        updateScore(card, DEALER)
        showScore(DEALER);
        await sleep(1000);
    }
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
    
}

function blackjackDeal(){
    if(blackjackGame['turnsOver']===true){

        blackjackGame['stand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for(i=0;i<yourImages.length;i++){
            yourImages[i].remove();
        }
        
        for(i=0;i<dealerImages.length;i++){
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#blackjack-result').textContent = 0;
        document.querySelector('#Dealer-result').textContent = 0;
        document.querySelector('#blackjack-result').style.color = 'white';
        document.querySelector('#Dealer-result').style.color = 'white';
        document.querySelector('#blackjack').textContent = "Let's play!";
        document.querySelector('#blackjack').style.color = 'white';
        blackjackGame['turnsOver'] = false;
    }
}
function updateScore(card, activePLayer){
    if (card == 'A'){
        if (activePLayer['score'] + blackjackGame['cardMap'][card][1] <= 21){
            activePLayer['score'] += blackjackGame['cardMap'][card][1];
        }
        else{
            activePLayer['score'] += blackjackGame['cardMap'][card][0];
        }
    }
    else
    {
        activePLayer['score'] += blackjackGame['cardMap'][card];
    }
}

function showScore(activePLayer){
    if(activePLayer['score']>21){
        document.querySelector(activePLayer['scoreSpan']).textContent = "BUST!";
        document.querySelector(activePLayer['scoreSpan']).style.color = 'red';
    }
    else{
    document.querySelector(activePLayer['scoreSpan']).textContent = activePLayer['score'];
    }
}

function computeWinner(){
    let winner;

    if(YOU['score'] <= 21){
        if(YOU['score'] > DEALER['score']||(DEALER['score']>21)){
            winner = YOU;
            blackjackGame['wins']++;
        }else if(YOU['score']<DEALER['score']){
            winner = DEALER;
            blackjackGame['losses']++;
        }else if(YOU['score']===DEALER['score']){
            blackjackGame['draws']++;
        }
    }else if(YOU['score'] > 21 && DEALER['score']<=21){
        winner = DEALER;
        blackjackGame['losses']++;
    }else if(YOU['score'] > 21 && DEALER['score']>21){
        blackjackGame['draws']++;    
    }
    return winner;
}

function showResult(winner){
    let message, messageColor;

    if(blackjackGame['turnsOver'] = true)
    {
        if(winner === YOU)
        {
            document.querySelector('#wins').textContent= blackjackGame['wins'];
            message = 'You win!';
            messageColor = 'green';
            WINSOUND.play();
        } else if(winner === DEALER)
        {
            document.querySelector('#losses').textContent= blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            LOSTSOUND.play();
        }else{
            document.querySelector('#draws').textContent= blackjackGame['draws'];
            message = 'You drew!';
            messageColor = 'yellow';
            LOSTSOUND.play();
        }

        document.querySelector('#blackjack').textContent = message;
        document.querySelector('#blackjack').style.color = messageColor;
    }
}

