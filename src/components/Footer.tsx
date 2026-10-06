import styled from "@emotion/styled";
import Marquee from "react-fast-marquee";

import footerAsset from "../assets/footer.png";
import type { SalesSummary } from "../useSalesSummary";

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

const WELCOME_TEXT = "驚額の殿堂ファイナルへようこそ";
const GAP = "\u3000";

const describeSales = (summary: SalesSummary | null) => {
  if (!summary || summary.items.length === 0) return WELCOME_TEXT;
  const items = summary.items
    .map((item) => {
      const name = item.variationName
        ? `${item.name}（${item.variationName}）`
        : item.name;
      return `${name} ${item.quantity.toLocaleString("ja-JP")}`;
    })
    .join(" ／ ");
  const count = summary.paymentsCount.toLocaleString("ja-JP");
  return `本日の販売数${GAP}${items}${GAP}――${GAP}お会計 ${count} 件${GAP}――${GAP}`;
};

const Footer = ({ summary }: { summary: SalesSummary | null }) => {
  return (
    <Wrapper>
      <Content>
        <Marquee speed={100}>{describeSales(summary)}</Marquee>
      </Content>
    </Wrapper>
  );
};

export default Footer;
