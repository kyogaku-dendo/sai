import { useEffect, useState } from "react";

/** 太客ランキングの 1 人。同じ金額は同じ順位。name の黒塗りした文字は ■ */
export type TipRankEntry = { rank: number; name: string; tipYen: number };

const HATO_URL = import.meta.env.VITE_HATO_URL || "http://127.0.0.1:8787";
const STORAGE_KEY = "sai:tipRanking";
// スタッフが「出す」を押してから数秒で出れば十分
const POLL_INTERVAL_MS = 10_000;

const readCached = (): TipRankEntry[] => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? (JSON.parse(cached) as TipRankEntry[]) : [];
  } catch {
    return [];
  }
};

/**
 * 太客ランキング（hato の GET /tip-names）。スタッフが確かめて出すと決めた名前だけが、チップの多い順に届く。
 * hato が止まっても、最後に読めたランキングを出し続ける
 */
export const useTipRanking = () => {
  const [ranking, setRanking] = useState<TipRankEntry[]>(readCached);

  useEffect(() => {
    const sync = async () => {
      try {
        const response = await fetch(`${HATO_URL}/tip-names`);
        if (!response.ok) throw new Error(`hato returned ${response.status}`);
        const data = (await response.json()) as { ranking: TipRankEntry[] };
        setRanking(data.ranking);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.ranking));
        } catch {
          // 保存できなくても表示は続ける
        }
      } catch (error) {
        console.error(error);
      }
    };
    sync();

    const intervalId = setInterval(sync, POLL_INTERVAL_MS);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return ranking;
};
