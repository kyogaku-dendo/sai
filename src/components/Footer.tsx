import styled from "@emotion/styled";
import Marquee from "react-fast-marquee";

import currentFutokyakuAsset from "../assets/current-futokyaku.png";
import footerAsset from "../assets/footer.png";
import type { SalesSummary } from "../useSalesSummary";
import type { TipRankEntry } from "../useTipRanking";
import TipName from "./TipName";

const Wrapper = styled.footer`
  width: 100%;
  aspect-ratio: 1920 / 128;
  background: url(${footerAsset});
  background-size: 100% 100%;
  position: absolute;
  bottom: 0;
  z-index: 50;
`;

const Content = styled.div`
  width: 86%;
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
  flex-shrink: 0;

  img {
    height: 100%;
  }
`;

const WELCOME_TEXT = "驚額の殿堂ファイナルへようこそ";
const FUTOKYAKU_WAITING_TEXT =
  "チップをいただいたみなさまのお名前をこちらに掲示いたします";
const GAP = "　";
const SEPARATOR = `${GAP}――${GAP}`;

const jstDate = (now: Date) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);

const describeSales = (summary: SalesSummary | null) => {
  // 回線断の間は前日の値が残っていることがあるので、日付が今日のものだけを出す
  const today = summary?.today;
  if (!today || today.date !== jstDate(new Date()) || today.items.length === 0) {
    return WELCOME_TEXT;
  }
  const items = today.items
    .map((item) => {
      const name = item.variationName
        ? `${item.name}（${item.variationName}）`
        : item.name;
      return `${name} ${item.quantity.toLocaleString("ja-JP")}`;
    })
    .join(" ／ ");
  const count = today.paymentsCount.toLocaleString("ja-JP");
  return `本日の販売数${GAP}${items}${SEPARATOR}お会計 ${count} 件`;
};

// 太客を順位どおりに流し、そのあとに本日の販売数を続ける
const Footer = ({
  summary,
  ranking,
}: {
  summary: SalesSummary | null;
  ranking: TipRankEntry[];
}) => {
  return (
    <Wrapper>
      <Content>
        <CurrentFutokyaku>
          <img src={currentFutokyakuAsset} alt="現在の太客" />
        </CurrentFutokyaku>
        <Marquee speed={100}>
          {ranking.length > 0
            ? ranking.map((entry, i) => (
                <span key={`${entry.rank} ${entry.name}`}>
                  {i > 0 && " ／ "}
                  <TipName name={entry.name} />
                </span>
              ))
            : FUTOKYAKU_WAITING_TEXT}
          {`${SEPARATOR}${describeSales(summary)}${SEPARATOR}`}
        </Marquee>
      </Content>
    </Wrapper>
  );
};

export default Footer;
