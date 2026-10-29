import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";

import Footer from "./Footer";
import Right from "./Right";
import Soneki from "./Soneki";
import TipName from "./TipName";

import futokyakuAsset from "../assets/futokyaku.png";
import { useScreenshot } from "../useScreenshot";
import { type SalesSummary, useSalesSummary } from "../useSalesSummary";
import { useTipRanking } from "../useTipRanking";

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

const Futokyaku = styled.div`
  width: calc(var(--width) / 1920 * 712);
  height: calc(var(--width) / 1920 * 347);
  line-height: 1;
  color: #fff;
  text-shadow: 0 calc(var(--width) / 1920 * 10) calc(var(--width) / 1920 * 20)
    rgba(0, 0, 0, 0.5);
  background: url(${futokyakuAsset});
  background-size: 100% 100%;
  position: absolute;
  top: calc(var(--width) / 1920 * 20);
  left: 0;
`;

const FutokyakuList = styled.div`
  position: absolute;
  top: calc(var(--width) / 1920 * 6);
  left: calc(var(--width) / 1920 * 100);
`;

// 順位が上の人ほど大きく出す
const FutokyakuItem = styled.div<{ rank: number }>`
  line-height: calc(var(--width) / 1920 * 114);
  font-size: ${({ rank }) => `calc(var(--width) / 1920 * ${70 - Math.min(rank, 3) * 10})`};
  display: flex;
  align-items: center;
  gap: calc(var(--width) / 1920 * 10);
`;

const FutokyakuNo = styled.div`
  width: calc(var(--width) / 1920 * 80);
`;

const FutokyakuName = styled.div`
  width: calc(var(--width) / 1920 * 480);
  font-weight: 200;
  white-space: nowrap;
`;

// 英字と半角スペースは 0.5em、それ以外は 1em として幅を見積もる
const nameWidthEm = (name: string) =>
  [...name].reduce((sum, char) => sum + (/^[A-Za-z0-9 ]$/.test(char) ? 0.5 : 1), 0);

// 上位 3 人まで。枠に収まらない長い名前は流す
const FutokyakuTop = ({ ranking }: { ranking: { rank: number; name: string }[] }) => (
  <Futokyaku>
    <FutokyakuList>
      {ranking.slice(0, 3).map((entry) => (
        <FutokyakuItem rank={entry.rank} key={`${entry.rank} ${entry.name}`}>
          <FutokyakuNo>{entry.rank}.</FutokyakuNo>
          <FutokyakuName>
            {nameWidthEm(entry.name) > 7 ? (
              <Marquee speed={100}>
                <TipName name={entry.name} />
                {"\u3000"}
              </Marquee>
            ) : (
              <TipName name={entry.name} />
            )}
          </FutokyakuName>
        </FutokyakuItem>
      ))}
    </FutokyakuList>
  </Futokyaku>
);

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
  const ranking = useTipRanking();
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
          <Soneki
            salesYen={summary?.salesYen ?? null}
            borderYen={summary?.borderYen ?? null}
          />
          <FutokyakuTop ranking={ranking} />
          <Clock lastSyncedAt={summary?.lastSyncedAt ?? null} />
          <Footer summary={summary} ranking={ranking} />
        </Wrapper>
      </div>
      <button onClick={displayFullScreen}>フルスクリーン</button>
    </>
  );
};

export default App;
