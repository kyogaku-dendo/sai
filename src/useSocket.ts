import { useEffect, useState } from "react";

export const useSocket = () => {
  // 損益分岐点
  const [sonekiGoal, setSonekiGoal] = useState<number | null>(null);
  const [sonekiCurrent, setSonekiCurrent] = useState<number | null>(null);

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
    sonekiGoal,
    sonekiCurrent,
  };
};
