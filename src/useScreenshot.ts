import html2canvas from "html2canvas";
import { useEffect, useRef } from "react";

export const useScreenshot = () => {
  const intervalId = useRef<number | null>(null);

  const shareScreenshot = async () => {
    if (
      !import.meta.env.VITE_RENBAI_BACKEND_URL ||
      !import.meta.env.VITE_RENBAI_BACKEND_TOKEN
    ) {
      return;
    }

    try {
      const screen = document.getElementById("screen");
      if (!screen) {
        return;
      }

      // スクリーンショットを撮影
      const canvas = await html2canvas(screen, { logging: false });
      const contentType = "image/png";
      const imageBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, contentType);
      });
      if (!imageBlob) {
        return;
      }

      // API に送信
      const apiEndpoint = new URL(
        "/screenshot",
        import.meta.env.VITE_RENBAI_BACKEND_URL
      );
      const formData = new FormData();
      formData.append("file", imageBlob as Blob, "screenshot.png");

      await fetch(apiEndpoint, {
        method: "POST",
        headers: { Authorization: import.meta.env.VITE_RENBAI_BACKEND_TOKEN },
        body: formData,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    const INTERVAL_SECONDS = 60;
    intervalId.current = setInterval(shareScreenshot, INTERVAL_SECONDS * 1000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);
};
