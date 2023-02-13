import { Component, OnInit } from '@angular/core';
import { GamelogicsService } from 'src/app/Services/gamelogics.service';
import { Game } from 'src/assets/models/game.class';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game!: Game;

  betValue: any = 0;

  logedInUser: any = {
    id: '56g4jh5fdg45n47f',
    image: 'icon_male_6.png',
    name: 'TortenToni',
    amount: 20698,
    color: '#16a085',
  };

  player1: any = {
    id: '56g4jhh4dfgb4d',
    image: 'icon_male_6.png',
    name: 'TortenToni',
    amount: 20698,
    color: '#16a085',
    actGames: {},
  };
  player2: any = {
    id: '56g4jh568ds4b6d4g655n47f',
    image: 'icon_female_4.jpg',
    name: 'LügenLischen',
    amount: 20698,
    color: '#2c3e50',
    actGames: {},
  };
  player3: any = {
    id: '56g4jh5fdg45n47f',
    image: 'icon_male_5.jpg',
    name: 'KantholzKatrin',
    amount: 20698,
    color: '#8e44ad',
    actGames: {},
  };
  player4: any = {
    id: '45g64j5fgh4fd5',
    image: 'icon_female_5.jpg',
    name: 'GürtelGustav',
    amount: 20698,
    color: '#b65a64',
    actGames: {},
  };
  player5: any = {
    id: '45g54sd5sh4fd5',
    image: 'icon_female_5.jpg',
    name: 'BüffelBluffer',
    amount: 20698,
    color: '#b65a64',
    actGames: {},
  };
  player6: any = {
    id: '45g645fds4bgh4fd5',
    image: 'icon_female_5.jpg',
    name: 'StutenAndy',
    amount: 20698,
    color: '#b65a64',
    actGames: {},
  };
  player7: any = {
    id: '45g64j55fs3dffd5',
    image: 'icon_female_5.jpg',
    name: 'KingKalle',
    amount: 20698,
    color: '#b65a64',
    actGames: {},
  };
  player8: any = {
    id: '45g64j5fgh4fd5',
    image: 'icon_female_5.jpg',
    name: 'Die8dieLacht',
    amount: 20698,
    color: '#b65a64',
    actGames: {},
  };
  players: any[] = [this.player1, this.player2, this.player3, this.player4];

  constructor(private gameLog: GamelogicsService) {}

  ngOnInit(): void {
    this.newGame();
    this.setBetValue();
  }

  setBetValue() {
    this.betValue =
      this.game.lastBet > 0 ? this.game.lastBet * 2 : this.game.blinds[1];
  }

  placeAround(i: number) {
    let splitDeg = (360 / this.game.players.length) * (i + 1);

    return splitDeg;
  }

  getAmount(i: number) {
    return this.game.players[i].actGames.abc.stack;
  }

  newGame() {
    this.game = new Game(this.gameLog);
    this.game.players.push(this.player1);
    this.game.players.push(this.player2);
    this.game.players.push(this.player3);
    this.game.players.push(this.player4);
    this.game.setGameInfoToPlayer();
    this.game.renderStack();
    this.test2();
    this.game.startNewRound();
  }

  setBet(p: number) {
    let lastBet = +((this.game.pot * p) / 100).toFixed(0);
    if (this.game.players[0].actGames[this.game.id].stack > lastBet) {
      this.betValue = lastBet;
    } else {
      this.betValue = this.game.players[0].actGames[815].stack;
    }
  }

  fold() {
    console.log('fold');

    let actPlayer = this.game.curentPlayerInRound;
    this.game.players[this.game.playerInRound[actPlayer]].actGames[
      this.game.id
    ].actHand = [];

    this.nextPlayerAfterAction();
  }

  call() {
    console.log('call');
    let player =
      this.game.players[this.game.curentPlayerInRound].actGames[this.game.id];

    let stack = player.stack;

    if (stack > this.game.lastBet - player.bet) {
      player.stack = stack - this.game.lastBet + player.bet;
      this.game.pot = this.game.pot - player.bet + this.game.lastBet;
      player.bet = this.game.lastBet;
    } else {
      this.game.pot = this.game.pot - player.bet + stack;
      player.bet = stack;
      this.game.players[this.game.curentPlayerInRound].actGames[
        this.game.id
      ].stack = 0;
    }

    this.nextPlayerAfterAction();
  }

  check() {
    if (
      this.game.players[this.game.curentPlayerInRound].actGames[this.game.id]
        .isBB
    ) {
      this.game.newBetRound();
    } else {
      this.game.players[this.game.curentPlayerInRound].actGames[
        this.game.id
      ].checked = true;
      this.game.nextPlayerInRound();
      if (
        this.game.players[this.game.curentPlayerInRound].actGames[this.game.id]
          .checked
      ) {
        this.game.newBetRound();
      }
    }
  }

  bet() {
    console.log('bet');

    let player =
      this.game.players[this.game.curentPlayerInRound].actGames[this.game.id];
    let stack = player.stack;

    player.stack = stack - this.betValue;
    player.bet = this.betValue;
    this.game.lastBet = this.betValue;
    this.game.pot = this.game.pot + this.betValue;
    this.nextPlayerAfterAction();
  }

  nextPlayerAfterAction() {
    console.log('nextPlayerAfterAction');

    this.game.nextPlayerInRound();

    let newPlayer =
      this.game.players[this.game.curentPlayerInRound].actGames[this.game.id];
    if (newPlayer.bet == this.game.lastBet && !newPlayer.isBB) {
      this.game.newBetRound();
    }
    this.setBetValue();
  }

  calcMinBet() {
    let minBet =
      this.game.lastBet > 0 ? this.game.lastBet * 2 : this.game.blinds[1];
    if (
      minBet >
      this.game.players[this.game.curentPlayerInRound].actGames[this.game.id]
        .stack
    ) {
      return this.game.players[this.game.curentPlayerInRound].actGames[
        this.game.id
      ].stack;
    } else {
      return minBet;
    }
  }

  test() {
    this.game.players.forEach((player) => {
      console.log('############');
      console.log('Name', player.name);
      console.log('actHand', player.actGames[this.game.id].actHand);
      console.log('usedHand', player.actGames[this.game.id].possibleCards);
    });
  }

  test2() {
    let colorRanks = this.gameLog.cards.colors;
    let numberRanks = this.gameLog.cards.numbers;
    let hand = ['H2', 'H3', 'H4', 'Ha', 'H6', 'H7', 'H8'];

    hand.sort(function (a: any, b: any) {
      return (
        numberRanks.indexOf(a.charAt(1)) - numberRanks.indexOf(b.charAt(1)) ||
        colorRanks.indexOf(a.charAt(0)) - colorRanks.indexOf(b.charAt(0))
      );
    });
    this.gameLog.handAnalyzer(hand);
    console.log(this.gameLog.handAnalyzer(hand));
  }
}
