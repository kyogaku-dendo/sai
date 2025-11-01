import { useRef } from "react";
import Marquee from "react-fast-marquee";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";

import Footer from "./Footer";
import Right from "./Right";

import futokyakuAsset from "../assets/futokyaku.png";
import waitingAsset from "../assets/waiting.png";
import { useScreenshot } from "../useScreenshot";
import { useSocket } from "../useSocket";

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

const Waiting = styled.div`
  width: calc(var(--width) / 1920 * 854);
  height: calc(var(--width) / 1920 * 455);
  background: url(${waitingAsset});
  background-size: 100% 100%;
  position: absolute;
  bottom: calc(var(--width) / 1920 * 108);
  left: 0;
  z-index: 100;
`;

const WaitingMinutes = styled.div`
  width: calc(var(--width) / 1920 * 400);
  line-height: 1;
  color: #fff;
  text-align: center;
  text-shadow: 0 calc(var(--width) / 1920 * 10) calc(var(--width) / 1920 * 10)
    rgba(0, 0, 0, 0.1);
  font-size: calc(var(--width) / 1920 * 270);
  font-weight: 700;
  font-family: "Gotham";
  position: absolute;
  top: calc(var(--width) / 1920 * 45);
  left: calc(var(--width) / 1920 * 50);
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
  left: calc(var(--width) / 1920 * 540);
`;

const Yen = styled.span`
  font-size: calc(var(--width) / 1920 * 30);
  margin-left: calc(var(--width) / 1920 * 5);
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

const FutokyakuItem = styled.div<{ no: number }>`
  line-height: calc(var(--width) / 1920 * 114);
  font-size: ${({ no }) => `calc(var(--width) / 1920 * ${70 - no * 10})`};
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

const App = () => {
  const screenRef = useRef<HTMLDivElement>(null);

  const {
    currentCallings,
    waitingTime,
    sonekiGoal,
    sonekiCurrent,
    futokyakus,
  } = useSocket();
  useScreenshot();

  const displayFullScreen = () => {
    screenRef.current?.requestFullscreen();
  };

  const getStrWidth = (str: string) => {
    // 英語または半角スペースであれば 0.5em，それ以外は 1em として換算
    return str.split("").reduce((acc, char) => {
      return acc + (/^[A-Za-z ]$/.test(char) ? 0.5 : 1);
    }, 0);
  };

  const currentTime = new Date().toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Global styles={globalStyle} />
      <div ref={screenRef}>
        <Wrapper id="screen">
          <video src="/sai/movie.mp4" autoPlay muted loop />
          <Right currentCallings={currentCallings} />
          <Waiting>
            <WaitingMinutes>{waitingTime}</WaitingMinutes>
            <Soneki>
              {sonekiGoal ?? "?????"}
              <Yen>円</Yen>
              <br />
              {sonekiCurrent ?? "?????"}
              <Yen>円</Yen>
            </Soneki>
          </Waiting>
          <Futokyaku>
            <FutokyakuList>
              {/* 一定以上の文字数であれば Marquee */}
              {futokyakus.slice(0, 3).map((f) => (
                <FutokyakuItem no={f.no} key={f.no + " " + f.name}>
                  <FutokyakuNo>{f.no}.</FutokyakuNo>
                  <FutokyakuName>
                    {getStrWidth(f.name) > 7 ? (
                      <Marquee speed={100}>{f.name}　</Marquee>
                    ) : (
                      f.name
                    )}
                  </FutokyakuName>
                </FutokyakuItem>
              ))}
            </FutokyakuList>
          </Futokyaku>
          <CurrentTime>{currentTime}</CurrentTime>
          <Footer futokyakus={futokyakus} />
        </Wrapper>
      </div>
      <button onClick={displayFullScreen}>フルスクリーン</button>
    </>
  );
};

export default App;
