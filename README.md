# dailyLogger

Daily Report logger by Electron framework.

The app is intended for whom manage one or more projects to keep track of their work with clients and team members.

like...

```

# Daily Report  2023-04-01


## 09:00 Project-ABC meeting

brabrabra　。。。


## 10:00 Project-XYZ  from Mr. Yamamoto
He ordered upgrading some functions.

details:

- func1:  .....
- func2:  ....

```

## Version

- 1.0.1 タスクバーに常駐
- 1.0.2 人名を登録、選択可能に
- 1.0.3 OSシャットダウン処理,ビルド(win,linux) の実験 (build.sh)

```
(v.1.0.3)
|       | 実行 | app  icon | Tray  Icon | installer      |
|-------|------|-----------|------------|----------------|
| mac   | O    | O         | O          | O (dmg)        |
| win   | O    | O         | O          | X 途中で止まる |
| linux | O    | X         | X          | O              |

```



## Usage

This app is writing 'daily report' as your working log.
It d


1. first time you run the app, please press "gear" icon in right top of teh scree and set data folder where your report will be saved.

2. add project name for easy post of your log.

3. 


## install

```
yarn
```

## run

```
yarn start
```

## build

'yarn make' does not work for darwin so please use following script.

```
./build.sh
```




