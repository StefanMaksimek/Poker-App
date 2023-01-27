export class Game {
  public id: any = 'lksfhjvjf4b534f3dg54b3ds';
  public maxPlayer: number = 9;
  public startingStack: number = 30000;
  public json = this.toJson();

  public players: Array<any> = [];
  public playerInRound: any[] = [];
  public curentPlayer: number = 1;

  public playingStack: any = [];
  public flop: string[] = [];
  public turn: string[] = [];
  public river: string[] = [];

  public blinds: number[] = [50, 100];
  public bet: number = 0;

  constructor() {}
  public toJson() {
    return {
      players: this.players,
      playerInRound: this.playerInRound,
      curentPlayer: this.curentPlayer,

      playingStack: this.playingStack,
      flop: this.flop,
      turn: this.turn,
      river: this.river,

      blinds: this.blinds,
      bet: this.bet,
    };
  }

  loadImages() {
    this.playingStack.forEach((card: any) => {
      let img = new Image();
      img.src = `assets/img/cards/${card}.png`;
    });
  }

  setGameInfoToPlayer() {
    let id = this.id;
    this.players.forEach((player, index) => {
      player.actGames[id] = {
        stack: this.startingStack,
        actHand: ['clubs_1', 'hearts_1'],
      };
      player.actGames[id + 4] = {
        stack: this.startingStack * (index + 1),
        actHand: [],
      };
    });
  }

  startNewRound() {
    this.playerInRound = [];
    this.playerInRound = this.players;
    this.nextPlayer();
  }

  nextPlayer() {
    this.curentPlayer == this.playerInRound.length - 1
      ? (this.curentPlayer = 0)
      : this.curentPlayer++;
  }
}
