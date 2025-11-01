import styled from "@emotion/styled";

import migiAsset from "../assets/migi.png";
import yoronFooterAsset from "../assets/yoron-footer.png";
import yoronHeaderAsset from "../assets/yoron-header.png";
import { useImi } from "../useImi";

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - var(--width) / 1920 * 80);
  position: absolute;
  top: 0;
  right: 0;
  z-index: 50;

  > img {
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
  padding: calc(var(--width) / 1920 * 20) calc(var(--width) / 1920 * 290)
    calc(var(--width) / 1920 * 20) calc(var(--width) / 1920 * 30);
  border-top: solid calc(var(--width) / 1920 * 25) #0959cc;
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

const CallingItem = styled.div<{ scale: number }>`
  flex: calc(var(--width) / 1920 * 140 * ${({ scale }) => scale}) 0 0;
  color: #000;
  line-height: 0.85;
  text-align: center;
  text-shadow: 0 calc(var(--width) / 1920 * 4) calc(var(--width) / 1920 * 4)
      rgba(255, 255, 255, 1),
    0 0 calc(var(--width) / 1920 * 20) rgba(255, 255, 255, 0.8);
  font-family: Gotham;
  font-size: calc(var(--width) / 1920 * 70 * ${({ scale }) => scale});
  font-weight: 600;
  padding: calc(var(--width) / 1920 * 18 * ${({ scale }) => scale})
    calc(var(--width) / 1920 * 8 * ${({ scale }) => scale});
  border-radius: calc(var(--width) / 1920 * 8 * ${({ scale }) => scale});
  box-shadow: 0 calc(var(--width) / 1920 * 4) calc(var(--width) / 1920 * 6)
    rgba(0, 0, 0, 0.5);
  background: hsl(45, 100%, 90%);
  display: inline-block;
`;

const Yoron = styled.div`
  width: 100%;
  height: 100%;
  color: #fff;
  text-shadow: 0 calc(var(--width) / 1920 * 2) calc(var(--width) / 1920 * 6)
    rgba(0, 0, 0, 0.5);
  padding: calc(var(--width) / 1920 * 15) 0 calc(var(--width) / 1920 * 20)
    calc(var(--width) / 1920 * 10);
  box-sizing: border-box;
`;

const YoronHeader = styled.img`
  width: 90%;
  text-align: center;
  margin-left: 5%;
  margin-bottom: calc(var(--width) / 1920 * 25);
`;

const YoronFooter = styled.img`
  width: 100%;
  margin-top: calc(var(--width) / 1920 * 20);
`;

const YoronItem = styled.div`
  height: calc(var(--width) / 1920 * 65);
  margin-bottom: calc(var(--width) / 1920 * 10);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const YoronTitle = styled.div<{ small: boolean }>`
  width: 45%;
  line-height: 1;
  font-size: calc(var(--width) / 1920 * ${({ small }) => (small ? 25 : 40)});
  font-weight: 600;
  margin-bottom: calc(var(--width) / 1920 * 10);
  word-break: auto-phrase;
`;

const YoronGraph = styled.div`
  width: 60%;
  height: 100%;
  line-height: calc(var(--width) / 1920 * 65);
  text-align: center;
  font-size: calc(var(--width) / 1920 * 40);
  display: flex;
  background: rgba(0, 0, 0, 0.5);
`;

const Yoronmeaningful = styled.div`
  height: 100%;
  background: #ffcc00;
`;

const YoronMeaningless = styled.div`
  height: 100%;
  background: #0048a9;
`;

interface RightProps {
  currentCallings: string[];
}

const Right = ({ currentCallings }: RightProps) => {
  const { imiResults } = useImi();

  let callingScale: number;
  if (currentCallings.length > 18) {
    callingScale = 1.0;
  } else if (currentCallings.length > 12) {
    callingScale = 1.25;
  } else if (currentCallings.length > 8) {
    callingScale = 1.5;
  } else {
    callingScale = 2.0;
  }

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
              <CallingItem key={c} scale={callingScale}>
                {c}
              </CallingItem>
            ))}
          </CallingList>
        ) : (
          <Yoron>
            <YoronHeader src={yoronHeaderAsset} alt="んぽたそ世論調査" />
            <div>
              {imiResults.map((result) => (
                <YoronItem>
                  <YoronTitle small={result.id === 7}>
                    {result.title}
                  </YoronTitle>
                  <YoronGraph>
                    <Yoronmeaningful
                      style={{
                        flexBasis:
                          (result.meaningful /
                            (result.meaningful + result.meaningless)) *
                            100 +
                          "%",
                      }}
                    >
                      {result.meaningful}
                    </Yoronmeaningful>
                    <YoronMeaningless
                      style={{
                        flexBasis:
                          (result.meaningless /
                            (result.meaningful + result.meaningless)) *
                            100 +
                          "%",
                      }}
                    >
                      {result.meaningless}
                    </YoronMeaningless>
                  </YoronGraph>
                </YoronItem>
              ))}
            </div>
            <YoronFooter
              src={yoronFooterAsset}
              alt="投票は以下のサイトから！ https://imi.lapla.workers.dev"
            />
          </Yoron>
        )}
      </Content>
    </Wrapper>
  );
};

export default Right;
