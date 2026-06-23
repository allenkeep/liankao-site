// 每日金句 - 含传统节日/节气匹配
var dailyQuotes = [
  { text: "种一棵树最好的时间是十年前，其次是现在。", author: "丹比萨·莫约" },
  { text: "你不需要很厉害才能开始，但你需要开始才能很厉害。", author: "齐格·齐格勒" },
  { text: "所有的努力，不是为了让别人觉得你了不起，而是为了能让自己打心里看得起自己。", author: "" },
  { text: "当你觉得为时已晚的时候，恰恰是最早的时候。", author: "" },
  { text: "方向比速度更重要，想清楚再出发，胜过盲目努力。", author: "雷军" },
  { text: "人生的路，靠自己一步步走去，真正能保护你的，是你自己的人格选择和文化选择。", author: "余秋雨" },
  { text: "你现在的努力，是为了以后有更多的选择权。", author: "" },
  { text: "与其担心未来，不如现在好好努力。这条路上，只有奋斗才能给你安全感。", author: "" },
  { text: "成功不是终点，失败也非末日，最重要的是继续前行的勇气。", author: "丘吉尔" },
  { text: "世界上那些最容易的事情中，拖延时间最不费力。", author: "" },
  { text: "当你在犹豫要不要去做的时候，其实你内心已经有了选择，只是你还没有充足的理由去说服自己。", author: "" },
  { text: "你的时间有限，不要浪费在过别人的生活上。", author: "乔布斯" },
  { text: "任何值得做的事，做得差也值得做。", author: "" },
  { text: "每一次低谷，都是蓄力向上的起点。", author: "" },
  { text: "平淡是生活的底色，认真过好每一天，本身就是一种了不起。", author: "" },
  { text: "把每一个黎明看作生命的开始，把每一个黄昏看作生命的小结。", author: "罗斯金" },
  { text: "一个人至少拥有一个梦想，有一个理由去坚强。", author: "三毛" },
  { text: "你必须十分努力，才能看起来毫不费力。", author: "" },
  { text: "全力以赴的日子，回头看来都是闪闪发光的回忆。", author: "" },
  { text: "考研这条路，孤独是常态，但你的孤独终将闪耀。", author: "" },
  { text: "平凡不等于平庸，在平凡中坚持成长，就是最好的不平凡。", author: "" },
  { text: "当你穿过了暴风雨，你就不再是原来那个人了。", author: "村上春树" },
  { text: "努力的最大意义，是让自己随时有能力跳出自己厌恶的圈子。", author: "" },
  { text: "那些打不倒你的，终将使你更强大。", author: "尼采" },
  { text: "既然选择了远方，便只顾风雨兼程。", author: "汪国真" },
  { text: "每一个优秀的人，都有一段沉默的时光。那段时光，是付出了很多努力却得不到结果的日子，我们把它叫做扎根。", author: "" },
  { text: "这个世界上根本没有正确的选择，我们只不过是要努力奋斗，使当初的选择变得正确。", author: "村上春树" },
  { text: "凡是过往，皆为序章。", author: "莎士比亚" },
  { text: "起点不决定终点，每一步都在书写属于你的精彩。", author: "" },
  { text: "学习如春起之苗，不见其增，日有所长。", author: "陶渊明" },
  { text: "永远不要用你的现在去判断你的未来。", author: "" },
  { text: "所有的坚持，都会在未来的某一天，给你一个惊喜。", author: "" },
  { text: "你走过的每一段路，付出的每一份努力，终将汇聚成照亮前行的光。", author: "泰戈尔" },
  { text: "做对的事情比把事情做对更重要。", author: "彼得·德鲁克" },
  { text: "每一个不曾起舞的日子，都是对生命的辜负。", author: "尼采" },
  { text: "人生没有白走的路，每一步都算数。", author: "李宗盛" },
  { text: "只要你还愿意为自己努力，世界就会给你惊喜。", author: "" },
  { text: "决定你命运的不是机会，而是你的选择。", author: "" },
  { text: "唯有热爱可抵岁月漫长。", author: "" },
  { text: "把担心变成行动，每走一步就多一分底气。", author: "" },
  { text: "熬过无人问津的日子，才有诗和远方。", author: "" },
  { text: "星光不问赶路人，时光不负有心人。", author: "" },
];

