import { describe, test, expect } from "@jest/globals";
// @ts-ignore
import profileUrl from "../utils/valorant/profileUrl";

describe("Utils unit test", () => {
  test("Convert AMIG R0adx#HK11 riot id to tracker.gg url", () => {
    expect(profileUrl("AMIG R0adx#HK11")).toBe(
      "https://tracker.gg/valorant/profile/riot/AMIG%20R0adx%23HK11"
    );
  });
});
