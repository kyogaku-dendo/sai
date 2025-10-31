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
    font-family: "Montserrat";
    src: url("/sai/Montserrat-VariableFont_wght.ttf") format("truetype");
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
  top: calc(var(--width) / 1920 * 25);
  left: calc(var(--width) / 1920 * 50);
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
  top: calc(var(--width) / 1920 * 44);
  left: calc(var(--width) / 1920 * 200);
`;

const FutokyakuName = styled.div<{ no: number }>`
  width: calc(var(--width) / 1920 * 480);
  line-height: calc(var(--width) / 1920 * 114);
  font-size: ${({ no }) => `calc(var(--width) / 1920 * ${70 - no * 10})`};
  font-weight: 200;
`;

const App = () => {
  const screenRef = useRef<HTMLDivElement>(null);

  const { currentCallings, waitingTime, futokyakus } = useSocket();
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

  return (
    <>
      <Global styles={globalStyle} />
      <div ref={screenRef}>
        <Wrapper id="screen">
          <video src="/sai/movie.mp4" autoPlay muted loop />
          <Right currentCallings={currentCallings} />
          <Waiting>
            <WaitingMinutes>{waitingTime}</WaitingMinutes>
          </Waiting>
          <Futokyaku>
            <FutokyakuList>
              {/* 一定以上の文字数であれば Marquee */}
              {futokyakus.slice(0, 3).map((c, i) => (
                <FutokyakuName no={i} key={c}>
                  {getStrWidth(c) > 7 ? <Marquee speed={100}>{c}</Marquee> : c}
                </FutokyakuName>
              ))}
            </FutokyakuList>
          </Futokyaku>
          <Footer futokyakus={futokyakus} />
        </Wrapper>
      </div>
      <button onClick={displayFullScreen}>フルスクリーン</button>
    </>
  );
};

export default App;
