import styled from "@emotion/styled";
import Marquee from "react-fast-marquee";

import currentFutokyakuAsset from "../assets/current-futokyaku.png";
import footerAsset from "../assets/footer.png";
import type { SalesSummary } from "../useSalesSummary";
import type { TipRankEntry } from "../useTipRanking";
import TipName from "./TipName";

const Wrapper = styled.footer`
  width: 100%;
  height: calc(var(--height) / 100 * 11.1);
  background: url(${footerAsset});
  background-size: 100% 100%;
  position: absolute;
  bottom: 0;
  z-index: 50;
`;

const Content = styled.div`
  width: calc(100% - var(--height) / 100 * 22);
  line-height: 1;
  color: #fff;
  font-size: calc(var(--height) / 100 * 4.5);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: calc(var(--height) / 100 * 2);
  position: absolute;
  left: calc(var(--height) / 100 * 2);
  bottom: calc(var(--height) / 100 * 3.2);
`;

const CurrentFutokyaku = styled.div`
  height: calc(var(--height) / 100 * 3.5);
  padding: calc(var(--height) / 100 * 1) calc(var(--height) / 100 * 2);
  border-radius: calc(var(--height) / 100 * 1);
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
