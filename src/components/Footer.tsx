import styled from "@emotion/styled";
import Marquee from "react-fast-marquee";

import footerAsset from "../assets/footer.png";

const Wrapper = styled.footer`
  width: 100%;
  aspect-ratio: 1920 / 128;
  background: url(${footerAsset});
  background-size: 100% 100%;
  position: absolute;
  bottom: 0;
  z-index: 100;
`;

const Content = styled.div`
  width: 100%;
  height: calc(var(--width) / 1920 * 50);
  line-height: 1;
  color: #fff;
  font-size: calc(var(--width) / 1920 * 50);
  padding: 0 0 0 calc(var(--width) / 1920 * 40);
  box-sizing: border-box;
  display: flex;
  gap: calc(var(--width) / 1920 * 30);
  position: absolute;
  bottom: calc(var(--width) / 1920 * 44);
`;

const Footer = () => {
  return (
    <Wrapper>
      <Content>
        <Marquee speed={100}>驚額の殿堂ファイナルへようこそ</Marquee>
      </Content>
    </Wrapper>
  );
};

export default Footer;
