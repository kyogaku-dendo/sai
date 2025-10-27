# sai

Vite + React + TypeScript で構築された，驚額の殿堂3（スリー）用のデジタルサイネージです．

要件：<https://hackmd.io/b4EHlh_XSWC3S1jDRTe3uQ>

## 開発

```
yarn
yarn run dev
```

## 運用

`yarn dev`で`http://localhost:3000/sai`にサーバーが立ち上がります．これはPOSアプリケーション[yagi](https://github.com/kyogaku-dendo/yagi)側でリバースプロキシの設定がなされていて`http://localhost:5173/sai`（yagiのポートは状況に応じて調整してください）でアクセスできるようになっています．実際に利用するときはyagiとsaiの間の通信にBroadcastChannel APIを用いるためこちらのURLでアクセスしてください．
