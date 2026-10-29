import { useEffect, useState } from "react";

type ImiResult = {
  id: number;
  title: string;
  meaningful: number;
  meaningless: number;
};

export const useImi = () => {
  const [imiResults, setImiResults] = useState<ImiResult[]>([]);

  useEffect(() => {
    const syncImi = async () => {
      const response = await fetch("https://imi.lapla.workers.dev/api/results");
      const data = (await response.json()) as ImiResult[];
      const filteredData = data.filter(
        (result) => ![6, 10].includes(result.id)
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