// 节日金句（优先级高于日常金句）
var festivalQuotes = {
  // 春节
  "spring_festival": [
    { text: "爆竹声中一岁除，春风送暖入屠苏。新的一年，愿你所求皆如愿，所行皆坦途。", author: "王安石" },
    { text: "新年伊始，万象更新。从今天起，做一个不动声色却心有猛虎的人。", author: "" },
    { text: "愿新的一年，你的每一份努力都不被辜负，每一份坚持都开花结果。", author: "" },
  ],
  // 元宵节
  "lantern": [
    { text: "火树银花合，星桥铁锁开。愿你的前路，如元宵灯火般明亮温暖。", author: "苏味道" },
    { text: "月圆人圆，灯火可亲。今夜过后，收拾心情，继续赶路。", author: "" },
  ],
  // 清明节
  "qingming": [
    { text: "清明时节，慎终追远。记住来路，才能走好前路。", author: "" },
    { text: "万物生长此时，皆清洁而明净。愿你的心也如春日般清明坚定。", author: "" },
  ],
  // 端午节
  "duanwu": [
    { text: "路漫漫其修远兮，吾将上下而求索。端午安康，愿你的坚持终有所获。", author: "屈原" },
    { text: "千载意未歇，一粽寄深情。今日端午，愿你既有远方的理想，也有脚下的力量。", author: "" },
  ],
  // 七夕
  "qixi": [
    { text: "金风玉露一相逢，便胜却人间无数。愿你所爱之人，也正深爱着你。", author: "秦观" },
    { text: "最好的爱情，是两个人一起变优秀。今天，也不忘为自己努力。", author: "" },
  ],
  // 中秋节
  "mid_autumn": [
    { text: "但愿人长久，千里共婵娟。今夜月明，愿你与所念之人皆安好。", author: "苏轼" },
    { text: "花好月圆人团圆，愿你的每一份期盼都有回应。", author: "" },
  ],
  // 重阳节
  "chongyang": [
    { text: "独在异乡为异客，每逢佳节倍思亲。远方的你，别忘了给家人一个问候。", author: "王维" },
    { text: "九九重阳，久久长长。登高望远，愿你的格局越来越大，路越走越宽。", author: "" },
  ],
  // 国庆节
  "national_day": [
    { text: "生逢盛世，何其有幸。愿与祖国同频共振，不负韶华。", author: "" },
    { text: "国泰民安，山河无恙。我们最好的时代，就是现在。", author: "" },
  ],
  // 元旦
  "new_year": [
    { text: "一元复始，万象更新。新的一年，愿你的每一步都踏实而坚定。", author: "" },
    { text: "告别旧年最好的方式，不是遗忘，而是带着成长继续前行。", author: "" },
  ],
  // 劳动节
  "labor_day": [
    { text: "劳动最光荣，奋斗最幸福。你的每一滴汗水，都在为未来铺路。", author: "" },
    { text: "今天休息是为了走更远的路。给自己放个假，然后满血出发。", author: "" },
  ],
  // 教师节
  "teacher_day": [
    { text: "师者，所以传道受业解惑也。感恩每一位为我们点亮前路的人。", author: "韩愈" },
    { text: "三人行，必有我师。保持谦逊，处处皆学问。", author: "孔子" },
  ],
};

