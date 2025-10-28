import { useEffect, useState } from "react";

export type FutokyakuDetail = {
  name: string;
  tipAmount: number;
  createdAt: string;
};

interface Calling {
  tag: string; // 番号
  createdAt: number; // 作成日時
}

interface CallingHidden {
  tag: string; // 番号
  isCompleted: boolean; // 精算完了の場合，true
  name?: string; // チップ名
  tipsAmount?: number; // チップ金額
  createdAt: number; // 作成日時
}

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

type PostMessageEvent =
  | CallOrdersMessage
  | CompletePaymentMessage
  | RequestCallingOrdersMessage
  | RequestWaitingTimeMessage
  | WaitingTimeMessage
  | RequestFutokyakusMessage
  | FutokyakusMessage;

export const useSocket = () => {
  // 待ち時間
  const [waitingTime, setWaitingTime] = useState<string>("--");

  // 現在呼び出し中の番号
  const [currentCallings, setCurrentCallings] = useState<string[]>([]);

  // 太客の順序付きリスト（チップ額の多い順）
  const [futokyakus, setFutokyakus] = useState<string[]>([]);

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
      } else if (event.data.type === "WAITING_TIME") {
        // 待ち時間の応答
        const { waitingTime: time } = event.data.payload;
        console.log("WAITING_TIME:", time);
        setWaitingTime(time.toString());
      } else if (event.data.type === "FUTOKYAKUS") {
        // 太客一覧の応答
        const { futokyakus: futokyakuList } = event.data.payload;
        console.log("FUTOKYAKUS:", futokyakuList);
        // チップ額の多い順に並び替えて名前のみの配列にする
        const sortedNames = futokyakuList
          .sort((a, b) => b.tipAmount - a.tipAmount)
          .map((f) => f.name);
        setFutokyakus(sortedNames);
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

    // 30秒おきに同期
    const intervalId = setInterval(syncWithPOS, 30000);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
      clearInterval(intervalId);
    };
  }, []);

  return { currentCallings, waitingTime, futokyakus };
};
