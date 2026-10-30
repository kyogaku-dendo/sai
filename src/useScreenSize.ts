import { useEffect, useState } from "react";

// ウィンドウの表示領域の大きさに合わせる
const measure = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const useScreenSize = () => {
  const [size, setSize] = useState(measure);

  useEffect(() => {
    const update = () => setSize(measure());
    // ウィンドウのリサイズやフルスクリーンの出入りで測り直す
    window.addEventListener("resize", update);
    document.addEventListener("fullscreenchange", update);
    return () => {
      window.removeEventListener("resize", update);
      document.removeEventListener("fullscreenchange", update);
    };
  }, []);

  return size;
};
