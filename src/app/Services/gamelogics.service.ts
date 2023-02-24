import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GamelogicsService {
  cards = {
    colors: ['C', 'S', 'D', 'H'],
    numbers: ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'],
  };

  numberMap: { [key: string]: string } = {
    a: 'Ace',
    k: 'King',
    q: 'Queen',
    j: 'Jack',
    t: '10',
  };

  numberMapS: { [key: string]: string } = {
    a: 'Aces',
    k: 'Kings',
    q: 'Queens',
    j: 'Jacks',
    t: '10s',
    '9': 'Niners',
    '8': 'Eights',
    '7': 'Sevens',
    '6': 'Sixes',
    '5': 'Fives',
    '4': 'Fours',
    '3': 'Threes',
    '2': 'Deuces',
  };

  colorMap: { [key: string]: string } = {
    S: 'Spades',
    C: 'Clubs',
    D: 'Diamonds',
    H: 'Hearts',
  };

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

  winAnalyzer(playerHands: any) {
    let winningHands: any = this.setWinningHands(playerHands);
    let winningHand: any = winningHands[0].name;

    if (winningHands.length > 1) {
      if (this.winningHandhasKickers(winningHand)) {
        return this.findAllWinersWithKickers(winningHands);
      }

      if (winningHand == 'Straight') {
        return this.findAllWinersWithStraight(winningHands);
      }

      if (winningHand == 'Flush') {
        return this.findAllWinersWithFlush(winningHands);
      }

      if (winningHand == 'Straight Flush' || 'Royal Flush') {
        return this.findAllWinersWithStraight(winningHands);
      }
    }
    return {
      Torte: 'noSplitPot',
      winners: [winningHands[0]],
      name: winningHands[0].handInfo,
    };
  }

  findAllWinersWithFlush(winningHands: any) {
    let rank = this.cards.numbers;
    let winners: any = [];
    winningHands.sort((a: any, b: any) => {
      return this.sortbyFlush(a, b, rank);
    });
    let winningHand = winningHands[0].hand.join('');
    winningHands.forEach((player: any) => {
      if (player.hand.join('') == winningHand) {
        winners.push(player);
      }
    });
    return { Torte: 'Flush', winners: winners, name: winningHands[0].handInfo };
  }

  findAllWinersWithStraight(winningHands: any) {
    let rank = this.cards.numbers;
    let winners: any = [];
    winningHands.sort((a: any, b: any) => {
      return rank.indexOf(b.hand[4]) - rank.indexOf(a.hand[4]);
    });
    let winningHand = winningHands[0].hand.join('');
    winningHands.forEach((player: any) => {
      if (player.hand.join('') == winningHand) {
        winners.push(player);
      }
    });

    return { Torte: 'straight', winners: winners, name: winningHands[0].name };
  }

  findAllWinersWithKickers(winningHands: any) {
    let rank = this.cards.numbers;
    let testArr: any = [];
    let winners: any = [];

    winningHands.sort((a: any, b: any) => {
      return this.sortbyPairs(a, b, rank);
    });
    let winningPairs = winningHands[0].pairs.join('');
    winningHands.forEach((player: any) => {
      if (player.pairs.join('') == winningPairs) {
        testArr.push(player);
      }
    });

    testArr.sort((a: any, b: any) => {
      return this.sortbyKickers(a, b, rank);
    });
    let winningKickers = testArr[0].kickers.join('');
    testArr.forEach((player: any) => {
      if (player.kickers.join('') == winningKickers) {
        let name = player.playerName;
        winners.push(player);
      }
    });

    return {
      Torte: 'kickers',
      winners: winners,
      handInfo: winningHands[0].handInfo,
    };
  }

  sortAndFilterByPairs(arr: any) {
    let rank = this.cards.numbers;
    let testArr: any = [];
    arr.sort((a: any, b: any) => {
      return this.sortbyPairs(a, b, rank);
    });
    let winningPairs = arr[0].pairs.join('');
    arr.forEach((player: any) => {
      if (player.pairs.join('') == winningPairs) {
        testArr.push(player);
      }
    });

    return testArr;
  }

  sortAndFilterByKickers(arr: any) {
    let rank = this.cards.numbers;
    let testArr: any = [];
    arr.sort((a: any, b: any) => {
      return this.sortbyKickers(a, b, rank);
    });
    let winningKickers = arr[0].kickers.join('');
    arr.forEach((player: any) => {
      if (player.kickers.join('') == winningKickers) {
        testArr.push(player.playerName);
      }
    });
    return testArr;
  }

  winningHandhasKickers(winningHand: any) {
    return (
      winningHand == 'High Card' ||
      winningHand == 'Four of a Kind' ||
      winningHand == 'Full House' ||
      winningHand == 'Three of a Kind' ||
      winningHand == 'Two Pair' ||
      winningHand == 'One Pair'
    );
  }

  sortbyKickers(a: any, b: any, rank: any) {
    for (let i = 0; i < a.kickers.length; i++) {
      let diff = rank.indexOf(b.kickers[i]) - rank.indexOf(a.kickers[i]);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  }

  sortbyPairs(a: any, b: any, rank: any) {
    for (let i = 0; i < a.pairs.length; i++) {
      let diff = rank.indexOf(b.pairs[i]) - rank.indexOf(a.pairs[i]);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  }

  sortbyFlush(a: any, b: any, rank: any) {
    for (let i = 0; i < a.hand.length; i++) {
      let diff =
        rank.indexOf(b.hand[b.hand.length - i - 1].charAt(1)) -
        rank.indexOf(a.hand[a.hand.length - i - 1].charAt(1));

      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  }

  playersHaveSameHand(winningHands: any) {
    return winningHands[0].name == winningHands[1].name;
  }

  setWinningHands(playerHands: any) {
    let winningHands: any = [];
    let win = false;
    this.winningHands.forEach((hand: any) => {
      if (!win) {
        playerHands.forEach((playerHand: any) => {
          if (playerHand.name == hand) {
            winningHands.push(playerHand);
          }
          if (winningHands.length > 0) {
            win = true;
          }
        });
      }
    });
    return winningHands;
  }

  handAnalyzer(possibleCards: any): any {
    let handInfo;
    if (
      this.isStraight(this.checkForFlush(possibleCards).hand) &&
      this.checkForStraight(this.checkForFlush(possibleCards).hand).hand[4] ==
        'a'
    ) {
      handInfo = this.setStraightFlushHand(
        this.checkForFlush(possibleCards).hand
      );
    } else if (this.isStraight(this.checkForFlush(possibleCards).hand)) {
      handInfo = this.setStraightFlushHand(
        this.checkForFlush(possibleCards).hand
      );
    } else if (this.isFourOfAKind(possibleCards)) {
      handInfo = this.checkForPairs(possibleCards);
    } else if (this.isFullHouse(possibleCards)) {
      handInfo = this.checkForPairs(possibleCards);
    } else if (this.isFlush(possibleCards)) {
      handInfo = this.checkForFlush(possibleCards);
    } else if (this.isStraight(possibleCards)) {
      handInfo = this.checkForStraight(possibleCards);
    } else if (this.isThreeOfAKind(possibleCards)) {
      handInfo = this.checkForPairs(possibleCards);
    } else if (this.isTwoPair(possibleCards)) {
      handInfo = this.checkForPairs(possibleCards);
    } else if (this.isOnePair(possibleCards)) {
      handInfo = this.checkForPairs(possibleCards);
    } else {
      handInfo = this.setHighCardHand(possibleCards);
    }
    //return the winning hand
    return handInfo;
  }

  setStraightFlushHand(cards: any) {
    let rank = this.cards.numbers;
    let hand = this.checkForFlush(cards).hand;
    hand.sort((a: any, b: any) => {
      return rank.indexOf(b.charAt(1)) - rank.indexOf(a.charAt(1));
    });
    if (hand[0].charAt(1) == 'a') {
      return {
        hand: hand,
        handInfo: 'Royal Flush',
        name: 'Royal Flush',
      };
    } else {
      return {
        hand: hand,
        handInfo:
          'Straight Flush from ' +
          this.nameNumbers(hand[4].charAt(1)) +
          ' to ' +
          this.nameNumbers(hand[0].charAt(1)),
        name: 'Straight Flush',
      };
    }
  }

  setHighCardHand(possibleCards: any) {
    let rank = this.cards.numbers;
    let hand = this.setHandForHighCard(possibleCards);
    hand.sort((a: any, b: any) => {
      return rank.indexOf(b.charAt(1)) - rank.indexOf(a.charAt(1));
    });
    return {
      hand: hand,
      handInfo: 'High Card ' + this.nameNumbers(hand[0].charAt(1)),
      name: 'High Card',
      kickers: [
        hand[1].charAt(1),
        hand[2].charAt(1),
        hand[3].charAt(1),
        hand[4].charAt(1),
      ],
    };
  }

  setHandForHighCard(possibleCards: any) {
    if (possibleCards.length == 7) {
      return possibleCards.slice(2, 7);
    }
    if (possibleCards.length == 6) {
      return possibleCards.slice(1, 6);
    }
    if (possibleCards.length == 5) {
      return possibleCards;
    }
  }

  checkForPairs(possibleCards: any) {
    let holdArr: any = [];
    let pair: any = [];

    pair = this.setPairArr(possibleCards);
    holdArr = this.setHoldArr(pair, possibleCards);

    let handInfo = this.namePairedHand(holdArr, possibleCards).x;
    let name = this.namePairedHand(holdArr, possibleCards).y;
    let kickers = this.namePairedHand(holdArr, possibleCards).z;
    let pairs = this.namePairedHand(holdArr, possibleCards).a;

    return {
      hand: holdArr,
      handInfo: handInfo,
      name: name,
      pairs: pairs,
      kickers: kickers,
    };
  }

  setPairArr(possibleCards: any) {
    let numberRanks = this.cards.numbers;
    let pair: any = [];
    for (let i = 0; i < possibleCards.length - 1; i++) {
      if (possibleCards[i].charAt(1) == possibleCards[i + 1].charAt(1)) {
        pair.push(possibleCards[i].charAt(1));
      }
    }

    let counts = pair.reduce((acc: any, val: any) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    pair.sort(
      (a: any, b: any) =>
        counts[b] - counts[a] || numberRanks.indexOf(b) - numberRanks.indexOf(a)
    );
    if (pair.length > 2) {
      pair = pair.slice(0, 2);
    }

    pair = this.showValueOnlyOnce(pair);
    return pair;
  }

  setHoldArr(pair: any, possibleCards: any) {
    let holdArr: any = [];
    pair.forEach((number: any) => {
      possibleCards.forEach((card: any) => {
        if (card.charAt(1) == number) {
          holdArr.push(card);
        }
      });
    });

    holdArr = this.showValueOnlyOnce(holdArr);
    return this.setHoldArrHelper(holdArr, possibleCards);
  }

  setHoldArrHelper(holdArr: any, possibleCards: any) {
    if (holdArr.length > 5) {
      holdArr = holdArr.slice(0, 5);
    }
    if (holdArr.length < 5) {
      let newArr = possibleCards.filter(
        (value: any) => !holdArr.includes(value)
      );

      for (let i = holdArr.length; i < 5; i++) {
        holdArr.push(newArr[possibleCards.length - 1 - holdArr.length]);
        //holdArr.push(newArr[6 - holdArr.length]);
      }
    }
    return holdArr;
  }

  checkForStraight(possibleCards: any) {
    let testArr: any = [];
    possibleCards.forEach((card: any) => {
      testArr.push(card.charAt(1));
    });
    testArr = this.showValueOnlyOnce(testArr);
    return this.straightHelperFn(testArr);
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

      if (x >= 5) {
        flushArr = testArr;
      }
    });
    if (flushArr.length > 5) {
      for (let i = 0; i < flushArr.length - 4; i++) {
        flushArr.shift();
      }
    }
    return {
      hand: flushArr,
      handInfo: this.nameFlushHand(flushArr),
      name: 'Flush',
      kickers: ['x'],
    };
  }

  isFourOfAKind(possibleCards: any) {
    return (
      this.checkForPairs(possibleCards).hand[0].charAt(1) ==
      this.checkForPairs(possibleCards).hand[3].charAt(1)
    );
  }

  isFullHouse(possibleCards: any) {
    return (
      this.checkForPairs(possibleCards).hand[0].charAt(1) ==
        this.checkForPairs(possibleCards).hand[2].charAt(1) &&
      this.checkForPairs(possibleCards).hand[3].charAt(1) ==
        this.checkForPairs(possibleCards).hand[4].charAt(1)
    );
  }

  isStraightFlush(possibleCards: any) {
    return this.checkForStraight(this.checkForFlush(possibleCards)).isStraight;
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
    return this.checkForStraight(possibleCards).isStraight;
  }

  isThreeOfAKind(possibleCards: any) {
    return (
      this.checkForPairs(possibleCards).hand[0].charAt(1) ==
      this.checkForPairs(possibleCards).hand[2].charAt(1)
    );
  }

  isTwoPair(possibleCards: any) {
    return (
      this.checkForPairs(possibleCards).hand[0].charAt(1) ==
        this.checkForPairs(possibleCards).hand[1].charAt(1) &&
      this.checkForPairs(possibleCards).hand[2].charAt(1) ==
        this.checkForPairs(possibleCards).hand[3].charAt(1)
    );
  }

  isOnePair(possibleCards: any) {
    return (
      this.checkForPairs(possibleCards).hand[0].charAt(1) ==
      this.checkForPairs(possibleCards).hand[1].charAt(1)
    );
  }

  namePairedHand(holdArr: any, possibleCards: any) {
    let x = 'a';
    let y = 'b';
    let z: any = [];
    let a: any = [];
    //Four of a Kind
    if (holdArr[0].charAt(1) == holdArr[3].charAt(1)) {
      x = 'Four of a Kind with ' + this.nameNumbers2(holdArr[0].charAt(1));
      y = 'Four of a Kind';
      z = [holdArr[4].charAt(1)];
      a = [
        holdArr[0].charAt(1),
        holdArr[1].charAt(1),
        holdArr[2].charAt(1),
        holdArr[3].charAt(1),
      ];
    }
    //Full House
    else if (
      holdArr[0].charAt(1) == holdArr[2].charAt(1) &&
      holdArr[3].charAt(1) == holdArr[4].charAt(1)
    ) {
      x =
        'Full House with: ' +
        this.nameNumbers2(holdArr[0].charAt(1)) +
        ' full of ' +
        this.nameNumbers2(holdArr[4].charAt(1));
      y = 'Full House';
      z = [];
      a = [
        holdArr[0].charAt(1),
        holdArr[1].charAt(1),
        holdArr[2].charAt(1),
        holdArr[3].charAt(1),
        holdArr[4].charAt(1),
      ];
    }
    //Three of a kind
    else if (holdArr[0].charAt(1) == holdArr[2].charAt(1)) {
      x = 'Three of a kind with ' + this.nameNumbers2(holdArr[0].charAt(1));
      y = 'Three of a Kind';
      z = [holdArr[3].charAt(1), holdArr[4].charAt(1)];
      a = [holdArr[0].charAt(1), holdArr[1].charAt(1), holdArr[2].charAt(1)];
    }
    //Two pair
    else if (
      holdArr[0].charAt(1) == holdArr[1].charAt(1) &&
      holdArr[2].charAt(1) == holdArr[3].charAt(1)
    ) {
      x =
        'Two Pair with ' +
        this.nameNumbers2(holdArr[0].charAt(1)) +
        ' & ' +
        this.nameNumbers2(holdArr[2].charAt(1));
      y = 'Two Pair';
      z = [holdArr[4].charAt(1)];
      a = [
        holdArr[0].charAt(1),
        holdArr[1].charAt(1),
        holdArr[2].charAt(1),
        holdArr[3].charAt(1),
      ];
    }
    //One pair
    else if (holdArr[0].charAt(1) == holdArr[1].charAt(1)) {
      x = 'One Pair with ' + this.nameNumbers2(holdArr[0].charAt(1));
      y = 'One Pair';
      z = [holdArr[2].charAt(1), holdArr[3].charAt(1), holdArr[4].charAt(1)];
      a = [holdArr[0].charAt(1), holdArr[1].charAt(1)];
    } else {
      x = 'torte';
    }
    return { x, y, z, a };
  }

  straightHelperFn(testArr: any) {
    if (this.checkForStraightHelper(testArr, 2, 6)) {
      return this.setStraightHand(testArr, 2, 6);
    } else if (this.checkForStraightHelper(testArr, 1, 5)) {
      return this.setStraightHand(testArr, 1, 5);
    } else if (this.checkForStraightHelper(testArr, 0, 4)) {
      return this.setStraightHand(testArr, 0, 4);
    } else if (this.isStraightAto5(testArr)) {
      return this.setStraightAto5();
    } else {
      return {
        hand: [],
        handInfo: 'no Straight',
        isStraight: false,
      };
    }
  }

  checkForStraightHelper(testArr: any, x: number, y: number) {
    return (
      this.cards.numbers.indexOf(testArr[x]) ==
      this.cards.numbers.indexOf(testArr[y]) - 4
    );
  }

  setStraightHand(testArr: any, x: number, y: number) {
    let streetArr = [];
    for (let i = x; i < y + 1; i++) {
      streetArr.push(testArr[i]);
    }
    return {
      hand: streetArr,
      handInfo:
        'Straight from ' +
        this.nameNumbers(streetArr[0]) +
        ' to ' +
        this.nameNumbers(streetArr[4]),
      isStraight: true,
      name: 'Straight',
      kickers: ['x'],
    };
  }

  isStraightAto5(testArr: any) {
    return (
      testArr[testArr.length - 1] == 'a' &&
      testArr[0] == '2' &&
      testArr[1] == '3' &&
      testArr[2] == '4' &&
      testArr[3] == '5'
    );
  }

  setStraightAto5() {
    return {
      hand: ['a', '2', '3', '4', '5'],
      handInfo: 'Straight from Ace to 5',
      isStraight: true,
      name: 'Straight',
      kickers: ['x'],
    };
  }

  nameNumbers(cardNumber: string): string {
    return this.numberMap[cardNumber] ?? cardNumber;
  }

  nameNumbers2(cardNumber: string): string {
    return this.numberMapS[cardNumber] ?? '';
  }

  nameColors(cardColor: string): string {
    return this.colorMap[cardColor] ?? '';
  }

  showValueOnlyOnce(arr: Array<any>) {
    arr = arr.filter(function (elem: any, index: any, self: any) {
      return index === self.indexOf(elem);
    });

    return arr;
  }

  getOccurrence(array: any, value: any) {
    return array.filter((v: any) => v === value).length;
  }
}
