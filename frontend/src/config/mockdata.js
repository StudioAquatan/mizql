export const shelters = [
  {
    name: "京都工芸繊維大学",
    address: "京都府京都市左京区松ヶ崎橋上町",
    lat: 35.05004017,
    lon: 135.782933,
    distance: 0.0
  },
  {
    name: "京都市立松ヶ崎小学校",
    address: "京都府京都市左京区松ヶ崎堀町40",
    lat: 35.05333076,
    lon: 135.7821715,
    distance: 370.0
  },
  {
    name: "京都市立修学院第二小学校",
    address: "京都府京都市左京区一乗寺里ノ西町35",
    lat: 35.04478349,
    lon: 135.7886697,
    distance: 780.0
  },
  {
    name: "京都ノートルダム女子大学",
    address: "京都府京都市左京区下鴨南野々神町1",
    lat: 35.05070445,
    lon: 135.7723571,
    distance: 970.0
  },
  {
    name: "京都市立修学院中学校",
    address: "京都府京都市左京区一乗寺御祭田町2",
    lat: 35.04245594,
    lon: 135.7885355,
    distance: 990.0
  }
];

export const evacuees = [
  {time: "12:00", num: 10},
  {time: "13:00", num: 20},
  {time: "14:00", num: 50},
  {time: "15:00", num: 90},
  {time: "16:00", num: 100},
  {time: "17:00", num: 115},
];

export const area = {
  pk: 1,
  name: "京都府",
  alarms: [
    {
      pk: 6,
      code: 19,
      type: 0,
      name: "高潮注意報",
      created_at: "2018-11-06T17:37:42.563175+09:00"
    },
    {
      pk: 5,
      code: 16,
      type: 0,
      name: "波浪注意報",
      created_at: "2018-11-06T17:37:42.550208+09:00"
    },
    {
      pk: 4,
      code: 14,
      type: 1,
      name: "雷注意報",
      created_at: "2018-11-06T17:37:42.544564+09:00"
    },
    {
      pk: 3,
      code: 5,
      type: 1,
      name: "暴風警報",
      created_at: "2018-11-06T17:37:42.538144+09:00"
    },
    {
      pk: 2,
      code: 4,
      type: 1,
      name: "洪水警報",
      created_at: "2018-11-06T17:37:42.528560+09:00"
    },
    {
      pk: 1,
      code: 3,
      type: 1,
      name: "大雨警報",
      created_at: "2018-11-06T17:37:42.516061+09:00"
    }
  ],
  updated_at: "2018-11-06T17:37:41.925413+09:00"
};