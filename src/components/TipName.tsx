import styled from "@emotion/styled";

// 黒塗りの帯。縁は付けず、書類の黒塗りと同じく黒一色にする
const Redacted = styled.span`
  display: inline-block;
  height: 1em;
  background: #000;
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
