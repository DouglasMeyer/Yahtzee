const sum = (a, b) => a + b;

class Yahtzee {
  static categoryScoring = {
    Ones: (rolls) => rolls.filter((roll) => roll === 1).reduce(sum, 0),
    Twos: (rolls) => rolls.filter((roll) => roll === 2).reduce(sum, 0),
    Threes: (rolls) => rolls.filter((roll) => roll === 3).reduce(sum, 0),
    Fours: (rolls) => rolls.filter((roll) => roll === 4).reduce(sum, 0),
    Fives: (rolls) => rolls.filter((roll) => roll === 5).reduce(sum, 0),
    Sixes: (rolls) => rolls.filter((roll) => roll === 6).reduce(sum, 0),
    "Three of a Kind": (rolls) => {
      return rolls
        .slice(0, -2)
        .some((el, index) => rolls.filter((e) => e === el).length >= 3)
        ? rolls.reduce(sum, 0)
        : 0;
    },
    "Four of a Kind": (rolls) => {
      return rolls
        .slice(0, -3)
        .some((el, index) => rolls.filter((e) => e === el).length >= 4)
        ? rolls.reduce(sum, 0)
        : 0;
    },
    "Full House": (rolls) => {
      const uniqueRolls = rolls.filter((e, i, a) => a.indexOf(e) === i).length;
      if (uniqueRolls !== 2) return 0;
      const matchedRolls = rolls.filter((roll) => roll === rolls[0]).length;
      if (matchedRolls === 2 || matchedRolls === 3) return 25;
      return 0;
    },
    "Small Straight": (rolls) => {
      const sortedRolls = [...rolls].sort();
      const roleDeltas = sortedRolls.reduce((acc, now, index) => [
        ...(Array.isArray(acc) ? acc : []),
        now - sortedRolls[index - 1],
      ]);
      const oneDeltaCount = roleDeltas.filter((delta) => delta === 1).length;
      return oneDeltaCount >= 3 ? 30 : 0;
    },
    "Large Straight": (rolls) => {
      const sortedRolls = [...rolls].sort();
      const roleDeltas = sortedRolls.reduce((acc, now, index) => [
        ...(Array.isArray(acc) ? acc : []),
        now - sortedRolls[index - 1],
      ]);
      const oneDeltaCount = roleDeltas.filter((delta) => delta === 1).length;
      return oneDeltaCount === 4 ? 40 : 0;
    },
    Chance: (rolls) => rolls.reduce(sum, 0),
    Yahtzee: (rolls) => {
      const uniqueRolls = rolls.filter((e, i, a) => a.indexOf(e) === i);
      return uniqueRolls.length === 1 && uniqueRolls[0] !== null ? 50 : 0;
    },
  };

  assignments = {
    Ones: null,
    Twos: null,
    Threes: null,
    Fours: null,
    Fives: null,
    Sixes: null,
    "Three of a Kind": null,
    "Four of a Kind": null,
    "Full House": null,
    "Small Straight": null,
    "Large Straight": null,
    Chance: null,
    Yahtzee: null,
  };
  dice = [null, null, null, null, null];
  remainingRolls = 3;

  roll(...indexes) {
    if (this.remainingRolls === 0) return;

    for (const index of indexes) {
      this.dice[index] = Math.floor(Math.random() * 6) + 1;
    }
    this.remainingRolls--;
  }

  assign(category) {
    if (this.assignments[category] || this.dice[0] === null) return;

    this.assignments[category] = this.dice;
    this.dice = new Array(5).fill(null);
    this.remainingRolls = 3;
    delete this._score;
    delete this._upperBonus;
    delete this._additionalYahtzees;
    delete this._gameOver;
  }

  get gameOver() {
    if (this._gameOver !== undefined) return this._gameOver;
    this._gameOver = Object.values(this.assignments).every(
      (dice) => dice !== null
    );
    return this._gameOver;
  }

  get upperBonus() {
    if (this._upperBonus !== undefined) return this._upperBonus;
    this.score;
    return this._upperBonus;
  }

  get additionalYahtzees() {
    if (this._additionalYahtzees !== undefined) return this._additionalYahtzees;
    this.score;
    return this._additionalYahtzees;
  }

  get score() {
    if (this._score !== undefined) return this._score;

    let upper = 0;
    let lower = 0;
    this._additionalYahtzees = 0;
    const isAYahtzee = Yahtzee.categoryScoring["Yahtzee"];
    const hasYahtzee =
      this.assignments["Yahtzee"] &&
      isAYahtzee(this.assignments["Yahtzee"]) !== 0;

    Object.entries(this.assignments).forEach(([category, dice], index) => {
      if (!dice) return;
      if (hasYahtzee && category !== "Yahtzee" && isAYahtzee(dice))
        this._additionalYahtzees++;
      const score = Yahtzee.categoryScoring[category](dice);
      if (index < 6) upper += score;
      else lower += score;
    });
    this._upperBonus = upper >= 63;

    this._score =
      upper +
      (this._upperBonus ? 35 : 0) +
      lower +
      this._additionalYahtzees * 100;
    return this._score;
  }
}
export default Yahtzee;
