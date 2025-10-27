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

export const useSocket = () => {
  // 待ち時間
  // TODO
  const waitingTime = 50;

  // 現在呼び出し中の番号
  // TODO
  const currentCallings = [...Array(30)].map(() =>
    Math.floor(Math.random() * 1000).toString()
  );

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

  return { currentCallings, waitingTime, futokyakus };
};
