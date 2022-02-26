const sum = (a, b) => a + b;

class Yahtzee {
  static categoryScoring = {
    Ones: (rolls) => rolls.filter((roll) => roll === 0).reduce(sum, 0),
    Twos: (rolls) => rolls.filter((roll) => roll === 1).reduce(sum, 0),
    Threes: (rolls) => rolls.filter((roll) => roll === 2).reduce(sum, 0),
    Fours: (rolls) => rolls.filter((roll) => roll === 3).reduce(sum, 0),
    Fives: (rolls) => rolls.filter((roll) => roll === 4).reduce(sum, 0),
    Sixes: (rolls) => rolls.filter((roll) => roll === 5).reduce(sum, 0),
    "Three of a Kind": (rolls) => rolls.reduce(sum, 0),
    "Four of a Kind": (rolls) => rolls.reduce(sum, 0),
    "Full House": (rolls) => {
      const uniqueRolls = rolls.filter((e, i, a) => a.indexOf(e) === i);
      if (uniqueRolls !== 2) return 0;
      const matchedRolls = rolls.filter((roll) => roll === rolls[0]).length;
      if (matchedRolls === 2 || matchedRolls === 3) return 25;
      return 0;
    },
    "Small Straight": (rolls) => {
      const sortedRolls = [...rolls].sort();
      const roleDeltas = sortedRolls.reduce((acc, now, index) => [
        ...acc,
        now - sortedRolls[index - 1],
      ]);
      const oneDeltaCount = roleDeltas.filter((delta) => delta === 1).length;
      return oneDeltaCount >= 4 ? 30 : 0;
    },
    "Large Straight": (_rolls) => {
      const sortedRolls = [...rolls].sort();
      const roleDeltas = sortedRolls.reduce((acc, now, index) => [
        ...acc,
        now - sortedRolls[index - 1],
      ]);
      const oneDeltaCount = roleDeltas.filter((delta) => delta === 1).length;
      return oneDeltaCount === 5 ? 40 : 0;
    },
    Yahtzee: (rolls) => {
      const uniqueRolls = rolls.filter((e, i, a) => a.indexOf(e) === i);
      return uniqueRolls.length === 5 ? 50 : 0;
    },
    Chance: (rolls) => rolls.reduce(sum, 0),
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
    Yahtzee: null,
    Chance: null,
  };
  dice = [null, null, null, null, null];
  remainingRolls = 3;
  upperBonus = false;
  additionalYahtzees = 0;

  roll(...indexes) {
    if (this.remainingRolls === 0) return;

    for (const index of indexes || [0, 1, 2, 3, 4]) {
      this.dice[index] = Math.floor(Math.random() * 6);
    }
    this.remainingRolls--;
  }

  assign(category) {
    if (this.assignments[category]) return;

    this.assignments[category] = this.dice;
    this.dice = new Array(5).fill(null);
    this.remainingRolls = 3;
    delete this._score;
  }

  score() {
    if (this._score) return this._score;

    let upper = 0;
    this.upperBonus = false;
    let lower = 0;
    this.additionalYahtzees = 0;
    const isAYahtzee = Yahtzee.categoryScoring["Yahtzee"];
    const hasYahtzee = isAYahtzee(this.assignments["Yahtzee"]) !== 0;

    Object.entries(this.assignments).forEach(([category, dice], index) => {
      if (hasYahtzee && category !== "Yahtzee" && isAYahtzee(dice))
        this.additionalYahtzees++;
      const score = Yahtzee.categoryScoring[category](dice);
      if (index < 6) upper += score;
      else lower += score;
    });
    this.upperBonus = upper >= 63;

    this._score =
      upper +
      (this.upperBonus ? 35 : 0) +
      lower +
      this.additionalYahtzees * 100;
    return this._score;
  }
}
export default Yahtzee;
