import { useEffect, useState } from "react";

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

type PostMessageEvent =
  | CallOrdersMessage
  | CompletePaymentMessage
  | RequestCallingOrdersMessage
  | RequestWaitingTimeMessage
  | WaitingTimeMessage;

export const useSocket = () => {
  // 待ち時間
  const [waitingTime, setWaitingTime] = useState<string>("--");

  // 現在呼び出し中の番号
  const [currentCallings, setCurrentCallings] = useState<string[]>([]);

  // 太客の順序付きリスト
  // TODO
  const futokyakus = [
    "ちゅるり",
    "motorailgun",
    "Ryoga.exe",
    "lapla",
    "いなにわうどん",
    "あすと",
  ];

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
