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
  public playerHands: any = [];
  public winningHand: any = [];
  public winningPlayer: any = [];

  public blinds: number[] = [50, 100];
  public bets: string[] = [];
  public lastBet: number = 300;
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
    let possibleCards = [
      this.flop[0],
      this.flop[1],
      this.flop[2],
      this.turn[0],
      this.river[0],
    ];
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
      this.checkWinningHand();
      this.potToWinningPlayer();
      setTimeout(() => {
        this.endOfRound = false;
        this.startNewRound();
      }, 3000);
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

  potToWinningPlayer() {
    let win = this.pot / this.winningPlayer.length;
    this.winningPlayer.forEach((player: any, index: number) => {
      this.players[player.seat].actGames[this.id].stack =
        this.players[player.seat].actGames[this.id].stack + win;
    });
    this.winningHand = [];
    this.winningPlayer = [];
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
      console.log(
        'player.actGames[this.id].possibleCards',
        player.actGames[this.id].possibleCards
      );
      console.log('player.actGames[this.id].possibleCards', player.playerName);

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

        this.playerHands.push({
          playerName: player.name,
          seat: player.actGames[this.id].seat,
          hand: playerHand.hand,
          name: playerHand.name,
          handInfo: playerHand.handInfo,
          kickers: playerHand.kickers,
          pairs: playerHand.pairs ? playerHand.pairs : [],
        });
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
    console.log('winningPlayer', this.winningPlayer);
  }

  setUsedHand(player: any) {
    console.log(player);
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
