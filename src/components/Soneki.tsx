import styled from "@emotion/styled";

// 去年の「分待ち」パネルを切り抜いて使っていたのをやめ、損益分岐点と売上だけのカードにする。
// 色は去年の画像のグラデーションと青い帯を引き継ぐ
const Card = styled.div`
  width: calc(var(--width) / 1920 * 640);
  padding: calc(var(--width) / 1920 * 32) calc(var(--width) / 1920 * 44)
    calc(var(--width) / 1920 * 36) calc(var(--width) / 1920 * 72);
  border-radius: calc(var(--width) / 1920 * 32);
  box-sizing: border-box;
  color: #000;
  background: linear-gradient(135deg, #ea8478 0%, #eba84a 55%, #e9cf22 100%);
  box-shadow: 0 calc(var(--width) / 1920 * 10) calc(var(--width) / 1920 * 30)
    rgba(0, 0, 0, 0.35);
  overflow: hidden;
  position: absolute;
  bottom: calc(var(--width) / 1920 * 152);
  left: calc(var(--width) / 1920 * 32);
  z-index: 100;

  &::before {
    content: "";
    width: calc(var(--width) / 1920 * 28);
    background: #0048a9;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }
`;

const Label = styled.div`
  font-size: calc(var(--width) / 1920 * 34);
  font-weight: 700;
`;

const Amount = styled.div<{ size: number }>`
  line-height: 1;
  font-family: Gotham;
  font-size: ${({ size }) => `calc(var(--width) / 1920 * ${size})`};
  font-weight: 600;
  white-space: nowrap;
`;

const Yen = styled.span`
  font-family: "ShinGo";
  font-size: 0.4em;
  font-weight: 700;
  margin-left: calc(var(--width) / 1920 * 8);
`;

const Progress = styled.div`
  height: calc(var(--width) / 1920 * 22);
  margin: calc(var(--width) / 1920 * 24) 0 calc(var(--width) / 1920 * 20);
  border-radius: calc(var(--width) / 1920 * 11);
  background: rgba(0, 0, 0, 0.15);
  overflow: hidden;

  > div {
    height: 100%;
    background: #0048a9;
    transition: width 1s ease-out;
  }
`;

const BorderRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const formatYen = (yen: number | null | undefined) =>
  yen === null || yen === undefined ? "?????" : yen.toLocaleString("ja-JP");

const Soneki = ({
  salesYen,
  borderYen,
}: {
  salesYen: number | null;
  borderYen: number | null;
}) => {
  const ratio =
    salesYen !== null && borderYen ? Math.min(salesYen / borderYen, 1) : null;

  return (
    <Card>
      <Label>現在の売上</Label>
      <Amount size={112}>
        {formatYen(salesYen)}
        <Yen>円</Yen>
      </Amount>
      {ratio !== null && (
        <Progress>
          <div style={{ width: `${ratio * 100}%` }} />
        </Progress>
      )}
      {/* hato に損益分岐点が設定されていなければ、読み込めたあとは行ごと出さない */}
      {(salesYen === null || borderYen !== null) && (
        <BorderRow>
          <Label>{ratio === 1 ? "損益分岐点を突破！" : "損益分岐点"}</Label>
          <Amount size={52}>
            {formatYen(borderYen)}
            <Yen>円</Yen>
          </Amount>
        </BorderRow>
      )}
    </Card>
  );
};

export default Soneki;
