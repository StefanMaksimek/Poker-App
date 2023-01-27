export class Player {
  public id: any;
  public json = this.toJson();

  public image: any;
  public name: any;
  public amount: any;
  public color: any;

  public actGames: any = [];

  constructor() {}
  public toJson() {
    return {
      id: this.id,
      image: this.image,
      name: this.name,
      amount: this.amount,
      color: this.color,
      actGames: this.actGames,
    };
  }
}
