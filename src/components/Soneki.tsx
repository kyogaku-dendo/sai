import styled from "@emotion/styled";

// 去年の「分待ち」パネル（waiting.png）の右半分と同じ見た目を、左半分なしの 1 枚のカードとして描く。
// 画像の切り抜きでは左の角が欠けるので CSS で描き、空いた分だけ大きくする
const Card = styled.div`
  width: calc(var(--width) / 1920 * 720);
  height: calc(var(--width) / 1920 * 450);
  padding: calc(var(--width) / 1920 * 40) calc(var(--width) / 1920 * 40) 0
    calc(var(--width) / 1920 * 130);
  border-radius: calc(var(--width) / 1920 * 40);
  box-sizing: border-box;
  color: #000;
  background: linear-gradient(135deg, #ea8478 0%, #eba84a 50%, #e9d21a 100%);
  box-shadow: 0 calc(var(--width) / 1920 * 10) calc(var(--width) / 1920 * 30)
    rgba(0, 0, 0, 0.35);
  overflow: hidden;
  position: absolute;
  bottom: calc(var(--width) / 1920 * 150);
  left: calc(var(--width) / 1920 * 30);
  z-index: 100;

  /* 去年の画像と同じく、上は少し空けて下の縁まで届く青い帯 */
  &::before {
    content: "";
    width: calc(var(--width) / 1920 * 44);
    background: #0048a9;
    position: absolute;
    top: calc(var(--width) / 1920 * 40);
    bottom: 0;
    left: calc(var(--width) / 1920 * 50);
  }
`;

const Label = styled.div`
  line-height: 1;
  font-size: calc(var(--width) / 1920 * 46);
  font-weight: 700;
`;

// 「損益分岐点」の下の線は、青い帯からカードの右端近くまで引く
const Rule = styled.div`
  height: calc(var(--width) / 1920 * 3);
  margin: calc(var(--width) / 1920 * 22) 0 0 calc(var(--width) / 1920 * -80);
  background: #222;
`;

const Amount = styled.div`
  margin: calc(var(--width) / 1920 * 22) 0 calc(var(--width) / 1920 * 36);
  line-height: 1;
  font-family: Gotham;
  font-size: calc(var(--width) / 1920 * 104);
  font-weight: 600;
  white-space: nowrap;
`;

const Yen = styled.span`
  font-family: "ShinGo";
  font-size: 0.4em;
  font-weight: 700;
  margin-left: calc(var(--width) / 1920 * 8);
`;

const formatYen = (yen: number | null) =>
  yen === null ? "?????" : yen.toLocaleString("ja-JP");

const Soneki = ({
  salesYen,
  borderYen,
}: {
  salesYen: number | null;
  borderYen: number | null;
}) => (
  <Card>
    <Label>損益分岐点</Label>
    <Rule />
    <Amount>
      {formatYen(borderYen)}
      <Yen>円</Yen>
    </Amount>
    <Label>現在の売上</Label>
    <Amount>
      {formatYen(salesYen)}
      <Yen>円</Yen>
    </Amount>
  </Card>
);

export default Soneki;