// 节气金句
var solarTermQuotes = {
  "立春": { text: "立春一日，百草回芽。万物复苏，你也该醒醒了，新的一年从此刻开始。", author: "", emoji: "🌱" },
  "雨水": { text: "好雨知时节，当春乃发生。春雨贵如油，你的努力也是。", author: "杜甫", emoji: "🌧️" },
  "惊蛰": { text: "春雷响，万物长。蛰伏已久的你，是时候破土而出了。", author: "", emoji: "⚡" },
  "春分": { text: "春分者，阴阳相半也。昼夜等长，正适合把时间分一半给梦想。", author: "", emoji: "🌸" },
  "清明": { text: "清明时节，气清景明。心清则目明，看清方向再出发。", author: "", emoji: "🍃" },
  "谷雨": { text: "雨生百谷，万物逢时。播下努力的种子，终会迎来丰收。", author: "", emoji: "🌾" },
  "立夏": { text: "立夏至，万物至此皆长大。愿你的成长，也如夏日般热烈。", author: "", emoji: "☀️" },
  "小满": { text: "小满者，物致于此小得盈满。人生不必求全满，小满即是最好的状态。", author: "", emoji: "🌿" },
  "芒种": { text: "芒种忙忙种，且收且种。有收获也有播种，人生才能持续丰收。", author: "", emoji: "🌻" },
  "夏至": { text: "夏至已至，日长之至。白昼最长的一天，多给自己一点时间去做想做的事。", author: "", emoji: "🌞" },
  "小暑": { text: "小暑过，一日热三分。越是煎熬的时候，越要沉得住气。", author: "", emoji: "🔥" },
  "大暑": { text: "大暑乃炎热之极也。扛过最热的日子，后面就是秋凉。", author: "", emoji: "🌡️" },
  "立秋": { text: "立秋至，凉风至。熬过酷暑的你，值得一个清爽的开始。", author: "", emoji: "🍂" },
  "处暑": { text: "处暑，止也，暑气至此而止矣。炎热终会过去，坚持就是胜利。", author: "", emoji: "🎐" },
  "白露": { text: "白露秋分夜，一夜凉一夜。天渐凉，心要暖，步子要稳。", author: "", emoji: "💧" },
  "秋分": { text: "秋分者，昼夜等分。公平地对待每一天，生活也会公平地回馈你。", author: "", emoji: "🍁" },
  "寒露": { text: "寒露时节，秋意渐浓。天冷了，别懈怠，给梦想多添一件衣裳。", author: "", emoji: "❄️" },
  "霜降": { text: "霜降，气肃而凝露为霜。经得起霜打的柿子才最甜，扛得住压力的人才能走得最远。", author: "", emoji: "🧊" },
  "立冬": { text: "立冬了，万物收藏。藏锋蓄势，不是退缩，是为了更好的出发。", author: "", emoji: "🏔️" },
  "小雪": { text: "小雪至，天渐寒。越是寒冷，越要保持内心的温度。", author: "", emoji: "🌨️" },
  "大雪": { text: "大雪纷飞，万物归藏。安静下来，沉淀自己，厚积薄发。", author: "", emoji: "❄️" },
  "冬至": { text: "冬至一阳生，天虽至寒，阳气已动。最暗的夜过后，光明终会到来。", author: "", emoji: "🥟" },
  "小寒": { text: "小寒大寒，冷成冰团。扛过三九天，便是春暖花开。", author: "", emoji: "🧣" },
  "大寒": { text: "大寒已到，春天不远了。坚持住，温暖正在路上。", author: "", emoji: "🏠" },
};

// 节日/节气检测（支持2025-2027年）
function getFestivalKey(month, day) {
  // 固定日期节日
  if (month === 1 && day === 1) return "new_year";
  if (month === 5 && day === 1) return "labor_day";
  if (month === 9 && day === 10) return "teacher_day";
  if (month === 10 && day >= 1 && day <= 7) return "national_day";
  
  // 农历节日（2025-2027近似公历日期）
  // 春节
  if (month === 1 && day === 29) return "spring_festival"; // 2025
  if (month === 2 && day === 17) return "spring_festival"; // 2026
  if (month === 2 && day === 6) return "spring_festival";  // 2027
  // 元宵（春节+15天）
  if (month === 2 && day === 12) return "lantern"; // 2025
  if (month === 3 && day === 3) return "lantern";  // 2026
  if (month === 2 && day === 20) return "lantern"; // 2027
  // 清明
  if (month === 4 && (day === 4 || day === 5)) return "qingming";
  // 端午
  if (month === 5 && day === 31) return "duanwu";  // 2025
  if (month === 6 && day === 19) return "duanwu";  // 2026
  if (month === 6 && day === 9) return "duanwu";   // 2027
  // 七夕
  if (month === 8 && day === 29) return "qixi";    // 2025
  if (month === 8 && day === 19) return "qixi";    // 2026
  if (month === 8 && day === 8) return "qixi";     // 2027
  // 中秋
  if (month === 10 && day === 6) return "mid_autumn";  // 2025
  if (month === 9 && day === 25) return "mid_autumn";  // 2026
  if (month === 9 && day === 15) return "mid_autumn";  // 2027
  // 重阳
  if (month === 10 && day === 29) return "chongyang";  // 2025
  if (month === 10 && day === 18) return "chongyang";  // 2026
  if (month === 10 && day === 8) return "chongyang";   // 2027
  
  return null;
}

// 节气检测（近似日期，每年可能±1天）
function getSolarTerm(month, day) {
  var terms = {
    1: [{d:5,t:"小寒"},{d:20,t:"大寒"}],
    2: [{d:4,t:"立春"},{d:19,t:"雨水"}],
    3: [{d:6,t:"惊蛰"},{d:21,t:"春分"}],
    4: [{d:5,t:"清明"},{d:20,t:"谷雨"}],
    5: [{d:6,t:"立夏"},{d:21,t:"小满"}],
    6: [{d:6,t:"芒种"},{d:21,t:"夏至"}],
    7: [{d:7,t:"小暑"},{d:23,t:"大暑"}],
    8: [{d:7,t:"立秋"},{d:23,t:"处暑"}],
    9: [{d:8,t:"白露"},{d:23,t:"秋分"}],
    10:[{d:8,t:"寒露"},{d:23,t:"霜降"}],
    11:[{d:7,t:"立冬"},{d:22,t:"小雪"}],
    12:[{d:7,t:"大雪"},{d:22,t:"冬至"}],
  };
  var monthTerms = terms[month];
  if (!monthTerms) return null;
  for (var i = 0; i < monthTerms.length; i++) {
    if (Math.abs(day - monthTerms[i].d) <= 1) return monthTerms[i].t;
  }
  return null;
}

