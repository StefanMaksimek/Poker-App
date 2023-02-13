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

  winningHands = [
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

  handAnalyzer(possibleCards: any) {
    let royalFlush,
      straightFlush,
      fourOfAKind,
      fullHouse,
      flush,
      straight,
      threeOfAKind,
      twoPair,
      onePair;

    let winningHand;
    if (
      this.isStraight(possibleCards) &&
      this.isFlush(possibleCards) &&
      this.checkForStraight(possibleCards).hand[4] == 'a'
    ) {
      winningHand = 'Royal Flush';
    } else if (this.isStraight(possibleCards) && this.isFlush(possibleCards)) {
      winningHand =
        'Straight Flush ' +
        'from ' +
        this.checkForStraight(possibleCards).hand[0] +
        ' to ' +
        this.checkForStraight(possibleCards).hand[4];
    } else if (this.isFourOfAKind(possibleCards)) {
      winningHand = 'Four of a Kind ' + this.checkForPairs(possibleCards)[0];
    } else if (this.isFullHouse(possibleCards)) {
      winningHand =
        'Full House ' +
        this.checkForPairs(possibleCards)[0] +
        ' & ' +
        this.checkForPairs(possibleCards)[2];
    } else if (this.isFlush(possibleCards)) {
      winningHand = this.checkForFlush(possibleCards).name;
    } else if (this.isStraight(possibleCards)) {
      winningHand = this.checkForStraight(possibleCards).name;
    } else if (this.isThreeOfAKind(possibleCards)) {
      winningHand = 'Three of a Kind ' + this.checkForPairs(possibleCards)[0];
    } else if (this.isTwoPair(possibleCards)) {
      winningHand =
        'Two Pair ' +
        this.checkForPairs(possibleCards)[0] +
        ' & ' +
        this.checkForPairs(possibleCards)[1];
    } else if (this.isOnePair(possibleCards)) {
      winningHand = 'One Pair ' + this.checkForPairs(possibleCards)[0];
    } else {
      winningHand = 'High Card ' + possibleCards[possibleCards.length - 1];
    }
    //return the winning hand
    return winningHand;
  }

  checkForPairs(possibleCards: any) {
    let pair: any = [];
    /* for (let i = 0; i < possibleCards.length - 1; i++) {
      if (possibleCards[i].charAt(1) == possibleCards[i + 1].charAt(1)) {
        pair.push(possibleCards[i].charAt(1));
      }
    } */

    for (let i = 0; i < possibleCards.length - 1; i++) {
      if (possibleCards[i].charAt(1) == possibleCards[i + 1].charAt(1)) {
        pair.push(possibleCards[i]);
        pair.push(possibleCards[i + 1]);
      }
    }
    pair = pair.filter(function (elem: any, index: any, self: any) {
      return index === self.indexOf(elem);
    });
    return pair;
  }

  checkForStraight(possibleCards: any) {
    let streetArr: any = [];
    possibleCards.forEach((card: any) => {
      streetArr.push(card.charAt(1));
    });
    streetArr = streetArr.filter(function (elem: any, index: any, self: any) {
      return index === self.indexOf(elem);
    });
    //return streetArr;
    return {
      hand: streetArr,
      name:
        'Straight from ' +
        this.nameNumbers(streetArr[0].charAt(1)) +
        ' to ' +
        this.nameNumbers(streetArr[4].charAt(1)),
    };
  }

  checkForFlush(possibleCards: any) {
    let colors: any = this.cards.colors;
    let flushArr: any = [];
    colors.forEach((color: any) => {
      let x = 0;
      let testArr: any = [];
      possibleCards.forEach((card: any) => {
        if (card.charAt(0) == color) {
          testArr.push(card);
          x++;
        }
      });
      console.log(x);

      if (x >= 5) {
        flushArr = testArr;
      }
    });
    return {
      hand: flushArr,
      name: this.nameFlushHand(flushArr),
    };
  }

  isFourOfAKind(possibleCards: any) {
    return (
      this.checkForPairs(possibleCards).length == 3 &&
      this.checkForPairs(possibleCards)[0] ==
        this.checkForPairs(possibleCards)[2]
    );
  }

  isFullHouse(possibleCards: any) {
    return (
      this.checkForPairs(possibleCards).length == 3 &&
      this.checkForPairs(possibleCards)[0] !=
        this.checkForPairs(possibleCards)[2]
    );
  }

  isFlush(possibleCards: any) {
    return this.checkForFlush(possibleCards).hand.length >= 5;
  }
  nameFlushHand(flushArr: any) {
    if (flushArr.length >= 5) {
      return (
        'Flush with high card ' +
        this.nameNumbers(flushArr[flushArr.length - 1].charAt(1))
      );
    } else {
      return 'torte';
    }
  }

  isStraight(possibleCards: any) {
    return this.checkForStraight(possibleCards).hand == 5;
  }

  isThreeOfAKind(possibleCards: any) {
    return (
      this.checkForPairs(possibleCards).length == 2 &&
      this.checkForPairs(possibleCards)[0] ==
        this.checkForPairs(possibleCards)[1]
    );
  }

  isTwoPair(possibleCards: any) {
    return (
      this.checkForPairs(possibleCards).length == 2 &&
      this.checkForPairs(possibleCards)[0] !=
        this.checkForPairs(possibleCards)[1]
    );
  }

  isOnePair(possibleCards: any) {
    return this.checkForPairs(possibleCards).length == 1;
  }

  nameNumbers(cardNumber: string) {
    if (cardNumber == 'a') {
      return 'Ace';
    } else if (cardNumber == 'k') {
      return 'King';
    } else if (cardNumber == 'q') {
      return 'Qeen';
    } else if (cardNumber == 'j') {
      return 'Jack';
    } else if (cardNumber == 't') {
      return '10';
    } else {
      return cardNumber;
    }
  }
}
