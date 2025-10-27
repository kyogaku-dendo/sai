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

type PostMessageEvent = CallOrdersMessage | CompletePaymentMessage;

export const useSocket = () => {
  // 待ち時間
  // TODO
  const waitingTime = "30";

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
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, []);

  return { currentCallings, waitingTime, futokyakus };
};
