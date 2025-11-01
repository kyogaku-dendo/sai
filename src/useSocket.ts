import { useEffect, useMemo, useState } from "react";

export type FutokyakuDetail = {
  name: string;
  tipAmount: number;
  createdAt: string;
  expiresAt: string;
};

interface CallOrdersMessage {
  type: "CALL_ORDERS";
  payload: { tags: string[] };
}

interface CompletePaymentMessage {
  type: "COMPLETE_PAYMENT";
  payload: { tag: string };
}

interface RequestCallingOrdersMessage {
  type: "REQUEST_CALLING_ORDERS";
}

interface RequestWaitingTimeMessage {
  type: "REQUEST_WAITING_TIME";
}

interface WaitingTimeMessage {
  type: "WAITING_TIME";
  payload: { waitingTime: number };
}

interface RequestFutokyakusMessage {
  type: "REQUEST_FUTOKYAKUS";
}

interface FutokyakusMessage {
  type: "FUTOKYAKUS";
  payload: { futokyakus: FutokyakuDetail[] };
}

interface FutokyakuUpdatedMessage {
  type: "FUTOKYAKU_UPDATED";
}

type PostMessageEvent =
  | CallOrdersMessage
  | CompletePaymentMessage
  | RequestCallingOrdersMessage
  | RequestWaitingTimeMessage
  | WaitingTimeMessage
  | RequestFutokyakusMessage
  | FutokyakusMessage
  | FutokyakuUpdatedMessage;

/*const mockOriginalFutokyakus = [
  {
    name: "Slimalized777",
    tipAmount: 10000,
    createdAt: "2025-01-01 12:00:00",
    expiresAt: "2025-01-01 10:00:00",
  },
  {
    name: "Slimalized999",
    tipAmount: 15000,
    createdAt: "2025-01-01 15:00:00",
    expiresAt: "2025-01-01 10:00:00",
  },
  {
    name: "Slimalized222",
    tipAmount: 500,
    createdAt: "2025-01-01 10:00:00",
    expiresAt: "2025-01-01 10:00:00",
  },
];*/

export const useSocket = () => {
  // 待ち時間
  const [waitingTime, setWaitingTime] = useState<string>("--");

  // 現在呼び出し中の番号
  const [currentCallings, setCurrentCallings] = useState<string[]>([]);

  // 損益分岐点
  const [sonekiGoal, setSonekiGoal] = useState<number | null>(null);
  const [sonekiCurrent, setSonekiCurrent] = useState<number | null>(null);

  // 太客データ
  const [originalFutokyakus, setOriginalFutokyakus] = useState<
    FutokyakuDetail[]
  >([]);

  // 太客データ（チップ額の多い順．チップ額が同額の場合は，登録日時が新しい順）
  const futokyakus = useMemo(() => {
    // 空のエントリーを除外
    const sorted = originalFutokyakus
      .filter((f) => f.name !== "" && f.tipAmount > 0)
      .sort((a, b) =>
        b.tipAmount === a.tipAmount
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : b.tipAmount - a.tipAmount
      );

    // 順位付け（同額は同順位）
    let lastTip: number | null = null;
    let lastRank = 0;
    const result = sorted.map((f, i) => {
      if (f.tipAmount !== lastTip) {
        // 新しい金額が出たら順位を更新
        lastRank = i + 1;
        lastTip = f.tipAmount;
      }
      return { no: lastRank, name: f.name };
    });

    return result;
  }, [originalFutokyakus]);

  useEffect(() => {
    const channel = new BroadcastChannel("yagi-sai-sync");

    const handleMessage = (event: MessageEvent<PostMessageEvent>) => {
      if (!event.data || !event.data.type) {
        return;
      }

      if (event.data.type === "CALL_ORDERS") {
        // 注文が提供可能
        const { tags } = event.data.payload;
        console.log("CALL_ORDERS:", tags);
        setCurrentCallings((prev) => {
          const newTags = tags.filter((tag) => !prev.includes(tag));
          return [...prev, ...newTags];
        });
      } else if (event.data.type === "COMPLETE_PAYMENT") {
        // 精算完了
        const tag = event.data.payload.tag;
        console.log("COMPLETE_PAYMENT:", tag);
        setCurrentCallings((prev) => prev.filter((t) => t !== tag));
        channel.postMessage({
          type: "REQUEST_FUTOKYAKUS",
        });
      } else if (event.data.type === "WAITING_TIME") {
        // 待ち時間の応答
        const { waitingTime: time } = event.data.payload;
        console.log("WAITING_TIME:", time);
        setWaitingTime(time.toString());
      } else if (event.data.type === "FUTOKYAKUS") {
        // 太客一覧の応答
        const { futokyakus: futokyakuList } = event.data.payload;
        console.log("FUTOKYAKUS:", futokyakuList);
        setOriginalFutokyakus(futokyakuList);
      } else if (event.data.type === "FUTOKYAKU_UPDATED") {
        channel.postMessage({
          type: "REQUEST_FUTOKYAKUS",
        });
      }
    };

    channel.addEventListener("message", handleMessage);

    const syncWithPOS = () => {
      channel.postMessage({
        type: "REQUEST_CALLING_ORDERS",
      });
      channel.postMessage({
        type: "REQUEST_WAITING_TIME",
      });
      channel.postMessage({
        type: "REQUEST_FUTOKYAKUS",
      });
    };
    syncWithPOS();

    // 10秒おきに同期
    const intervalId = setInterval(syncWithPOS, 10000);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const syncSoneki = async () => {
      try {
        const response = await fetch(
          "https://sora.workers.yukari.uk/api/v0/earning"
        );
        const data = await response.json();
        setSonekiGoal(data.border);
        setSonekiCurrent(data.current);
      } catch (error) {
        setSonekiGoal(null);
        setSonekiCurrent(null);
        console.error(error);
      }
    };
    syncSoneki();

    // 10秒おきに同期
    const intervalId = setInterval(syncSoneki, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    currentCallings,
    waitingTime,
    sonekiGoal,
    sonekiCurrent,
    futokyakus,
  };
};
