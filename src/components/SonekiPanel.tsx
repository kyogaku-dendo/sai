import styled from "@emotion/styled";

import type { SalesSummary } from "../useSalesSummary";

const Panel = styled.div`
  line-height: 1;
  color: #000;
  background: linear-gradient(
    to right,
    rgba(255, 204, 0, 0.8),
    rgba(255, 204, 0, 0.7)
  );
  border-top-right-radius: calc(var(--height) / 100 * 2);
  border-bottom-right-radius: calc(var(--height) / 100 * 2);
  box-sizing: border-box;
  font-weight: 600;
  display: flex;
  align-items: stretch;
  position: absolute;
  bottom: calc(var(--height) / 100 * 14);
  left: 0;
  z-index: 100;
`;

const Bar = styled.div`
  width: calc(var(--height) / 100 * 6);
  position: relative;
  background: #ffcc00;
`;

const BarInner = styled.div<{ ratio: number }>`
  width: 70%;
  height: calc(100% * ${({ ratio }) => ratio});
  margin-left: 15%;
  border-top-left-radius: calc(var(--height) / 100 * 0.4);
  border-top-right-radius: calc(var(--height) / 100 * 0.4);
  background: #0048a9;
  position: absolute;
  bottom: 0;
`;

const BorderLine = styled.div<{ ratio: number }>`
  height: calc(var(--height) / 100 * 0.3);
  background: #ff6633;
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% * ${({ ratio }) => ratio});
  transform: translateY(50%);
`;

const BorderStar = styled.div`
  color: #ff6633;
  font-size: calc(var(--height) / 100 * 2.4);
  line-height: 1;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(80%, -50%);
`;

const Content = styled.div`
  padding-top: calc(var(--height) / 100 * 2.5);
  padding-right: calc(var(--height) / 100 * 3.5);
  padding-bottom: calc(var(--height) / 100 * 0.2);
  padding-left: calc(var(--height) / 100 * 2.5);
`;

const Heading = styled.div`
  width: 50%;
  font-size: calc(var(--height) / 100 * 3);
  margin-bottom: calc(var(--height) / 100 * 1.5);
  padding-bottom: calc(var(--height) / 100 * 1);
  border-bottom: solid calc(var(--height) / 100 * 0.2) rgba(0, 0, 0, 0.5);
`;

const Value = styled.div`
  font-size: calc(var(--height) / 100 * 7);
  margin-bottom: calc(var(--height) / 100 * 2);
`;

const Yen = styled.span`
  font-size: 50%;
  margin-left: calc(var(--height) / 1920 * 5);
`;

const formatYen = (yen: number | null | undefined) =>
  yen === null || yen === undefined ? "?????" : yen.toLocaleString("ja-JP");

// 損益分岐点を超えても★の線が棒の上端に張り付かないよう、目盛りに余白を持たせる
const BAR_HEADROOM = 1.15;

const SonekiPanel = ({ summary }: { summary: SalesSummary | null }) => {
  const salesYen = summary?.salesYen ?? 0;
  const borderYen = summary?.borderYen ?? null;
  const scaleYen = Math.max(salesYen, borderYen ?? 0) * BAR_HEADROOM;
  const toRatio = (yen: number) => (scaleYen > 0 ? yen / scaleYen : 0);

  return (
    <Panel>
      <Bar>
        <BarInner ratio={toRatio(salesYen)} />
        {borderYen !== null && (
          <BorderLine ratio={toRatio(borderYen)}>
            <BorderStar>★</BorderStar>
          </BorderLine>
        )}
      </Bar>
      <Content>
        <Heading>★損益分岐点</Heading>
        <Value>
          {formatYen(summary?.borderYen)}
          <Yen>円</Yen>
        </Value>
        <Heading>現在の売上</Heading>
        <Value>
          {formatYen(summary?.salesYen)}
          <Yen>円</Yen>
        </Value>
      </Content>
    </Panel>
  );
};

export default SonekiPanel;
