import Yahtzee from "./yahtzee";

afterEach(() => {
  jest.spyOn(global.Math, "random").mockRestore();
});

const fixRolls = (...rolls) => {
  rolls.reduce(
    (ret, roll) => ret.mockReturnValueOnce(((roll - 1) * 1) / 6),
    jest.spyOn(global.Math, "random")
  );
};

test("can score Ones", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 1, 1, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Ones");
  expect(yahtzee.score).toBe(5);
});
test("can score Twos", () => {
  const yahtzee = new Yahtzee();
  fixRolls(2, 2, 2, 2, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Twos");
  expect(yahtzee.score).toBe(10);
});
test("can score Threes", () => {
  const yahtzee = new Yahtzee();
  fixRolls(3, 3, 3, 3, 3);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Threes");
  expect(yahtzee.score).toBe(15);
});
test("can score Fours", () => {
  const yahtzee = new Yahtzee();
  fixRolls(4, 4, 4, 4, 4);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Fours");
  expect(yahtzee.score).toBe(20);
});
test("can score Fives", () => {
  const yahtzee = new Yahtzee();
  fixRolls(5, 5, 5, 5, 5);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Fives");
  expect(yahtzee.score).toBe(25);
});
test("can score Sixes", () => {
  const yahtzee = new Yahtzee();
  fixRolls(6, 6, 6, 6, 6);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Sixes");
  expect(yahtzee.score).toBe(30);
});
test("can score Three of a Kind", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 1, 1, 2, 3);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Three of a Kind");
  expect(yahtzee.score).toBe(1 + 1 + 1 + 2 + 3);
});
test("can score Four of a Kind", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 1, 1, 1, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Four of a Kind");
  expect(yahtzee.score).toBe(1 + 1 + 1 + 1 + 2);
});
test("can score Full House", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 1, 1, 2, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Full House");
  expect(yahtzee.score).toBe(25);
});
test("can score Small Straight", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 2, 3, 4, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Small Straight");
  expect(yahtzee.score).toBe(30);
});
test("can score Large Straight", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 2, 3, 4, 5);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Large Straight");
  expect(yahtzee.score).toBe(40);
});
test("can score Yahtzee", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 1, 1, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Yahtzee");
  expect(yahtzee.score).toBe(50);
});
test("can score Chance", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 1, 2, 4, 5);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Chance");
  expect(yahtzee.score).toBe(1 + 1 + 2 + 4 + 5);
});

test("can score Upper bonus", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 1, 1, 2, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Ones");
  fixRolls(2, 2, 2, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Twos");
  fixRolls(3, 3, 3, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Threes");
  fixRolls(4, 4, 4, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Fours");
  fixRolls(5, 5, 5, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Fives");
  expect(yahtzee.upperBonus).toBe(0);
  fixRolls(6, 6, 6, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Sixes");
  expect(yahtzee.upperBonus).toBe(35);
  expect(yahtzee.score).toBe(3 + 6 + 9 + 12 + 15 + 18 + 35);
});

test("can score Yahtzee bonuses", () => {
  const yahtzee = new Yahtzee();
  fixRolls(1, 1, 1, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Yahtzee");
  expect(yahtzee.additionalYahtzees).toBe(0);
  expect(yahtzee.score).toBe(50);
  fixRolls(1, 1, 1, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Twos");
  expect(yahtzee.additionalYahtzees).toBe(1);
  expect(yahtzee.score).toBe(50 + 100);
  fixRolls(1, 1, 1, 1, 1);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Threes");
  expect(yahtzee.additionalYahtzees).toBe(2);
  expect(yahtzee.score).toBe(50 + 100 + 100);
});

test("can not score", () => {
  const yahtzee = new Yahtzee();
  fixRolls(2, 2, 2, 2, 3);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Ones");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 1, 1, 3);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Twos");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 1, 1, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Threes");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 1, 1, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Fours");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 1, 1, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Fives");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 1, 1, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Sixes");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 2, 2, 3);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Three of a Kind");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 1, 2, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Four of a Kind");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 2, 2, 3);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Full House");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 1, 1, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Small Straight");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 1, 1, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Large Straight");
  expect(yahtzee.score).toBe(0);

  fixRolls(1, 1, 1, 1, 2);
  yahtzee.roll(0, 1, 2, 3, 4);
  yahtzee.assign("Yahtzee");
  expect(yahtzee.score).toBe(0);
});

test("Don't say Yahtzee can be scored with nulls", () => {
  const score = Yahtzee.categoryScoring["Yahtzee"]([null, null, null, null]);
  expect(score).toBe(0);
});
