import { GamelogicsService } from 'src/app/Services/gamelogics.service';

export class Game {
  public id: any = '815';
  public maxPlayer: number = 9;
  public startingStack: number = 30000;
  public json = this.toJson();

  public players: Array<any> = [];
  public curentPlayerRound: number = 0;
  public playerInRound: any[] = [];
  public curentPlayerInRound: number = 0;

  public playingStack: any = [];
  public flop: string[] = [];
  public turn: string[] = [];
  public river: string[] = [];
  public endOfRound: boolean = false;

  public blinds: number[] = [50, 100];
  public bets: string[] = [];
  public lastBet: number = 300;
  public pot: number = 7000;

  constructor(private gameLog: GamelogicsService) {}
  public toJson() {
    return {
      players: this.players,
      playerInRound: this.playerInRound,
      curentPlayerInRound: this.curentPlayerInRound,

      playingStack: this.playingStack,
      flop: this.flop,
      turn: this.turn,
      river: this.river,

      blinds: this.blinds,
      lastBet: this.lastBet,
    };
  }

  startNewRound() {
    this.playerInRound = [];
    this.players.forEach((player) => {
      this.playerInRound.push(player.actGames[this.id].seat);
      player.actGames[this.id].actHand = [];
      player.actGames[this.id].bet = 0;
    });
    this.renderStack();
    this.dealCards();
    this.pot = 0;
    this.nextPlayerAfterRound();
    this.lastBet = this.blinds[1];
  }

  newBetRound() {
    if (this.river.length > 0) {
      //this.startNewRound();
      this.checkWinningHand();
    } else {
      if (this.flop.length == 0) {
        this.renderFlop();
      } else if (this.turn.length == 0) {
        this.renderTurn();
      } else if (this.renderRiver.length == 0) {
        this.renderRiver();
      }

      this.players.forEach((player) => {
        player.actGames[this.id].bet = 0;
        player.actGames[this.id].isBB = false;
        player.actGames[this.id].checked = false;
      });
      this.lastBet = 0;
      this.curentPlayerInRound = this.curentPlayerRound;
      this.nextPlayerInRound();
    }
  }

  nextPlayerInRound() {
    let player = this.players[this.curentPlayerInRound].actGames[this.id];

    if (this.checkHandsInGame() < 3) {
      this.startNewRound();
    } else {
      this.curentPlayerInRound == this.playerInRound.length - 1
        ? (this.curentPlayerInRound = 0)
        : this.curentPlayerInRound++;

      if (this.noHand(this.curentPlayerInRound)) {
        this.nextPlayerInRound();
      }
    }
  }

  nextPlayerAfterRound() {
    this.curentPlayerRound == this.players.length - 1
      ? (this.curentPlayerRound = 0)
      : this.curentPlayerRound++;
    this.curentPlayerInRound = this.curentPlayerRound;
    this.nextPlayerInRound();
    this.setBlinds(this.curentPlayerInRound, 0);
    this.nextPlayerInRound();
    this.setBlinds(this.curentPlayerInRound, 1);
    this.nextPlayerInRound();
  }

  renderFlop() {
    this.playingStack.pop();
    this.flop.push(this.playingStack.pop());
    this.flop.push(this.playingStack.pop());
    this.flop.push(this.playingStack.pop());
  }

  renderTurn() {
    this.playingStack.pop();
    this.turn.push(this.playingStack.pop());
  }

  renderRiver() {
    this.playingStack.pop();
    this.river.push(this.playingStack.pop());
  }

  renderStack() {
    this.gameLog.renderPlayingStack();
    this.playingStack = [];
    this.flop = [];
    this.turn = [];
    this.river = [];
    this.playingStack = this.gameLog.playingStack;
  }

  dealCards() {
    for (let i = 0; i < 2; i++) this.dealCardToPlayer();
  }

  dealCardToPlayer() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].actGames[this.id].actHand.push(this.playingStack.pop());
    }
  }

  setBlinds(seat: number, blind: number) {
    let player = this.players[seat].actGames[this.id];

    player.bet = this.blinds[blind];
    player.stack = player.stack - this.blinds[blind];
    if (blind == 1) {
      player.isBB = true;
    }
    this.pot = this.blinds[0] + this.blinds[1];
  }

  setGameInfoToPlayer() {
    let id = this.id;
    this.players.forEach((player, index) => {
      player.actGames[id] = {
        stack: this.startingStack,
        actHand: [],
        possibleCards: [],
        usedCards: [],
        hand: '',
        seat: index,
        bet: 300,
        isBB: false,
        checked: false,
      };
    });
  }

  loadImages() {
    this.playingStack.forEach((card: any) => {
      let img = new Image();
      img.src = `assets/img/cards/${card}.png`;
    });
  }

  noHand(actPlayer: number) {
    return this.players[actPlayer].actGames[this.id].actHand.length == 0;
  }

  checkHandsInGame() {
    let hands = 0;
    this.players.forEach((player) => {
      hands = hands + player.actGames[this.id].actHand.length;
    });

    return hands;
  }
  checkWinningHand() {
    let colorRanks = this.gameLog.cards.colors;
    let numberRanks = this.gameLog.cards.numbers;

    this.endOfRound = true;
    this.players.forEach((player) => {
      this.setUsedHand(player);

      player.actGames[this.id].possibleCards.sort(function (a: any, b: any) {
        return (
          numberRanks.indexOf(a.charAt(1)) - numberRanks.indexOf(b.charAt(1)) ||
          colorRanks.indexOf(a.charAt(0)) - colorRanks.indexOf(b.charAt(0))
        );
      });

      if (player.actGames[this.id].actHand.length > 0) {
        player.actGames[this.id].hand = this.gameLog.handAnalyzer(
          player.actGames[this.id].possibleCards
        );
        console.log(
          'Player: ',
          player.name,
          'possibleCards',
          player.actGames[this.id].possibleCards
        );
        console.log(
          'Player: ',
          player.name,
          'Hand',
          player.actGames[this.id].hand
        );
      }
    });
  }

  setUsedHand(player: any) {
    player.actGames[this.id].possibleCards.push(this.flop[0]);
    player.actGames[this.id].possibleCards.push(this.flop[1]);
    player.actGames[this.id].possibleCards.push(this.flop[2]);
    player.actGames[this.id].possibleCards.push(this.turn[0]);
    player.actGames[this.id].possibleCards.push(this.river[0]);
    player.actGames[this.id].possibleCards.push(
      player.actGames[this.id].actHand[0]
    );
    player.actGames[this.id].possibleCards.push(
      player.actGames[this.id].actHand[1]
    );
    //player.actGames[this.id].possibleCards.sort();
  }
}
