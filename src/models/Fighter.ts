export class Fighter {
  public scores = 200;

  public fights = 0;
  public wins = 0;
  public looses = 0;

  constructor(public id: number, public name: string) {}

  public fight(enemy: Fighter): { winner: Fighter; looser: Fighter } {
    const rand = Math.floor(Math.random() * 2);

    if (rand === 0) {
      this.scores += 10;
      enemy.scores -= 10;

      return {
        winner: this,
        looser: enemy,
      };
    } else {
      this.scores -= 10;
      enemy.scores += 10;

      return {
        winner: enemy,
        looser: this,
      };
    }
  }
}
