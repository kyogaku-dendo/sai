import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";

import Footer from "./Footer";
import Right from "./Right";

import waitingAsset from "../assets/waiting.png";
import { useScreenshot } from "../useScreenshot";
import { type SalesSummary, useSalesSummary } from "../useSalesSummary";

const globalStyle = css`
  @font-face {
    font-family: "ShinGo";
    font-weight: 700;
    src: url("/sai/AP-OTF-ShinGoPr6N-Bold.otf") format("opentype");
  }
  @font-face {
    font-family: "ShinGo";
    font-weight: 500;
    src: url("/sai/AP-OTF-ShinGoPr6N-Medium.otf") format("opentype");
  }
  @font-face {
    font-family: "ShinGo";
    font-weight: 200;
    src: url("/sai/AP-OTF-ShinGoPr6N-Light.otf") format("opentype");
  }
  @font-face {
    font-family: "Gotham";
    src: url("/sai/Gotham-Medium.otf") format("opentype");
  }

  :root {
    --width: ${screen.width}px;
    --height: ${screen.height}px;
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

// 去年の画像は左半分に「分待ち」が入っているので、右半分（損益分岐点・現在の売上）だけを見せる
const SONEKI_CROP_LEFT = 470;

const SonekiPanel = styled.div`
  width: calc(var(--width) / 1920 * ${854 - SONEKI_CROP_LEFT});
  height: calc(var(--width) / 1920 * 455);
  background: url(${waitingAsset});
  background-size: calc(var(--width) / 1920 * 854) 100%;
  background-position: right top;
  position: absolute;
  bottom: calc(var(--width) / 1920 * 108);
  left: 0;
  z-index: 100;
`;

const Soneki = styled.div`
  width: calc(var(--width) / 1920 * 300);
  line-height: 2.4;
  color: #000;
  font-family: Gotham;
  font-size: calc(var(--width) / 1920 * 70);
  font-weight: 600;
  position: absolute;
  top: calc(var(--width) / 1920 * 105);
  left: calc(var(--width) / 1920 * ${540 - SONEKI_CROP_LEFT});
`;

const Yen = styled.span`
  font-size: calc(var(--width) / 1920 * 30);
  margin-left: calc(var(--width) / 1920 * 5);
`;

const CurrentTime = styled.div`
  line-height: 1;
  color: #fff;
  text-shadow: 0 calc(var(--width) / 1920 * 10) calc(var(--width) / 1920 * 20)
    rgba(0, 0, 0, 0.5);
  font-family: Gotham;
  font-size: calc(var(--width) / 1920 * 40);
  position: absolute;
  top: calc(var(--width) / 1920 * 380);
  left: calc(var(--width) / 1920 * 40);
`;

const StaleNote = styled.div`
  margin-top: calc(var(--width) / 1920 * 12);
  font-size: calc(var(--width) / 1920 * 26);
  font-family: "ShinGo";
`;

// hato の同期は 2 秒おきなので、これより古ければ会場の回線か Square への接続が切れている
const STALE_AFTER_MS = 60 * 1000;

const formatYen = (yen: number | null | undefined) =>
  yen === null || yen === undefined ? "?????" : yen.toLocaleString("ja-JP");

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

  const summary: SalesSummary | null = useSalesSummary();
  useScreenshot();

  const displayFullScreen = () => {
    screenRef.current?.requestFullscreen();
  };

  return (
    <>
      <Global styles={globalStyle} />
      <div ref={screenRef}>
        <Wrapper id="screen">
          <video src="/sai/movie.mp4" autoPlay muted loop />
          <Right />
          <SonekiPanel>
            <Soneki>
              {formatYen(summary?.borderYen)}
              <Yen>円</Yen>
              <br />
              {formatYen(summary?.salesYen)}
              <Yen>円</Yen>
            </Soneki>
          </SonekiPanel>
          <Clock lastSyncedAt={summary?.lastSyncedAt ?? null} />
          <Footer summary={summary} />
        </Wrapper>
      </div>
      <button onClick={displayFullScreen}>フルスクリーン</button>
    </>
  );
};

export default App;
