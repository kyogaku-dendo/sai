import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";

const width = 1920 * 0.6;
const height = 1080 * 0.6;

const w = (value: number) => `${width * (value / 100)}px`;
const h = (value: number) => `${height * (value / 100)}px`;

const globalStyle = css`
  @font-face {
    font-family: "ShinGo";
    font-weight: 700;
    src: url("/AP-OTF-ShinGoPr6N-Bold.otf") format("opentype");
  }
  @font-face {
    font-family: "ShinGo";
    font-weight: 500;
    src: url("/AP-OTF-ShinGoPr6N-Medium.otf") format("opentype");
  }
`;

const Wrapper = styled.div`
  width: ${w(100)};
  height: ${h(100)};
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

const Content = styled.div`
  width: ${w(90)};
  height: ${h(90)};
  position: absolute;
  bottom: 0;
  right: 0;
`;

const Top = styled.div`
  width: ${w(100)};
  height: ${h(11)};
  line-height: ${h(11)};
  padding: 0 ${w(1)} 0 ${w(2)};
  box-sizing: border-box;
  color: #fff;
  font-size: ${w(3.5)};
  background: hsla(250, 80%, 20%, 0.9);

  position: absolute;
  top: 0;
  left: ${w(0)};
  z-index: 100;
`;

const CallingWrapper = styled.div`
  margin-left: ${w(2)};
  display: inline-flex;
  gap: ${w(0.4)};
`;

const Calling = styled.div`
  line-height: 1;
  padding: ${w(0.5)} ${w(0.5)};
  border-radius: ${w(0.5)};
  background: rgba(0, 0, 0, 0.8);
  display: inline-block;
`;

const Side = styled.div`
  width: ${w(10)};
  height: ${h(100 - 11)};
  line-height: ${w(10)};
  padding-top: ${h(2)};

  color: #fff;
  font-size: ${w(7)};
  font-weight: 700;
  box-sizing: border-box;
  writing-mode: vertical-rl;
  background: hsla(220, 80%, 20%, 0.9);

  position: absolute;
  top: ${h(11)};
  left: ${w(1)};
  z-index: 100;
`;

const SideBorder = styled.div`
  width: ${w(1)};
  height: ${h(100 - 11)};
  background: hsla(180, 80%, 20%, 0.9);
  position: absolute;
  top: ${h(11)};
  left: 0;
  z-index: 100;
`;

const Minutes = styled.span`
  text-combine-upright: all;
`;

const App = () => {
  const [count, setCount] = useState(0);
  const screenRef = useRef<HTMLDivElement>(null);

  const displayFullScreen = () => {
    screenRef.current?.requestFullscreen();
  };

  const customers = [
    "ちゅるり",
    "motorailgun",
    "Ryoga.exe",
    "lapla",
    "Slimalized",
  ];

  return (
    <>
      <Global styles={globalStyle} />
      <div ref={screenRef}>
        <Wrapper>
          <Top>
            呼出中
            <CallingWrapper>
              {[324, 243, 874, 324, 243, 874, 324, 243, 874].map((x) => (
                <Calling key={x}>{x}</Calling>
              ))}
            </CallingWrapper>
          </Top>
          <SideBorder />
          <Side>
            <Minutes>30</Minutes>分待ち
          </Side>
          <Content>太客一覧：{customers.join("，")}</Content>
          <video src="/movie.mp4" autoPlay muted loop />
        </Wrapper>
      </div>
      <button onClick={displayFullScreen}>フルスクリーン</button>
    </>
  );
};

export default App;
