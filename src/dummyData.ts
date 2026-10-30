import type { SalesSummary } from "./useSalesSummary";
import type { TipRankEntry } from "./useTipRanking";

/** dummy モード（yarn dev:local）では hato に繋がず、下のダミーデータを流す */
export const USE_DUMMY = import.meta.env.MODE === "dummy";

const jstDate = (now: Date) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);

// 売上が古い扱いにならないように、同期した時刻は読むたびに今にする
export const dummySalesSummary = (): SalesSummary => {
  const now = new Date();
  const items = [
    { name: "肉巻きおにぎり", variationName: null, quantity: 500 },
    { name: "同人誌", variationName: null, quantity: 75 },
    { name: "ドリンク", variationName: "コーラ", quantity: 65 },
  ];
  return {
    salesYen: 180000,
    borderYen: 150000,
    paymentsCount: 240,
    byMethod: { cash: 100000, cashless: 80000 },
    items,
    today: { date: jstDate(now), salesYen: 180000, paymentsCount: 240, items },
    lastSyncedAt: now.toISOString(),
  };
};

export const DUMMY_TIP_RANKING: TipRankEntry[] = [
  { rank: 1, name: "ちゅるり", tipYen: 10000 },
  { rank: 2, name: "slimalized", tipYen: 5000 },
  { rank: 3, name: "ゆーとぴああああああああ", tipYen: 3000 },
  { rank: 4, name: "lapla", tipYen: 3000 },
  { rank: 5, name: "いなにわうどん", tipYen: 3000 },
];
