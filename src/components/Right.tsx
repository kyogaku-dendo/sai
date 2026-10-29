import styled from "@emotion/styled";

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
`;

const Content = styled.div`
  width: calc(var(--width) / 1920 * 1000);
  height: 100%;
  padding: calc(var(--width) / 1920 * 20) calc(var(--width) / 1920 * 30);
  border-top: solid calc(var(--width) / 1920 * 25) #0959cc;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  right: 0;
`;

// 項目の数が変わっても枠からはみ出さないよう、見出しと投票先の間を項目で分け合う
const Yoron = styled.div`
  width: 100%;
  height: 100%;
  color: #fff;
  text-shadow: 0 calc(var(--width) / 1920 * 2) calc(var(--width) / 1920 * 6)
    rgba(0, 0, 0, 0.5);
  /* 下はフッターの帯と重なるので、その分空ける */
  padding: calc(var(--width) / 1920 * 15) 0 calc(var(--width) / 1920 * 40)
    calc(var(--width) / 1920 * 10);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const YoronHeader = styled.img`
  width: 80%;
  margin: 0 auto calc(var(--width) / 1920 * 20);
`;

const YoronList = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const YoronItem = styled.div`
  flex: 0 1 calc(var(--width) / 1920 * 62);
  min-height: 0;
  display: flex;
  align-items: center;
  gap: calc(var(--width) / 1920 * 20);
`;

const YoronTitle = styled.div`
  flex: 0 0 38%;
  line-height: 1.1;
  font-size: calc(var(--width) / 1920 * 36);
  font-weight: 600;
  word-break: auto-phrase;
`;

const YoronGraph = styled.div`
  flex: 1;
  height: 100%;
  font-family: Gotham;
  font-size: calc(var(--width) / 1920 * 36);
  display: flex;
  background: rgba(0, 0, 0, 0.5);
`;

const YoronBar = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const YoronFooter = styled.img`
  width: 80%;
  margin: calc(var(--width) / 1920 * 20) auto 0;
`;

const Right = () => {
  const { imiResults } = useImi();

  return (
    <Wrapper>
      <Content>
        <Yoron>
          <YoronHeader src={yoronHeaderAsset} alt="んぽたそ世論調査" />
          <YoronList>
            {imiResults.map((result) => {
              const total = result.meaningful + result.meaningless;
              return (
                <YoronItem key={result.id}>
                  <YoronTitle>{result.title}</YoronTitle>
                  <YoronGraph>
                    <YoronBar
                      style={{
                        flexBasis: `${total ? (result.meaningful / total) * 100 : 50}%`,
                        background: "#ffcc00",
                      }}
                    >
                      {result.meaningful}
                    </YoronBar>
                    <YoronBar
                      style={{
                        flexBasis: `${total ? (result.meaningless / total) * 100 : 50}%`,
                        background: "#0048a9",
                      }}
                    >
                      {result.meaningless}
                    </YoronBar>
                  </YoronGraph>
                </YoronItem>
              );
            })}
          </YoronList>
          <YoronFooter
            src={yoronFooterAsset}
            alt="投票は以下のサイトから！ https://imi.lapla.workers.dev"
          />
        </Yoron>
      </Content>
    </Wrapper>
  );
};

export default Right;
