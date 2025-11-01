import { useEffect, useState } from "react";

export const useImi = () => {
  const [imiResults, setImiResults] = useState<any[]>([]);

  useEffect(() => {
    const syncImi = async () => {
      const response = await fetch("https://imi.lapla.workers.dev/api/results");
      const data = await response.json();
      const filteredData = data.filter(
        (result: any) => ![6, 10].includes(result.id)
      );
      setImiResults(filteredData);
    };
    syncImi();

    // 60秒おきに同期
    const intervalId = setInterval(syncImi, 1000 * 60);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { imiResults };
};
