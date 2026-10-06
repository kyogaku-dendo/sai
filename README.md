# sai

Vite + React + TypeScript で構築された，驚額の殿堂用のデジタルサイネージです．

要件：<https://hackmd.io/b4EHlh_XSWC3S1jDRTe3uQ>

## 開発

```
yarn
yarn run dev
```

### スクリーンショットの共有

.env.local に以下を追記します．これらが空の場合は，スクリーンショットの共有は停止されます．
スクリーンショットは GET: <VITE_RENBAI_BACKEND_URL>/screenshot から取得できます．

```
VITE_RENBAI_BACKEND_URL=https://renbai-backend.yokohama.dev
VITE_RENBAI_BACKEND_TOKEN=<TOKEN>
```

### 売上の取得元

売上（損益分岐点・現在の売上・商品別販売数）は，会場 PC で動く [hato](https://github.com/kyogaku-dendo/hato) の `GET /summary` から 5 秒おきに読みます．既定の取得先は `http://127.0.0.1:8787` です．別の場所の hato を読むときは .env.local に書きます．

```
VITE_HATO_URL=http://127.0.0.1:8787
```

## 運用

会場 PC で hato を起動したうえで，sai をビルドして同じ PC から配信します．

```
yarn build
yarn preview
```

`http://localhost:3000/sai` を開き，「フルスクリーン」を押します．

- 回線が切れたり hato が止まったりしても，最後に読めた売上を出し続けます．画面を再読み込みしても消えません（localStorage に保存）．
- 売上が 1 分以上更新されないときは，時計の下に「売上は hh:mm 時点」と表示します．
- 画面をクラウドに置くと，回線断の間に再読み込みしたとき画面そのものが開けなくなります．会場 PC から配信してください．
