import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GamelogicsService {
  cards = {
    colors: ['C', 'S', 'D', 'H'],
    numbers: ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'],
  };

  ranks: any = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    't',
    'j',
    'q',
    'k',
    'a',
  ];

  playingStack: string[] = [];

  constructor() {}

  renderPlayingStack() {
    this.renderCardStack();
    this.shuffleStack(this.playingStack);
  }

  renderCardStack() {
    this.playingStack = [];
    this.cards.colors.forEach((color: any) => {
      this.setColor(color);
    });
  }

  setColor(color: any) {
    this.cards.numbers.forEach((number) => {
      this.playingStack.push(color + number);
    });
  }

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} arrey
   * @returns same arrey mixed
   */
  shuffleStack(arrey: string[]): Array<any> {
    arrey.forEach((card: string, i: number) => {
      const j = Math.floor(Math.random() * (i + 1));
      [arrey[i], arrey[j]] = [arrey[j], arrey[i]];
    });
    return arrey;
  }

  /**
   * generate random number; for example use 0.1 to 3
   * but you can use 0 to infinite ( however, that makes no sense)
   * @param {Number} min
   * @param {Number} max
   * @returns random number between min and max
   */
  getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  handAnalyzer(usedCards: any) {
    let royalFlush,
      straightFlush,
      fourOfAKind,
      fullHouse,
      flush,
      straight,
      threeOfAKind,
      twoPair,
      onePair,
      highCard;

    console.log('checkOnePair', this.checkOnePair(usedCards));

    if (this.isFourOfAKind(usedCards)) fourOfAKind = true;

    if (this.isFullHouse(usedCards)) fullHouse = true;

    if (this.isThreeOfAKind(usedCards)) threeOfAKind = true;

    if (this.isTwoPair(usedCards)) twoPair = true;

    if (this.isOnePair(usedCards)) onePair = true;

    let winningHand;
    if (royalFlush) {
      winningHand = 'Royal Flush';
    } else if (straightFlush) {
      winningHand = 'Straight Flush';
    } else if (fourOfAKind) {
      winningHand = 'Four of a Kind ' + this.checkOnePair(usedCards)[0];
    } else if (fullHouse) {
      winningHand =
        'Full House ' +
        this.checkOnePair(usedCards)[0] +
        ' & ' +
        this.checkOnePair(usedCards)[2];
    } else if (flush) {
      winningHand = 'Flush';
    } else if (straight) {
      winningHand = 'Straight';
    } else if (threeOfAKind) {
      winningHand = 'Three of a Kind ' + this.checkOnePair(usedCards)[0];
    } else if (twoPair) {
      winningHand = 'Two Pair';
    } else if (onePair) {
      winningHand = 'One Pair ' + this.checkOnePair(usedCards)[0];
    } else {
      winningHand = 'High Card';
    }
    //return the winning hand
    return winningHand;
  }

  checkOnePair(usedCards: any) {
    let pair: any = [];
    for (let i = 0; i < usedCards.length - 1; i++) {
      if (usedCards[i].charAt(1) == usedCards[i + 1].charAt(1)) {
        pair.push(usedCards[i].charAt(1));
      }
    }
    return pair;
  }

  //function to check a hand in Texas holdem
  checkHand(hand: any) {
    //array of possible winning hands in order from highest to lowest
    const winningHands = [
      'Royal Flush',
      'Straight Flush',
      'Four of a Kind',
      'Full House',
      'Flush',
      'Straight',
      'Three of a Kind',
      'Two Pair',
      'One Pair',
      'High Card',
    ];
    //convert given hand into an array
    let handArray = hand.split(',');
    //sort the array based on card ranks
    handArray.sort(function (a: string, b: string) {
      return ranks.indexOf(a.charAt(0)) - ranks.indexOf(b.charAt(0));
    });
    //array of possible card ranks
    let ranks = [
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'T',
      'J',
      'Q',
      'K',
      'A',
    ];
    //determine if the hand is a royal flush
    let royalFlush = false;
    if (
      handArray[0].charAt(0) === 'T' &&
      handArray[1].charAt(0) === 'J' &&
      handArray[2].charAt(0) === 'Q' &&
      handArray[3].charAt(0) === 'K' &&
      handArray[4].charAt(0) === 'A'
    ) {
      royalFlush = true;
    }
    //determine if the hand is a straight flush
    let straightFlush = false;
    if (
      handArray[4].charAt(0) ===
        ranks[ranks.indexOf(handArray[0].charAt(0)) + 4] &&
      handArray[0].charAt(1) === handArray[1].charAt(1) &&
      handArray[1].charAt(1) === handArray[2].charAt(1) &&
      handArray[2].charAt(1) === handArray[3].charAt(1) &&
      handArray[3].charAt(1) === handArray[4].charAt(1)
    ) {
      straightFlush = true;
    }

    //determine if the hand is a flush
    let flush = false;
    if (
      handArray[0].charAt(1) === handArray[1].charAt(1) &&
      handArray[1].charAt(1) === handArray[2].charAt(1) &&
      handArray[2].charAt(1) === handArray[3].charAt(1) &&
      handArray[3].charAt(1) === handArray[4].charAt(1)
    ) {
      flush = true;
    }
    //determine if the hand is a straight
    let straight = false;
    if (
      handArray[4].charAt(0) ===
      ranks[ranks.indexOf(handArray[0].charAt(0)) + 4]
    ) {
      straight = true;
    }
  }

  isFourOfAKind(usedCards: any) {
    return (
      this.checkOnePair(usedCards).length == 3 &&
      this.checkOnePair(usedCards)[0] == this.checkOnePair(usedCards)[2]
    );
  }

  isFullHouse(usedCards: any) {
    return (
      this.checkOnePair(usedCards).length == 3 &&
      this.checkOnePair(usedCards)[0] != this.checkOnePair(usedCards)[2]
    );
  }

  isFlush(usedCards: any) {
    return 'torte';
  }

  isStraight(usedCards: any) {
    return 'torte';
  }

  isThreeOfAKind(usedCards: any) {
    return this.checkOnePair(usedCards).length == 2;
  }

  isTwoPair(usedCards: any) {
    return (
      this.checkOnePair(usedCards).length == 2 &&
      this.checkOnePair(usedCards)[0] != this.checkOnePair(usedCards)[1]
    );
  }

  isOnePair(usedCards: any) {
    return this.checkOnePair(usedCards).length == 1;
  }
}
