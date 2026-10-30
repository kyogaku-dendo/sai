import { type CSSProperties, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";

import Footer from "./Footer";
import FutokyakuTop from "./FutokyakuTop";
import Right from "./Right";
import SonekiPanel from "./SonekiPanel";

import { useScreenshot } from "../useScreenshot";
import { useScreenSize } from "../useScreenSize";
import { type SalesSummary, useSalesSummary } from "../useSalesSummary";
import { useTipRanking } from "../useTipRanking";

const globalStyle = css`
  @font-face {
    font-family: "ShinGo";
    font-weight: 700;
    src: url("/sai/AP-OTF-ShinGoPr6N-DeBold.otf") format("opentype");
  }
    
  @font-face {
    font-family: "ShinGo";
    font-weight: 500;
    src: url("/sai/AP-OTF-ShinGoPr6N-Medium.otf") format("opentype");
  }
`;

const Wrapper = styled.div`
  width: var(--width);
  height: var(--height);
  font-family: "ShinGo";
  transform-origin: top left;
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
`;

const CurrentTime = styled.div`
  line-height: 1;
  color: #fff;
  text-shadow: 0 calc(var(--width) / 1920 * 10) calc(var(--width) / 1920 * 20)
    rgba(0, 0, 0, 0.5);
  font-size: calc(var(--height) / 100 * 3);
  position: absolute;
  top: calc(var(--height) / 100 * 32.4);
  left: calc(var(--height) / 100 * 3.8);
`;

const StaleNote = styled.div`
  margin-top: calc(var(--width) / 1920 * 12);
  font-size: calc(var(--width) / 1920 * 26);
`;

// hato の同期は 2 秒おきなので、これより古ければ会場の回線か Square への接続が切れている
const STALE_AFTER_MS = 60 * 1000;

const formatCurrentTime = (ms: number) =>
  new Date(ms).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

// 以前は POS からの同期で画面が数秒おきに描き直され、そのついでに時計が進んでいた。
// 同期がなくなったので、時計は自分で進める。売上の古さも毎秒判定し直す
const Clock = ({ lastSyncedAt }: { lastSyncedAt: string | null }) => {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const syncedAtMs = lastSyncedAt ? Date.parse(lastSyncedAt) : null;
  const isStale = syncedAtMs === null || now - syncedAtMs > STALE_AFTER_MS;

  return (
    <CurrentTime>
      {formatCurrentTime(now)}
      {isStale && (
        <StaleNote>
          {syncedAtMs === null
            ? "売上を読み込み中"
            : `売上は ${new Date(syncedAtMs).toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
              })} 時点`}
        </StaleNote>
      )}
    </CurrentTime>
  );
};

const App = () => {
  const screenRef = useRef<HTMLDivElement>(null);
  const { width, height } = useScreenSize();

  const summary: SalesSummary | null = useSalesSummary();
  const ranking = useTipRanking();
  useScreenshot();

  // F キーでフルスクリーンを切り替える
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "f" && e.key !== "F") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        screenRef.current?.requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Global styles={globalStyle} />
      <div ref={screenRef}>
        <Wrapper
          id="screen"
          style={{ "--width": `${width}px`, "--height": `${height}px` } as CSSProperties}
        >
          <video src="/sai/movie.mp4" autoPlay muted loop />
          <Right />
          <SonekiPanel summary={summary} />
          <FutokyakuTop ranking={ranking} />
          <Clock lastSyncedAt={summary?.lastSyncedAt ?? null} />
          <Footer summary={summary} ranking={ranking} />
        </Wrapper>
      </div>
    </>
  );
};

export default App;
