export class Fighter {
  public semen = 400;

  constructor(public id: number, public name: string) {}

  public fight(enemy: Fighter): { winner: Fighter; looser: Fighter } {
    const rand = Math.floor(Math.random() * 2);

    if (rand === 0) {
      this.semen += 10;
      enemy.semen -= 10;

      return {
        winner: this,
        looser: enemy,
      };
    } else {
      this.semen -= 10;
      enemy.semen += 10;

      return {
        winner: enemy,
        looser: this,
      };
    }
  }
}
