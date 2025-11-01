import styled from "@emotion/styled";
import Marquee from "react-fast-marquee";

import currentFutokyakuAsset from "../assets/current-futokyaku.png";
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

const CurrentFutokyaku = styled.div`
  height: calc(var(--width) / 1920 * 44);
  margin: calc(var(--width) / 1920 * -4) 0;
  padding: calc(var(--width) / 1920 * 8) calc(var(--width) / 1920 * 12);
  border-radius: calc(var(--width) / 1920 * 4);
  background: #ffcc00;
  display: inline-flex;
  align-items: center;

  img {
    height: 100%;
  }
`;

interface FooterProps {
  futokyakus: { no: number; name: string }[];
}

const Footer = ({ futokyakus }: FooterProps) => {
  const futokyakuWaitingText =
    "チップをいただいたみなさまのお名前をこちらに掲示いたします";

  return (
    <Wrapper>
      <Content>
        <CurrentFutokyaku>
          <img src={currentFutokyakuAsset} alt="現在の太客" />
        </CurrentFutokyaku>
        <Marquee speed={100}>
          {futokyakus.length > 0
            ? futokyakus.map((f) => f.name).join(" ／ ") + "　　――　　"
            : futokyakuWaitingText}
        </Marquee>
      </Content>
    </Wrapper>
  );
};

export default Footer;
