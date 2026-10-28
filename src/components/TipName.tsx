import styled from "@emotion/styled";

// 黒塗りの帯。地が濃い色でも黒が沈まないよう、縁を付ける
const Redacted = styled.span`
  display: inline-block;
  height: 1em;
  background: #000;
  outline: solid calc(var(--width) / 1920 * 2) rgba(255, 255, 255, 0.7);
  vertical-align: -0.1em;
`;

/** hato は黒塗りした文字を ■ で返す。続いた ■ は 1 本の帯にする */
const TipName = ({ name }: { name: string }) => (
  <>
    {name.split(/(■+)/).map((part, i) =>
      part.startsWith("■") ? (
        <Redacted key={i} style={{ width: `${part.length}em` }} />
      ) : (
        part
      )
    )}
  </>
);

export default TipName;
