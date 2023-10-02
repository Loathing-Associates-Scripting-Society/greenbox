import trophies from "../data/trophies";

export const enum TrophyStatus {
  NONE = 0,
  HAVE = 1,
}

export function loadTrophies(lastKnownSize = 0) {
  const size = JSON.stringify(trophies).length;

  if (size === lastKnownSize) return null;

  return {
    data: trophies as unknown as typeof trophies,
    size: size,
  };
}

export type RawTrophy = [id: number, status: TrophyStatus];

export const compressTrophies = (trophies: RawTrophy[]) =>
  trophies
    .sort((a, b) => a[0] - b[0])
    .reduce(
      (r, trophy) => `${r}${"0".repeat(trophy[0] - r.length - 1)}${trophy[1]}`,
      "",
    )
    .replace(/0+$/, "");

export const expandTrophies = (s = ""): RawTrophy[] =>
  s.split("").map((c, i) => [i + 1, Number(c)]);
