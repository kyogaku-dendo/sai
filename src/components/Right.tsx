import styled from "@emotion/styled";

import migiAsset from "../assets/migi.png";

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - var(--width) / 1920 * 80);
  position: absolute;
  top: 0;
  right: 0;
  z-index: 50;

  img {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }
`;

const Content = styled.div`
  width: calc(var(--width) / 1920 * 1000);
  height: 100%;
  padding: calc(var(--width) / 1920 * 20) calc(var(--width) / 1920 * 240)
    calc(var(--width) / 1920 * 20) calc(var(--width) / 1920 * 30);
  border-top: solid 14px #0959cc;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  right: 0;
`;

const CallingList = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: calc(var(--width) / 1920 * 14) calc(var(--width) / 1920 * 14);
`;

const CallingItem = styled.div`
  flex: calc(var(--width) / 1920 * 150) 0 0;
  color: #000;
  line-height: 0.85;
  text-align: center;
  text-shadow: 0 calc(var(--width) / 1920 * 4) calc(var(--width) / 1920 * 4)
      rgba(255, 255, 255, 1),
    0 0 calc(var(--width) / 1920 * 20) rgba(255, 255, 255, 0.8);
  font-family: Gotham;
  font-size: calc(var(--width) / 1920 * 80);
  font-weight: 600;
  padding: calc(var(--width) / 1920 * 18) calc(var(--width) / 1920 * 8);
  border-radius: calc(var(--width) / 1920 * 8);
  box-shadow: 0 calc(var(--width) / 1920 * 4) calc(var(--width) / 1920 * 6)
    rgba(0, 0, 0, 0.5);
  background: hsl(45, 100%, 90%);
  display: inline-block;
`;

interface RightProps {
  currentCallings: string[];
}

const Right = ({ currentCallings }: RightProps) => {
  return (
    <Wrapper>
      <img
        src={migiAsset}
        alt="呼び出し中番号 番号が表示されている方は列にお並びください"
      />
      <Content>
        {currentCallings.length > 0 ? (
          <CallingList>
            {currentCallings.map((c) => (
              <CallingItem key={c}>{c}</CallingItem>
            ))}
          </CallingList>
        ) : (
          <>TODO: なにかを出す</>
        )}
      </Content>
    </Wrapper>
  );
};

export default Right;
