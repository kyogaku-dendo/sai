import styled from "@emotion/styled";

import yoronFooterAsset from "../assets/yoron-footer.png";
import yoronHeaderAsset from "../assets/yoron-header.png";
import { useImi } from "../useImi";

const Wrapper = styled.div`
  width: 100%;
  height: calc(var(--height) / 100 * 90);
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
`;

const Content = styled.div`
  width: calc(var(--height) / 100 * 80);
  height: 100%;
  padding: calc(var(--height) / 100 * 2.5) calc(var(--height) / 100 * 3)
    calc(var(--height) / 100 * 2.5) calc(var(--height) / 100 * 4);
  border-top: solid calc(var(--height) / 100 * 2) #0959cc;
  color: #fff;
  text-shadow: 0 calc(var(--width) / 1920 * 2) calc(var(--width) / 1920 * 6)
    rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
`;

const YoronHeader = styled.img`
  width: 95%;
  margin-bottom: calc(var(--height) / 100 * 3);
  flex-shrink: 0;
`;

const YoronFooter = styled.img`
  width: 100%;
  margin-top: calc(var(--height) / 100 * 3);
  margin-bottom: calc(var(--height) / 100 * -9);
  flex-shrink: 0;
`;

// ヘッダーとフッターを置いた残りの高さに項目を収める
const YoronList = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: calc(var(--height) / 100 * 0.7);
`;

const YoronItem = styled.div`
  flex: 1 1 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const YoronTitle = styled.div<{ small: boolean }>`
  width: 45%;
  line-height: 1;
  font-size: calc(var(--height) / 100 * 3);
  font-weight: 600;
  word-break: auto-phrase;
`;

const YoronGraph = styled.div`
  width: 60%;
  height: 100%;
  line-height: 1;
  font-size: calc(var(--height) / 100 * 3.5);
  display: flex;
  border-radius: calc(var(--height) / 100 * 0.4);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
`;

const Yoronmeaningful = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffcc00;
`;

const YoronMeaningless = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0048a9;
`;

const Right = () => {
  const { imiResults } = useImi();

  return (
    <Wrapper>
      <Content>
        <YoronHeader src={yoronHeaderAsset} alt="んぽたそ世論調査 2026" />
        <YoronList>
          {imiResults.map((result) => (
            <YoronItem key={result.id}>
              <YoronTitle small={result.id === 7}>{result.title}</YoronTitle>
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
        </YoronList>
        <YoronFooter
          src={yoronFooterAsset}
          alt="投票は以下のサイトから！ imi.lapla.workers.dev"
        />
      </Content>
    </Wrapper>
  );
};

export default Right;
