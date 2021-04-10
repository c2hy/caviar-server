const Router = require("koa-router");
const { DateTime } = require("luxon");
const { redisClient } = require("./infrastructure");

const router = new Router();

const map = new Map();
map.set("100000", [
  {
    momentId: "100000M1",
    createdTime: DateTime.now().minus({ days: 10 }).toMillis(),
    content:
      "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
  },
  {
    momentId: "100000M2",
    createdTime: DateTime.now().toMillis(),
    content: "Wish I could come, but I'm out of town this weekend.",
  },
]);
map.set("100001", [
  {
    momentId: "100001M1",
    createdTime: DateTime.now().minus({ days: 10 }).toMillis(),
    content:
      "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
  },
  {
    momentId: "100001M2",
    createdTime: DateTime.now().toMillis(),
    content: "Wish I could come, but I'm out of town this weekend.",
  },
]);
map.set("100002", [
  {
    momentId: "100002M1",
    createdTime: DateTime.now().minus({ days: 10 }).toMillis(),
    content:
      "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
  },
  {
    momentId: "100002M2",
    createdTime: DateTime.now().toMillis(),
    content: "Wish I could come, but I'm out of town this weekend.",
  },
]);
map.set("100003", [
  {
    momentId: "100003M1",
    createdTime: DateTime.now().minus({ days: 10 }).toMillis(),
    content:
      "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
  },
  {
    momentId: "100003M2",
    createdTime: DateTime.now().toMillis(),
    content: "Wish I could come, but I'm out of town this weekend.",
  },
]);

router.post("/current-user", async (ctx) => {
  ctx.body = {
    userId: "100000",
    nickName: "开发者",
    avatar: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairSides",
  };
});

router.post("/moments", async (ctx) => {
  const userId = ctx.request.body.userId;
  ctx.body = map.get(userId);
});

router.post("/friends", async (ctx) => {
  ctx.body = [
    {
      userId: "100000",
      nickName: "鱼子酱",
      avatar: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairSides",
    },
    {
      userId: "100001",
      nickName: "路人甲",
      avatar:
        "https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Blank&facialHairType=Blank&clotheType=CollarSweater&clotheColor=Pink&eyeType=WinkWacky&eyebrowType=SadConcerned&mouthType=Sad&skinColor=Tanned",
    },
    {
      userId: "100002",
      nickName: "白发老头",
      avatar:
        "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat2&accessoriesType=Wayfarers&hatColor=Blue01&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=ShirtScoopNeck&clotheColor=White&eyeType=Happy&eyebrowType=AngryNatural&mouthType=Serious&skinColor=Tanned",
    },
    {
      userId: "100003",
      nickName: "Caviar😂",
      avatar:
        "https://avataaars.io/?avatarStyle=Circle&topType=LongHairBun&accessoriesType=Prescription02&hatColor=White&hairColor=BrownDark&facialHairType=BeardLight&facialHairColor=Blonde&clotheType=ShirtVNeck&clotheColor=PastelYellow&eyeType=Side&eyebrowType=Angry&mouthType=Eating&skinColor=Brown",
    },
  ];
});

router.post("/recent", async (ctx) => {
  ctx.body = [
    {
      userId: "100000",
      nickName: "鱼子酱",
      avatar: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairSides",
      newestMoment: {
        createdTime: DateTime.now().toMillis(),
        content: "鱼子酱的最新动态",
      },
    },
    {
      userId: "100001",
      nickName: "路人甲",
      avatar:
        "https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Blank&facialHairType=Blank&clotheType=CollarSweater&clotheColor=Pink&eyeType=WinkWacky&eyebrowType=SadConcerned&mouthType=Sad&skinColor=Tanned",
      newestMoment: {
        createdTime: DateTime.now().toMillis(),
        content: "路人甲的最新动态",
      },
    },
    {
      userId: "100002",
      nickName: "白发老头",
      avatar:
        "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat2&accessoriesType=Wayfarers&hatColor=Blue01&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=ShirtScoopNeck&clotheColor=White&eyeType=Happy&eyebrowType=AngryNatural&mouthType=Serious&skinColor=Tanned",
      newestMoment: {
        createdTime: DateTime.now().toMillis(),
        content: "白发老头的最新动态",
      },
    },
    {
      userId: "100003",
      nickName: "Caviar😂",
      avatar:
        "https://avataaars.io/?avatarStyle=Circle&topType=LongHairBun&accessoriesType=Prescription02&hatColor=White&hairColor=BrownDark&facialHairType=BeardLight&facialHairColor=Blonde&clotheType=ShirtVNeck&clotheColor=PastelYellow&eyeType=Side&eyebrowType=Angry&mouthType=Eating&skinColor=Brown",
      newestMoment: {
        createdTime: DateTime.now().toMillis(),
        content: "Caviar😂的最新动态",
      },
    },
  ];
});

router.post("/moments", async (ctx) => {
  const userId = ctx.request.body.userId;
  ctx.body = map.get(userId);
});

module.exports = router;
