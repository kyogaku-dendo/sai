import styled from "@emotion/styled";
import Marquee from "react-fast-marquee";

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
  z-index: 100;
`;

const Content = styled.div`
  width: 100%;
  height: calc(var(--width) / 1920 * 50);
  line-height: 1;
  color: #fff;
  font-size: calc(var(--width) / 1920 * 50);
  white-space: nowrap;
  display: flex;
  position: absolute;
  bottom: calc(var(--width) / 1920 * 44);
`;

// 見出しは左に固定せず流れる文の中に置き、区切りごとに何の一覧かを示す。
// react-fast-marquee が中で --width を自分の幅に書き換えるので、大きさは周りの文字に対する em で決める
const Heading = styled.span`
  height: 1.2em;
  margin-right: 0.5em;
  padding: 0 0.3em;
  border-radius: 0.1em;
  color: #000060;
  font-size: 0.76em;
  font-weight: 700;
  line-height: 1;
  background: #ffcc00;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
`;

const WELCOME_TEXT = "驚額の殿堂ファイナルへようこそ";
const FUTOKYAKU_WAITING_TEXT =
  "チップをいただいたみなさまのお名前をこちらに掲示いたします";
const GAP = "　";
const SEPARATOR = `${GAP}――${GAP}`;

const jstDate = (now: Date) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);

const isToday = (today: SalesSummary["today"]) =>
  // 回線断の間は前日の値が残っていることがあるので、日付が今日のものだけを出す
  today !== undefined && today.date === jstDate(new Date()) && today.items.length > 0;

const describeItems = (today: NonNullable<SalesSummary["today"]>) => {
  const items = today.items
    .map((item) => {
      const name = item.variationName
        ? `${item.name}（${item.variationName}）`
        : item.name;
      return `${name} ${item.quantity.toLocaleString("ja-JP")}`;
    })
    .join(" ／ ");
  const count = today.paymentsCount.toLocaleString("ja-JP");
  return `${items}${GAP}・${GAP}お会計 ${count} 件`;
};

// 太客を順位どおりに流し、そのあとに本日の販売数を続ける
const Footer = ({
  summary,
  ranking,
}: {
  summary: SalesSummary | null;
  ranking: TipRankEntry[];
}) => {
  const today = summary?.today;

  return (
    <Wrapper>
      <Content>
        <Marquee speed={100}>
          <Heading>現在の太客</Heading>
          {ranking.length > 0
            ? ranking.map((entry, i) => (
                <span key={`${entry.rank} ${entry.name}`}>
                  {i > 0 && " ／ "}
                  <TipName name={entry.name} />
                </span>
              ))
            : FUTOKYAKU_WAITING_TEXT}
          {SEPARATOR}
          {today && isToday(today) ? (
            <>
              <Heading>本日の販売数</Heading>
              {describeItems(today)}
            </>
          ) : (
            WELCOME_TEXT
          )}
          {SEPARATOR}
        </Marquee>
      </Content>
    </Wrapper>
  );
};

export default Footer;
