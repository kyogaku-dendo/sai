import styled from "@emotion/styled";
import Marquee from "react-fast-marquee";

import futokyakuAsset from "../assets/futokyaku.png";
import type { TipRankEntry } from "../useTipRanking";
import TipName from "./TipName";

const Futokyaku = styled.div`
  width: calc(var(--height) / 100 * 60);
  aspect-ratio: 807 / 393;
  line-height: 1;
  color: #fff;
  text-shadow: 0 calc(var(--width) / 1920 * 10) calc(var(--width) / 1920 * 20)
    rgba(0, 0, 0, 0.5);
  background: url(${futokyakuAsset});
  background-size: 100% 100%;
  position: absolute;
  top: calc(var(--height) / 100 * 2);
  left: 0;
`;

const FutokyakuList = styled.div`
  position: absolute;
  top: calc(var(--height) / 100 * 0.5);
  left: calc(var(--height) / 100 * 10);
`;

// 順位が上の人ほど大きく出す
const FutokyakuItem = styled.div<{ rank: number }>`
  line-height: calc(var(--height) / 100 * 9.55);
  font-size: ${({ rank }) => `calc(var(--height) / 1920 * ${90 - Math.min(rank - 1, 3) * 10})`};
  display: flex;
  align-items: center;
  gap: calc(var(--height) / 100 * 4);
`;

const FutokyakuNo = styled.div`
  width: calc(var(--height) / 100 * 2);
`;

const FutokyakuName = styled.div`
  width: calc(var(--height) / 100 * 40);
  font-weight: 500;
  white-space: nowrap;
`;

// 英字と半角スペースは 0.5em、それ以外は 1em として幅を見積もる
const nameWidthEm = (name: string) =>
  [...name].reduce((sum, char) => sum + (/^[A-Za-z0-9 ]$/.test(char) ? 0.5 : 1), 0);

// 上位 3 人まで。枠に収まらない長い名前は流す
const FutokyakuTop = ({ ranking }: { ranking: TipRankEntry[] }) => (
  <Futokyaku>
    <FutokyakuList>
      {ranking.slice(0, 3).map((entry) => (
        <FutokyakuItem rank={entry.rank} key={`${entry.rank} ${entry.name}`}>
          <FutokyakuNo>{entry.rank}.</FutokyakuNo>
          <FutokyakuName>
            {nameWidthEm(entry.name) > 7 ? (
              <Marquee speed={100}>
                <TipName name={entry.name} />
                {"\u3000"}
              </Marquee>
            ) : (
              <TipName name={entry.name} />
            )}
          </FutokyakuName>
        </FutokyakuItem>
      ))}
    </FutokyakuList>
  </Futokyaku>
);

export default FutokyakuTop;
