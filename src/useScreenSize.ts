import { useEffect, useState } from "react";

// フルスクリーン中はその表示領域、それ以外はディスプレイの大きさに合わせる
const measure = () =>
  document.fullscreenElement
    ? { width: window.innerWidth, height: window.innerHeight }
    : { width: screen.width, height: screen.height };

export const useScreenSize = () => {
  const [size, setSize] = useState(measure);

  useEffect(() => {
    const update = () => setSize(measure());
    // ウィンドウを別のディスプレイへ移したときや、フルスクリーンの出入りで測り直す
    window.addEventListener("resize", update);
    document.addEventListener("fullscreenchange", update);
    return () => {
      window.removeEventListener("resize", update);
      document.removeEventListener("fullscreenchange", update);
    };
  }, []);

  return size;
};
