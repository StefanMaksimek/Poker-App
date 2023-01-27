import { Component, OnInit } from '@angular/core';
import { GamelogicsService } from 'src/app/Services/gamelogics.service';
import { Game } from 'src/assets/models/game.class';
import { Player } from 'src/assets/models/player.class';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game!: Game;

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
  players: any[] = [this.player1, this.player2, this.player3, this.player4];

  constructor(private gameLog: GamelogicsService) {}

  placeAround(i: number) {
    let splitDeg = (360 / this.game.players.length) * (i + 1);

    return splitDeg;
  }

  getAmount(i: number) {
    return this.game.players[i].actGames.abc.stack;
  }
  ngOnInit(): void {
    this.newGame();
    this.renderFlop();
  }

  newGame() {
    this.game = new Game();
    this.game.players.push(this.player1);
    this.game.players.push(this.player2);
    this.game.players.push(this.player3);
    this.game.players.push(this.player4);
    this.game.setGameInfoToPlayer();
    this.renderStack();

    console.log(this.game.players);
  }

  renderStack() {
    this.gameLog.renderPlayingStack();
    this.game.playingStack = [];
    this.game.flop = [];
    this.game.turn = [];
    this.game.river = [];
    this.game.playingStack = this.gameLog.playingStack;

    console.log('playingStack', this.game.playingStack);
  }

  renderFlop() {
    this.game.playingStack.pop();
    this.game.flop.push(this.game.playingStack.pop());
    this.game.flop.push(this.game.playingStack.pop());
    this.game.flop.push(this.game.playingStack.pop());

    console.log(this.game.playingStack);
  }

  renderTurn() {
    this.game.playingStack.pop();
    this.game.turn.push(this.game.playingStack.pop());

    console.log(this.game.playingStack);
  }

  renderRiver() {
    this.game.playingStack.pop();
    this.game.river.push(this.game.playingStack.pop());

    console.log(this.game.playingStack);
  }

  fold() {
    this.game.playerInRound[this.game.curentPlayer].actGames[
      this.game.id
    ].actHand = [];
    if (this.game.playerInRound.length > 1) {
      this.game.nextPlayer();
    } else {
      this.game.startNewRound();
    }

    console.log('playerInRound', this.game.playerInRound);
  }
}
