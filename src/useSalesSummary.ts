import { useEffect, useState } from "react";

// 会場 PC で動く hato（https://github.com/kyogaku-dendo/hato）の売上集計
export type SalesSummary = {
  salesYen: number;
  borderYen: number | null;
  paymentsCount: number;
  byMethod: { cash: number; cashless: number };
  items: { name: string; variationName: string | null; quantity: number }[];
  lastSyncedAt: string | null;
};

const HATO_URL = import.meta.env.VITE_HATO_URL || "http://127.0.0.1:8787";
const STORAGE_KEY = "sai:salesSummary";
const POLL_INTERVAL_MS = 5000;

const readCached = (): SalesSummary | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? (JSON.parse(cached) as SalesSummary) : null;
  } catch {
    return null;
  }
};

/**
 * 売上集計を数秒おきに読む。回線断や hato の再起動の間も、最後に読めた値を出し続ける。
 * 画面を再読み込みしても消えないよう、最後の値は localStorage にも残す。
 */
export const useSalesSummary = () => {
  const [summary, setSummary] = useState<SalesSummary | null>(readCached);

  useEffect(() => {
    const sync = async () => {
      try {
        const response = await fetch(`${HATO_URL}/summary`);
        if (!response.ok) throw new Error(`hato returned ${response.status}`);
        const data = (await response.json()) as SalesSummary;
        setSummary(data);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

  return summary;
};