function getQuoteIndex() {
  return Math.floor(Math.random() * dailyQuotes.length);
}

function shouldShowDailyQuote() {
  var today = new Date().toISOString().slice(0, 10);
  return localStorage.getItem('liankao_quote_date') !== today;
}

function markQuoteShown() {
  var today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('liankao_quote_date', today);
}

function formatDateCN() {
  var d = new Date();
  var months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  return months[d.getMonth()] + '·' + d.getDate() + '日';
}

// 获取今天应显示的金句（节日 > 节气 > 日常）
function getTodayQuote() {
  var now = new Date();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  
  // 1. 检查节日
  var fKey = getFestivalKey(month, day);
  if (fKey && festivalQuotes[fKey]) {
    var fq = festivalQuotes[fKey];
    var idx = Math.floor(Math.random() * fq.length);
    var q = fq[idx];
    q.source = "festival";
    return q;
  }
  
  // 2. 检查节气
  var term = getSolarTerm(month, day);
  if (term && solarTermQuotes[term]) {
    var sq = solarTermQuotes[term];
    sq.source = "solar_term";
    return sq;
  }
  
  // 3. 日常金句
  var dq = dailyQuotes[getQuoteIndex()];
  dq.source = "daily";
  return dq;
}

// 获取副标题
function getSubtitle(source) {
  if (source === "festival") return "今日佳节，与你共勉";
  if (source === "solar_term") return "节气寄语，顺应天时";
  return "每天一句，陪你前行";
}

function getAvatarIndex() {
  var today = new Date();
  var seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % 7;
}

function showDailyQuote() {
  if (!shouldShowDailyQuote()) return;
  var q = getTodayQuote();
  window._currentQuoteText = q.text;
  var overlay = document.createElement('div');
  overlay.className = 'daily-quote-overlay';
  overlay.id = 'dailyQuoteOverlay';
  overlay.onclick = function(e) { if (e.target === overlay) closeDailyQuote(); };
  overlay.innerHTML = 
    '<div class="daily-quote-card">' +
      '<div class="daily-quote-top-btns">' +
        '<button class="daily-quote-close" onclick="closeDailyQuote()" aria-label="关闭">\u2715</button>' +
        '<button class="daily-quote-like" id="dailyQuoteLike" onclick="likeDailyQuote()" aria-label="点赞">\u2661</button>' +
      '</div>' +
      '<div class="daily-quote-deco"></div>' +
      '<div class="daily-quote-identity">' +
        '<img class="daily-quote-avatar-img" src="/img/stone-avatars/stone_' + getAvatarIndex() + '.png" alt="石头Stone">' +
        '<span class="daily-quote-name">我是果芽Ai运营，石头Stone</span>' +
      '</div>' +
      '<div class="daily-quote-text">' + q.text + '</div>' +
      (q.author ? '<div class="daily-quote-author">—— ' + q.author + '</div>' : '') +
      '<div class="daily-quote-footer">' +
        '<span class="daily-quote-date">' + formatDateCN() + '</span>' +
        '<span class="daily-quote-hint">' + getSubtitle(q.source) + '</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(function() { overlay.classList.add('active'); });
  markQuoteShown();
}

function closeDailyQuote() {
  var overlay = document.getElementById('dailyQuoteOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(function() { overlay.remove(); document.body.style.overflow = ''; }, 300);
  }
}

function likeDailyQuote() {
  var btn = document.getElementById('dailyQuoteLike');
  if (!btn || btn.classList.contains('liked')) return;
  btn.classList.add('liked');
  btn.innerHTML = '\u2665';
  var likes = JSON.parse(localStorage.getItem('liankao_quote_likes') || '{}');
  var key = window._currentQuoteText || '';
  if (key) {
    likes[key] = (likes[key] || 0) + 1;
    localStorage.setItem('liankao_quote_likes', JSON.stringify(likes));
  }
  setTimeout(closeDailyQuote, 1200);
}

document.addEventListener('DOMContentLoaded', function() { setTimeout(showDailyQuote, 1500); });
