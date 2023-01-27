import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GamelogicsService {
  cards = {
    colors: ['clubs', 'spades', 'diamonds', 'hearts'],
    numbers: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
    ],
  };

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
      this.playingStack.push(color + '_' + number);
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
}
