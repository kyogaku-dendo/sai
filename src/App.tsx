import { useRef } from "react";
import Marquee from "react-fast-marquee";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";

import currentFutokyakuAsset from "./assets/current-futokyaku.svg";
import footerAsset from "./assets/footer.png";
import futokyakuAsset from "./assets/futokyaku.png";
import migiAsset from "./assets/migi.png";
import { useSocket } from "./useSocket";
import waitingAsset from "./assets/waiting.png";

const width = 1920 * 0.6;
const height = 1080 * 0.6;

const w = (value: number) => `${width * (value / 1920)}px`;
const h = (value: number) => `${height * (value / 1080)}px`;

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
  @font-face {
    font-family: "ShinGo";
    font-weight: 200;
    src: url("/AP-OTF-ShinGoPr6N-Light.otf") format("opentype");
  }
  @font-face {
    font-family: "Montserrat";
    src: url("/Montserrat-VariableFont_wght.ttf") format("truetype");
  }
`;

const Wrapper = styled.div`
  width: ${w(1920)};
  height: ${h(1080)};
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

const Footer = styled.footer`
  width: ${w(1920)};
  height: ${h(1080)};
  background: url(${footerAsset});
  background-size: 100% 100%;
  position: absolute;
  bottom: 0;
  z-index: 100;
`;

const FooterContent = styled.div`
  width: ${w(1920)};
  height: ${h(50)};
  line-height: 1;
  color: #fff;
  font-size: ${w(50)};
  padding: 0 0 0 ${w(40)};
  display: flex;
  gap: ${w(30)};
  position: absolute;
  top: ${h(986)};
`;

const CurrentFutokyaku = styled.div`
  height: ${h(50)};
  margin: ${h(-4)} 0;
  padding: ${h(4)} ${w(12)};
  border-radius: ${w(4)};
  background: #ffcc00;
  display: inline-flex;
  align-items: center;

  img {
    height: ${h(40)};
  }
`;

const Migi = styled.div`
  width: ${w(1920)};
  height: ${h(1080)};
  position: absolute;
  top: 0;
  right: 0;
  z-index: 50;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
`;

const MigiContent = styled.div`
  width: ${w(1000)};
  height: ${h(1080)};
  padding: ${h(50)} ${w(240)} ${h(20)} ${w(30)};
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  right: 0;
`;

const CallingList = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${w(14)} ${w(14)};
`;

const CallingItem = styled.div`
  color: #000;
  flex: ${w(150)} 0 0;
  line-height: 0.85;
  text-align: center;
  font-family: "Montserrat";
  font-size: ${w(70)};
  font-weight: 600;
  text-shadow: 0 ${h(4)} ${w(4)} rgba(255, 255, 255, 1),
    0 0 ${w(20)} rgba(255, 255, 255, 0.8);
  padding: ${h(18)} ${w(8)};
  box-shadow: 0 ${h(4)} ${w(6)} rgba(0, 0, 0, 0.5);
  border-radius: ${w(8)};
  background: hsl(45, 100%, 90%);
  display: inline-block;
`;

const Waiting = styled.div`
  width: ${w(1920)};
  height: ${h(1080)};
  background: url(${waitingAsset});
  background-size: 100% 100%;
  position: absolute;
  top: ${h(0)};
  left: ${w(0)};
  z-index: 100;
`;

const WaitingMinutes = styled.div`
  width: ${w(400)};
  line-height: 1;
  color: #fff;
  text-align: center;
  text-shadow: 0 ${h(10)} ${w(10)} rgba(0, 0, 0, 0.1);
  font-size: ${w(270)};
  font-family: "Montserrat";
  font-weight: 700;
  position: absolute;
  bottom: ${h(285)};
  left: ${w(65)};
`;

const Futokyaku = styled.div`
  width: ${w(1920)};
  height: ${h(1080)};
  line-height: 1;
  color: #fff;
  text-shadow: 0 ${h(10)} ${w(20)} rgba(0, 0, 0, 0.5);
  background: url(${futokyakuAsset});
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const FutokyakuList = styled.div`
  position: absolute;
  top: ${h(44)};
  left: ${w(200)};
`;

const FutokyakuName = styled.div<{ no: number }>`
  line-height: ${h(114)};
  font-size: ${({ no }) => w(70 - no * 10)};
  font-weight: 200;
`;

const App = () => {
  const screenRef = useRef<HTMLDivElement>(null);

  const { currentCallings, waitingTime, futokyakus } = useSocket();

  const displayFullScreen = () => {
    screenRef.current?.requestFullscreen();
  };

  return (
    <>
      <Global styles={globalStyle} />
      <div ref={screenRef}>
        <Wrapper>
          <video src="/sai/movie.mp4" autoPlay muted loop />
          <Footer>
            <FooterContent>
              <CurrentFutokyaku>
                <img src={currentFutokyakuAsset} alt="現在の太客" />
              </CurrentFutokyaku>
              <Marquee speed={100}>
                {futokyakus.join(" ／ ") + "　　――　　"}
              </Marquee>
            </FooterContent>
          </Footer>
          <Migi>
            <img
              src={migiAsset}
              alt="呼び出し中番号 番号が表示されている方は列にお並びください"
            />
            <MigiContent>
              {currentCallings.length > 0 ? (
                <CallingList>
                  {currentCallings.map((c) => (
                    <CallingItem key={c}>{c}</CallingItem>
                  ))}
                </CallingList>
              ) : (
                <>TODO: なにかを出す</>
              )}
            </MigiContent>
          </Migi>
          <Waiting>
            <WaitingMinutes>{waitingTime}</WaitingMinutes>
          </Waiting>
          <Futokyaku>
            <FutokyakuList>
              {futokyakus.slice(0, 3).map((c, i) => (
                <FutokyakuName no={i} key={c}>
                  {c}
                </FutokyakuName>
              ))}
            </FutokyakuList>
          </Futokyaku>
        </Wrapper>
      </div>
      <button onClick={displayFullScreen}>フルスクリーン</button>
    </>
  );
};

export default App;
