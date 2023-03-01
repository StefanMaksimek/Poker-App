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
  public betValue: number = 0;

  public playingStack: any = [];
  public flop: string[] = [];
  public turn: string[] = [];
  public river: string[] = [];
  public isEndOfRound: boolean = false;
  public playerHands: any = [];
  public winningHand: any = [];
  public winningPlayer: any = [];

  public blinds: number[] = [50, 100];
  public bets: string[] = [];
  public lastBet: number = 0;
  public pot: number = 7000;

  public lastPot: any = 9999;
  public lastWinningHand: any = 'Torte';
  public lastWinningPlayer: any = ['Torten'];

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

  getHandInfo(id: any) {
    let colorRanks = this.gameLog.cards.colors;
    let numberRanks = this.gameLog.cards.numbers;
    let playerCards: any = this.getLoggedInUserHand(id);
    let possibleCards = [];
    if (this.flop.length > 2) {
      possibleCards = [this.flop[0], this.flop[1], this.flop[2]];
      if (this.turn.length > 1) {
        possibleCards.push(this.turn[0]);
      }
      if (this.river.length > 1) {
        possibleCards.push(this.river[0]);
      }
      playerCards.forEach((card: any) => {
        possibleCards.push(card);
      });
      possibleCards.sort(function (a: any, b: any) {
        return (
          numberRanks.indexOf(a.charAt(1)) - numberRanks.indexOf(b.charAt(1)) ||
          colorRanks.indexOf(a.charAt(0)) - colorRanks.indexOf(b.charAt(0))
        );
      });
      return this.gameLog.handAnalyzer(possibleCards).handInfo;
    } else {
      return null;
    }
  }

  getLoggedInUserHand(id: any) {
    let hand = null;
    this.players.forEach((player: any) => {
      if (player.id == id) {
        hand = player.actGames[this.id].actHand;
      }
    });
    return hand;
  }

  getcurrentUserID(id: any) {
    let userId = this.players[this.curentPlayerInRound].id;

    return userId;
  }

  nextPlayerInRound() {
    if (this.checkHandsInGame() < 3) {
      this.potToLastPlayerInRound();
      this.startNewRound();
    } else {
      this.curentPlayerInRound == this.playerInRound.length - 1
        ? (this.curentPlayerInRound = 0)
        : this.curentPlayerInRound++;
      this.nextIfCannotHandlNew();
    }
  }

  nextIfCannotHandlNew() {
    let player = this.players[this.curentPlayerInRound].actGames[this.id];

    if (player.wasAktive) {
      this.newBetRound();
    } else if (player.stack <= 0 || player.actHand.length == 0) {
      this.nextPlayerInRound();
    }
  }

  playerAllIn(): boolean {
    let x = 0;
    let y = 0;
    this.players.forEach((player: any) => {
      if (player.actGames[this.id].actHand.length > 0) {
        x++;
      }
      if (player.actGames[this.id].stack > 0) {
        y++;
      }
    });
    console.log('playerAllIn', x, y);

    return x == y;
  }

  startNewRound() {
    console.log(this.players);
    this.deletePlayerWithNoStack();
    console.log(this.players);
    if (this.players.length > 1) {
      this.playerInRound = [];
      this.wasAktiveTofalse();
      this.updateGameInfoForPlayer();
      this.nextPlayerAfterRound();
    } else {
      console.log('end of game');
    }
  }

  updateGameInfoForPlayer() {
    this.players.forEach((player, index) => {
      player.actGames[this.id].checked = false;
      player.actGames[this.id].actHand = [];
      player.actGames[this.id].hand = '';
      player.actGames[this.id].seat = index;
      player.actGames[this.id].bet = 0;
      this.playerInRound.push(player.actGames[this.id].seat);
    });
  }

  deletePlayerWithNoStack() {
    /*  this.players.forEach((player: any) => {
      if (player.actGames[this.id].stack == 0) {
        this.players.splice(player.actGames[this.id].seat, 1);
      }
    }); */
    let x = this.players.length;
    for (let i = 0; i < x; i++) {
      if (this.players[i].actGames[this.id].stack == 0) {
        this.players.splice(this.players[i].actGames[this.id].seat, 1);
        i = x;
        this.deletePlayerWithNoStack();
      }
    }
  }

  newBetRound() {
    this.setSidePot();

    this.wasAktiveTofalse();

    if (this.river.length > 0) {
      this.endOfRound();
    } else {
      if (this.flop.length == 0) {
        this.renderFlop();
      } else if (this.turn.length == 0) {
        this.renderTurn();
      } else if (this.renderRiver.length == 0) {
        this.renderRiver();
      }
      if (!this.playerAllIn()) {
        this.newBetRound();
      } else {
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
  }
  newBetRoundOld() {
    this.setSidePot();

    this.wasAktiveTofalse();

    if (this.river.length > 0) {
      this.endOfRound();
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

  endOfRound() {
    this.isEndOfRound = true;
    this.checkWinningHand();
    this.potToWinningPlayer();
    setTimeout(() => {
      this.isEndOfRound = false;
      this.startNewRound();
    }, 3000);
  }

  setSidePot() {
    let sidePot: any = [];
    let bets: any = [];
    this.players.forEach((player) => {
      let pl = player.actGames[this.id];

      if (pl.actHand.length > 0) {
        bets.push(pl.bet);
      }
    });
    for (let i = 0; i < bets.length; i++) {
      const element = bets[i];
    }
  }

  potToLastPlayerInRound() {
    this.players[this.curentPlayerInRound].actGames[this.id].stack += this.pot;
    this.lastPot = this.pot;
    this.pot = 0;
    this.lastWinningPlayer = this.players[this.curentPlayerInRound].name;
    this.lastWinningHand = 'other folded';
  }

  potToWinningPlayer() {
    let win = this.pot / this.winningPlayer.length;
    this.winningPlayer.forEach((player: any, index: number) => {
      this.players[player.seat].actGames[this.id].stack =
        this.players[player.seat].actGames[this.id].stack + win;
    });
    this.lastPot = this.pot;
    this.pot = 0;

    this.winningHand = [];
    this.winningPlayer = [];
  }

  nextPlayerAfterRound() {
    this.nextPlayer();
    this.renderStack();
    this.dealCards();
    this.nextPlayerInRound();
    this.setBlinds(this.curentPlayerInRound, 0);
    this.nextPlayerInRound();
    this.setBlinds(this.curentPlayerInRound, 1);
    this.nextPlayerInRound();
  }

  nextPlayer() {
    this.curentPlayerRound >= this.players.length - 1
      ? (this.curentPlayerRound = 0)
      : this.curentPlayerRound++;
    this.curentPlayerInRound = this.curentPlayerRound;
  }

  checkedTofalse() {
    this.players.forEach((player: any) => {
      player.actGames[this.id].checked = false;
    });
  }

  wasAktiveTofalse() {
    this.players.forEach((player: any) => {
      if (player.actGames[this.id].stack > 0) {
        player.actGames[this.id].wasAktive = false;
      }
    });
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
    this.lastBet = this.blinds[1];
  }

  setGameInfoToPlayer() {
    this.players.forEach((player, index) => {
      player.actGames[this.id] = {
        stack: this.startingStack,
        actHand: [],
        possibleCards: [],
        usedCards: [],
        hand: '',
        seat: index,
        bet: 0,
        isBB: false,
        checked: false,
        wasAktive: false,
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
    this.playerHands = [];
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
        let playerHand = this.gameLog.handAnalyzer(
          player.actGames[this.id].possibleCards
        );
        console.log('playerHands', this.playerHands);

        this.playerHands.push({
          playerName: player.name,
          seat: player.actGames[this.id].seat,
          hand: playerHand.hand,
          name: playerHand.name,
          handInfo: playerHand.handInfo,
          kickers: playerHand.kickers,
          pairs: playerHand.pairs ? playerHand.pairs : [],
        });
        console.log('playerHands', this.playerHands);
      }
    });
    this.winningHand = this.gameLog.winAnalyzer(
      this.playerHands
    ).winners[0].handInfo;
    this.winningPlayer = this.gameLog.winAnalyzer(this.playerHands).winners;

    this.lastBet = this.pot;
    this.lastWinningHand = this.winningHand;
    this.lastWinningPlayer = [];
    this.winningPlayer.forEach((player: any, index: number) => {
      this.lastWinningPlayer.push(player.playerName);
      this.lastPot = this.pot;
    });
  }

  setUsedHand(player: any) {
    player.actGames[this.id].possibleCards = [];
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
  }
}
