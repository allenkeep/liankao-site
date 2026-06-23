// 每日金句数据
const dailyQuotes = [
  { text: "种一棵树最好的时间是十年前，其次是现在。", author: "丹比萨·莫约" },
  { text: "你不需要很厉害才能开始，但你需要开始才能很厉害。", author: "齐格·齐格勒" },
  { text: "所有的努力，不是为了让别人觉得你了不起，而是为了能让自己打心里看得起自己。", author: "" },
  { text: "当你觉得为时已晚的时候，恰恰是最早的时候。", author: "" },
  { text: "不要用战术上的勤奋掩盖战略上的懒惰。", author: "雷军" },
  { text: "人生的路，靠自己一步步走去，真正能保护你的，是你自己的人格选择和文化选择。", author: "余秋雨" },
  { text: "你现在的努力，是为了以后有更多的选择权。", author: "" },
  { text: "与其担心未来，不如现在好好努力。这条路上，只有奋斗才能给你安全感。", author: "" },
  { text: "成功不是终点，失败也非末日，最重要的是继续前行的勇气。", author: "丘吉尔" },
  { text: "世界上那些最容易的事情中，拖延时间最不费力。", author: "" },
  { text: "当你在犹豫要不要去做的时候，其实你内心已经有了选择，只是你还没有充足的理由去说服自己。", author: "" },
  { text: "你的时间有限，不要浪费在过别人的生活上。", author: "乔布斯" },
  { text: "任何值得做的事，做得差也值得做。", author: "" },
  { text: "所谓万丈深渊，下去也是前程万里。", author: "木心" },
  { text: "没有人因水的平淡而厌倦饮水，也没有人因生活的平淡而摒弃生活。", author: "" },
  { text: "勤奋可以弥补聪明的不足，但聪明无法弥补懒惰的缺陷。", author: "" },
  { text: "把每一个黎明看作生命的开始，把每一个黄昏看作生命的小结。", author: "罗斯金" },
  { text: "一个人至少拥有一个梦想，有一个理由去坚强。", author: "三毛" },
  { text: "你必须十分努力，才能看起来毫不费力。", author: "" },
  { text: "不苦不累，人生无味；不拼不搏，等于白活。", author: "" },
  { text: "考研这条路，孤独是常态，但你的孤独终将闪耀。", author: "" },
  { text: "比你优秀的人还在努力，你有什么资格说放弃。", author: "" },
  { text: "最怕你一生碌碌无为，还安慰自己平凡可贵。", author: "" },
  { text: "当你穿过了暴风雨，你就不再是原来那个人了。", author: "村上春树" },
  { text: "努力的最大意义，是让自己随时有能力跳出自己厌恶的圈子。", author: "" },
  { text: "那些打不倒你的，终将使你更强大。", author: "尼采" },
  { text: "既然选择了远方，便只顾风雨兼程。", author: "汪国真" },
  { text: "今天多一份拼搏，明天多几份欢笑。", author: "" },
  { text: "你的坚持，终将美好。", author: "" },
  { text: "每一个优秀的人，都有一段沉默的时光。那段时光，是付出了很多努力却得不到结果的日子，我们把它叫做扎根。", author: "" },
  { text: "世间一切伟大的壮举都是默默完成的，世间一切智者总是深谋远虑的。", author: "茨威格" },
  { text: "这个世界上根本没有正确的选择，我们只不过是要努力奋斗，使当初的选择变得正确。", author: "村上春树" },
  { text: "凡是过往，皆为序章。", author: "莎士比亚" },
  { text: "不怕千人万人阻挡，只怕自己投降。", author: "" },
  { text: "命运给你一个低起点，是想看你精彩的翻盘。", author: "" },
  { text: "学习如春起之苗，不见其增，日有所长。", author: "陶渊明" },
  { text: "永远不要用你的现在去判断你的未来。", author: "" },
  { text: "所有的坚持，都会在未来的某一天，给你一个惊喜。", author: "" },
  { text: "你受的苦，吃过的亏，担的责，扛的罪，忍的痛，到最后都会变成光，照亮你的路。", author: "泰戈尔" },
  { text: "做对的事情比把事情做对更重要。", author: "彼得·德鲁克" },
  { text: "成年人的世界，没有容易二字，但也没有过不去的坎。", author: "" },
  { text: "梦想不会逃跑，会逃跑的永远是自己。", author: "" },
  { text: "每一个不曾起舞的日子，都是对生命的辜负。", author: "尼采" },
  { text: "人生没有白走的路，每一步都算数。", author: "李宗盛" },
  { text: "只要你还愿意为自己努力，世界就会给你惊喜。", author: "" },
  { text: "决定你命运的不是机会，而是你的选择。", author: "" },
  { text: "唯有热爱可抵岁月漫长。", author: "" },
  { text: "把焦虑变成行动，是最好的解药。", author: "" },
  { text: "熬过无人问津的日子，才有诗和远方。", author: "" },
  { text: "星光不问赶路人，时光不负有心人。", author: "" },
];

function getQuoteIndex() {
  var today = new Date();
  var seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % dailyQuotes.length;
}

function shouldShowDailyQuote() {
  var today = new Date().toISOString().slice(0, 10);
  return localStorage.getItem('liankao_quote_date') !== today;
}

function markQuoteShown() {
  localStorage.setItem('liankao_quote_date', new Date().toISOString().slice(0, 10));
}

function formatDateCN() {
  var d = new Date();
  var months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  return months[d.getMonth()] + '·' + d.getDate() + '日';
}

function showDailyQuote() {
  if (!shouldShowDailyQuote()) return;
  var q = dailyQuotes[getQuoteIndex()];
  
  var overlay = document.createElement('div');
  overlay.className = 'daily-quote-overlay';
  overlay.id = 'dailyQuoteOverlay';
  overlay.onclick = function(e) { if (e.target === overlay) closeDailyQuote(); };
  overlay.innerHTML = 
    '<div class="daily-quote-card">' +
      '<button class="daily-quote-close" onclick="closeDailyQuote()" aria-label="关闭">✕</button>' +
      '<div class="daily-quote-deco"></div>' +
      '<div class="daily-quote-icon">🪨</div>' +
      '<div class="daily-quote-text">' + q.text + '</div>' +
      (q.author ? '<div class="daily-quote-author">—— ' + q.author + '</div>' : '') +
      '<div class="daily-quote-footer">' +
        '<span class="daily-quote-date">' + formatDateCN() + '</span>' +
        '<span class="daily-quote-hint">每天一句，陪你前行</span>' +
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

document.addEventListener('DOMContentLoaded', function() { setTimeout(showDailyQuote, 1500); });
