// ==================== 全局状态 ====================
const state = {
  formData: {
    education: null,      // 学历
    schoolType: null,     // 毕业院校类型
    workYears: null,      // 工作年限
    majors: [],           // 目标专业
    region: null,         // 目标地区
    budget: null,         // 预算范围
    score: null,          // 模考分数
    english: null,        // 英语水平
    studyMode: null       // 学习方式
  },
  schoolData: {},         // 院校数据
  conversationStep: 0,    // 对话阶段
  selectedTags: {
    majors: [],
    region: [],
    budget: []
  },
  results: null           // 缓存的推荐结果
};

// ==================== 加载院校数据 ====================
async function loadSchoolData() {
  try {
    const majors = ['mba', 'emba', 'mem', 'mpa'];
    const majorMap = { mba: 'MBA', emba: 'EMBA', mem: 'MEM', mpa: 'MPA' };
    
    for (const major of majors) {
      try {
        const resp = await fetch(`data/${major}.json`);
        const data = await resp.json();
        state.schoolData[majorMap[major]] = data;
      } catch (e) {
        console.log(`加载${major}数据失败，跳过`);
      }
    }
    return true;
  } catch (e) {
    console.error('数据加载失败:', e);
    return false;
  }
}

// ==================== 消息发送 ====================
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  
  if (!text) return;
  
  addUserMessage(text);
  input.value = '';
  
  // 滚动到底部
  scrollToBottom();
  
  // 显示AI正在输入
  showTyping();
  
  // 处理用户输入
  setTimeout(() => {
    hideTyping();
    processUserInput(text);
  }, 800 + Math.random() * 800);
}

function askQuestion(question) {
  addUserMessage(question);
  scrollToBottom();
  
  showTyping();
  
  setTimeout(() => {
    hideTyping();
    processUserInput(question);
  }, 800 + Math.random() * 800);
}

// ==================== 添加消息 ====================
function addUserMessage(text) {
  const chatContainer = document.getElementById('chatContainer');
  const messagesEnd = document.getElementById('messagesEnd');
  
  const msgGroup = document.createElement('div');
  msgGroup.className = 'message-group user-message';
  msgGroup.innerHTML = `
    <div class="message-avatar">
      <div class="avatar-inner">😊</div>
    </div>
    <div class="message-bubble">
      <p>${escapeHtml(text)}</p>
    </div>
  `;
  
  chatContainer.insertBefore(msgGroup, messagesEnd);
}

function addAiMessage(html, isHtml = false) {
  const chatContainer = document.getElementById('chatContainer');
  const messagesEnd = document.getElementById('messagesEnd');
  
  const msgGroup = document.createElement('div');
  msgGroup.className = 'message-group ai-message';
  
  if (isHtml) {
    msgGroup.innerHTML = `
      <div class="message-avatar">
        <div class="avatar-inner">🎓</div>
      </div>
      <div class="message-bubble">${html}</div>
    `;
  } else {
    msgGroup.innerHTML = `
      <div class="message-avatar">
        <div class="avatar-inner">🎓</div>
      </div>
      <div class="message-bubble"><p>${escapeHtml(html)}</p></div>
    `;
  }
  
  chatContainer.insertBefore(msgGroup, messagesEnd);
  scrollToBottom();
  
  return msgGroup;
}

// ==================== 输入状态 ====================
function showTyping() {
  const chatContainer = document.getElementById('chatContainer');
  const messagesEnd = document.getElementById('messagesEnd');
  
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typingIndicator';
  typingDiv.className = 'message-group ai-message';
  typingDiv.innerHTML = `
    <div class="message-avatar">
      <div class="avatar-inner">🎓</div>
    </div>
    <div class="message-bubble">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  
  chatContainer.insertBefore(typingDiv, messagesEnd);
  scrollToBottom();
}

function hideTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) {
    typing.remove();
  }
}

function scrollToBottom() {
  const container = document.getElementById('chatContainer');
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);
}

// ==================== 输入解析 ====================
function processUserInput(text) {
  const lowerText = text.toLowerCase();
  
  // 解析学历
  if (lowerText.includes('本科') || lowerText.includes('学士')) {
    state.formData.education = 'bachelor';
  } else if (lowerText.includes('专科') || lowerText.includes('大专')) {
    state.formData.education = 'college';
  } else if (lowerText.includes('硕士') || lowerText.includes('博士') || lowerText.includes('研究生')) {
    state.formData.education = 'master';
  }
  
  // 解析学校类型
  if (lowerText.includes('985')) {
    state.formData.schoolType = '985';
  } else if (lowerText.includes('211')) {
    state.formData.schoolType = '211';
  } else if (lowerText.includes('双一流')) {
    state.formData.schoolType = 'double_first';
  } else if (lowerText.includes('普通') || lowerText.includes('二本') || lowerText.includes('三本')) {
    state.formData.schoolType = 'ordinary';
  }
  
  // 解析工作年限
  const workYearMatch = text.match(/(\d+)\s*年.*?(工作|经验|毕业)/);
  if (workYearMatch) {
    const years = parseInt(workYearMatch[1]);
    if (years <= 3) state.formData.workYears = '1-3';
    else if (years <= 5) state.formData.workYears = '3-5';
    else if (years <= 8) state.formData.workYears = '5-8';
    else state.formData.workYears = '8+';
  }
  
  // 解析专业
  const majorMap = {
    'mba': 'MBA',
    '工商管理': 'MBA',
    'emba': 'EMBA',
    '高级工商管理': 'EMBA',
    'mem': 'MEM',
    '工程管理': 'MEM',
    'mpa': 'MPA',
    '公共管理': 'MPA'
  };
  
  for (const [key, value] of Object.entries(majorMap)) {
    if (lowerText.includes(key.toLowerCase())) {
      if (!state.formData.majors.includes(value)) {
        state.formData.majors.push(value);
      }
    }
  }
  
  // 解析地区
  const regionMap = {
    '北京': 'beijing',
    '上海': 'shanghai',
    '广州': 'guangdong',
    '深圳': 'guangdong',
    '广东': 'guangdong',
    '南京': 'jiangsu',
    '苏州': 'jiangsu',
    '江苏': 'jiangsu',
    '杭州': 'zhejiang',
    '浙江': 'zhejiang',
    '宁波': 'zhejiang'
  };
  
  for (const [city, region] of Object.entries(regionMap)) {
    if (lowerText.includes(city.toLowerCase())) {
      state.formData.region = region;
      break;
    }
  }
  
  // 解析预算
  const budgetMatch = text.match(/(\d+)\s*万/);
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1]);
    if (budget <= 10) state.formData.budget = '0-10';
    else if (budget <= 20) state.formData.budget = '10-20';
    else if (budget <= 40) state.formData.budget = '20-40';
    else state.formData.budget = '40+';
  }
  
  // 解析分数
  const scoreMatch = text.match(/(\d+)\s*分/);
  if (scoreMatch) {
    const score = parseInt(scoreMatch[1]);
    if (score < 120) state.formData.score = '120以下';
    else if (score < 160) state.formData.score = '120-160';
    else if (score < 200) state.formData.score = '160-200';
    else state.formData.score = '200+';
  }
  
  // 解析英语水平
  if (lowerText.includes('英语不好') || lowerText.includes('英语差') || lowerText.includes('基础差')) {
    state.formData.english = 'poor';
  } else if (lowerText.includes('四级') || lowerText.includes('cet4')) {
    state.formData.english = 'cet4';
  } else if (lowerText.includes('六级') || lowerText.includes('cet6')) {
    state.formData.english = 'cet6';
  } else if (lowerText.includes('英语好') || lowerText.includes('英语不错')) {
    state.formData.english = 'good';
  }
  
  // 判断是否有足够信息生成推荐
  const hasEnoughInfo = checkEnoughInfo();
  
  if (hasEnoughInfo) {
    // 可以生成推荐了
    generateAndShowResults();
  } else {
    // 继续追问
    askNextQuestion();
  }
}

function checkEnoughInfo() {
  const data = state.formData;
  // 至少需要：专业 + 地区 + 学历 + 工作年限 + 预算 中的3项
  let count = 0;
  if (data.majors.length > 0) count++;
  if (data.region) count++;
  if (data.education) count++;
  if (data.workYears) count++;
  if (data.budget) count++;
  
  return count >= 3;
}

// ==================== 智能追问 ====================
function askNextQuestion() {
  const data = state.formData;
  let question = '';
  let options = [];
  
  if (data.majors.length === 0) {
    question = '你想考哪个专业呢？我可以帮你对比不同专业的含金量和难度～';
    options = [
      { label: 'MBA', value: 'MBA' },
      { label: 'EMBA', value: 'EMBA' },
      { label: 'MEM', value: 'MEM' },
      { label: 'MPA', value: 'MPA' }
    ];
    addQuickOptionMessage(question, options, 'major');
    return;
  }
  
  if (!data.region) {
    question = '目标地区是哪里呢？不同地区的院校资源差异挺大的～';
    options = [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广东', value: 'guangdong' },
      { label: '江浙', value: 'jiangsu' },
      { label: '其他地区', value: 'other' }
    ];
    addQuickOptionMessage(question, options, 'region');
    return;
  }
  
  if (!data.education) {
    question = '你的最高学历是？不同学历的报考要求和录取偏好不一样哦～';
    options = [
      { label: '专科', value: 'college' },
      { label: '本科', value: 'bachelor' },
      { label: '硕士/博士', value: 'master' }
    ];
    addQuickOptionMessage(question, options, 'education');
    return;
  }
  
  if (!data.workYears) {
    question = '工作几年啦？工作经验是MBA录取的重要参考因素～';
    options = [
      { label: '1-3年', value: '1-3' },
      { label: '3-5年', value: '3-5' },
      { label: '5-8年', value: '5-8' },
      { label: '8年以上', value: '8+' }
    ];
    addQuickOptionMessage(question, options, 'workYears');
    return;
  }
  
  if (!data.budget) {
    question = '学费预算大概是多少呢？不同院校差价还挺大的～';
    options = [
      { label: '10万以内', value: '0-10' },
      { label: '10-20万', value: '10-20' },
      { label: '20-40万', value: '20-40' },
      { label: '40万以上', value: '40+' }
    ];
    addQuickOptionMessage(question, options, 'budget');
    return;
  }
  
  // 如果都有了，直接生成
  generateAndShowResults();
}

function addQuickOptionMessage(question, options, field) {
  const chatContainer = document.getElementById('chatContainer');
  const messagesEnd = document.getElementById('messagesEnd');
  
  const msgGroup = document.createElement('div');
  msgGroup.className = 'message-group ai-message';
  msgGroup.innerHTML = `
    <div class="message-avatar">
      <div class="avatar-inner">🎓</div>
    </div>
    <div class="message-bubble">
      <p>${question}</p>
      <div class="quick-options">
        ${options.map(opt => `
          <button class="quick-option" onclick="selectQuickOption('${field}', '${opt.value}', '${opt.label}')">
            ${opt.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  
  chatContainer.insertBefore(msgGroup, messagesEnd);
  scrollToBottom();
}

function selectQuickOption(field, value, label) {
  // 添加用户选择的消息
  addUserMessage(label);
  
  // 更新状态
  if (field === 'majors' || field === 'major') {
    if (!state.formData.majors.includes(value)) {
      state.formData.majors.push(value);
    }
  } else {
    state.formData[field] = value;
  }
  
  // 显示正在输入
  showTyping();
  
  setTimeout(() => {
    hideTyping();
    
    // 检查是否够了
    if (checkEnoughInfo()) {
      generateAndShowResults();
    } else {
      askNextQuestion();
    }
  }, 600);
}

// ==================== 生成推荐结果 ====================
async function generateAndShowResults() {
  // 确保数据已加载
  if (Object.keys(state.schoolData).length === 0) {
    await loadSchoolData();
  }
  
  // 计算推荐（只基于用户实际输入的信息）
  const results = calculateRecommendations();
  state.results = results;
  
  // 显示结果
  showResults(results);
}

// ==================== 推荐算法 ====================
function calculateRecommendations() {
  const data = state.formData;
  
  // ===== 用户实际输入了哪些维度 =====
  const hasMajor = data.majors && data.majors.length > 0;
  const hasRegion = !!data.region && data.region !== 'other';
  const hasBudget = !!data.budget;
  const hasStudyMode = !!data.studyMode;
  
  // 背景相关：学历/学校类型/工作年限，有任意一个就算有背景信息
  const hasBgInfo = !!(data.education || data.schoolType || data.workYears);
  const hasScoreInfo = !!data.score;
  const hasEnglishInfo = !!data.english;
  
  // ===== 1. 硬过滤：专业 =====
  const majors = hasMajor ? data.majors : ['MBA'];
  
  // ===== 2. 硬过滤：地区 =====
  const regionMap = {
    beijing: ['北京'],
    shanghai: ['上海'],
    guangdong: ['广州', '深圳', '广东'],
    jiangsu: ['南京', '江苏', '苏州'],
    zhejiang: ['杭州', '浙江', '宁波']
  };
  const targetRegions = hasRegion ? regionMap[data.region] : null;
  
  // ===== 3. 硬过滤：预算 =====
  let budgetMax = null;
  if (hasBudget) {
    if (data.budget === '0-10') budgetMax = 10;
    else if (data.budget === '10-20') budgetMax = 20;
    else if (data.budget === '20-40') budgetMax = 40;
    else if (data.budget === '40+') budgetMax = null; // 40+表示不设上限
  }
  
  // ===== 4. 背景评分（只算有输入的维度） =====
  let bgScore = 0;
  let bgWeight = 0;
  
  if (data.education) {
    const eduScores = { master: 90, bachelor: 65, college: 35 };
    bgScore += (eduScores[data.education] || 50) * 0.4;
    bgWeight += 0.4;
  }
  if (data.schoolType) {
    const schoolScores = { '985': 95, '211': 78, 'double_first': 72, ordinary': 45 };
    bgScore += (schoolScores[data.schoolType] || 50) * 0.35;
    bgWeight += 0.35;
  }
  if (data.workYears) {
    const workScores = { '8+': 88, '5-8': 72, '3-5': 55, '1-3': 35 };
    bgScore += (workScores[data.workYears] || 50) * 0.25;
    bgWeight += 0.25;
  }
  if (bgWeight > 0) {
    bgScore = bgScore / bgWeight;
  }
  
  // ===== 5. 分数评分 =====
  let scoreScore = null;
  if (hasScoreInfo) {
    const scoreMap = { '120以下': 15, '120-160': 40, '160-200': 68, '200+': 88 };
    scoreScore = scoreMap[data.score] || 45;
    
    if (hasEnglishInfo) {
      const engBonus = { good: 8, cet6: 5, cet4: 2, poor: -3 };
      scoreScore += (engBonus[data.english] || 0);
      scoreScore = Math.max(0, Math.min(100, scoreScore));
    }
  }
  
  // ===== 6. 筛选并计算匹配度 =====
  let allSchools = [];
  
  majors.forEach(major => {
    const schools = state.schoolData[major] || [];
    schools.forEach(school => {
      // --- 硬过滤：地区 ---
      if (targetRegions) {
        const schoolRegion = school.region || '';
        const regionMatched = targetRegions.some(r => schoolRegion.includes(r));
        if (!regionMatched) return;
      }
      
      // --- 硬过滤：预算 ---
      if (budgetMax !== null && school.tuition_total && school.tuition_total > budgetMax) {
        return;
      }
      
      // --- 硬过滤：学习方式 ---
      if (hasStudyMode && data.studyMode !== 'both') {
        const schoolMode = school.study_mode || '';
        if (data.studyMode === 'fulltime' && schoolMode !== '全日制') return;
        if (data.studyMode === 'parttime' && schoolMode === '全日制') return;
      }
      
      // --- 计算各维度匹配度（只有用户输入了的维度才算） ---
      let bgMatch = null;
      let scoreMatch = null;
      let budgetMatch = null;
      
      // 背景匹配
      if (hasBgInfo && bgWeight > 0) {
        const diffScore = (school.difficulty_level || 3) * 18;
        const bgGap = Math.abs(bgScore - diffScore);
        bgMatch = 100 - bgGap * 1.2;
        if (bgScore < diffScore - 15) bgMatch -= 10;
        if (bgScore > diffScore + 10) bgMatch -= 5;
        bgMatch = Math.max(0, Math.min(100, Math.round(bgMatch)));
      }
      
      // 分数匹配
      if (hasScoreInfo && scoreScore !== null) {
        const avgScore = school.score_2025 || school.score_2024 || 160;
        const userScoreEstimate = scoreScore * 2.5;
        const scoreGap = Math.abs(userScoreEstimate - avgScore);
        scoreMatch = 100 - scoreGap * 0.6;
        if (userScoreEstimate < avgScore - 10) scoreMatch -= 8;
        scoreMatch = Math.max(0, Math.min(100, Math.round(scoreMatch)));
      }
      
      // 预算匹配（用户有预算要求才算）
      if (hasBudget && budgetMax !== null) {
        const tuition = school.tuition_total || 0;
        if (tuition > 0 && tuition <= budgetMax) {
          budgetMatch = 100;
        } else if (tuition > 0) {
          budgetMatch = 0;
        } else {
          budgetMatch = null;
        }
      }
      
      // --- 综合匹配度：只算有输入的维度 ---
      let matchScore = null;
      let matchTotal = 0;
      let matchCount = 0;
      
      if (bgMatch !== null) {
        matchTotal += bgMatch * 0.6;
        matchCount += 0.6;
      }
      if (scoreMatch !== null) {
        matchTotal += scoreMatch * 0.4;
        matchCount += 0.4;
      }
      
      if (matchCount > 0) {
        matchScore = Math.round(matchTotal / matchCount);
      }
      
      allSchools.push({
        ...school,
        matchScore,
        bgMatch,
        scoreMatch,
        budgetMatch,
        hasBgInfo,
        hasScoreInfo,
        hasBudget
      });
    });
  });
  
  // 去重
  const seen = new Set();
  allSchools = allSchools.filter(s => {
    const key = `${s.name}-${s.major}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  // 排序：有匹配度按匹配度降序，没匹配度按学校层次+学费排序
  if (allSchools.length > 0 && allSchools[0].matchScore !== null) {
    allSchools.sort((a, b) => b.matchScore - a.matchScore);
  } else {
    allSchools.sort((a, b) => {
      const levelScore = (s) => {
        const level = s.school_level || '';
        if (level.includes('985')) return 3;
        if (level.includes('211')) return 2;
        if (level.includes('双一流')) return 1;
        return 0;
      };
      const levelDiff = levelScore(b) - levelScore(a);
      if (levelDiff !== 0) return levelDiff;
      const tuitionA = a.tuition_total || 999;
      const tuitionB = b.tuition_total || 999;
      return tuitionA - tuitionB;
    });
  }
  
  // 分档（只有有匹配度时才分冲刺/稳妥/保底）
  let result = [];
  if (allSchools.length > 0 && allSchools[0].matchScore !== null) {
    const rush = allSchools.filter(s => s.matchScore >= 45 && s.matchScore < 65).slice(0, 2);
    const stable = allSchools.filter(s => s.matchScore >= 65 && s.matchScore < 80).slice(0, 3);
    const safe = allSchools.filter(s => s.matchScore >= 80).slice(0, 2);
    
    result = [
      ...rush.map(s => ({ ...s, tier: '冲刺' })),
      ...stable.map(s => ({ ...s, tier: '稳妥' })),
      ...safe.map(s => ({ ...s, tier: '保底' }))
    ];
    
    if (result.length < 5) {
      const existing = new Set(result.map(s => `${s.name}-${s.major}`));
      const extra = allSchools.filter(s => !existing.has(`${s.name}-${s.major}`)).slice(0, 5 - result.length);
      result = [...result, ...extra.map(s => ({ ...s, tier: '推荐' }))];
    }
  } else {
    // 没有匹配度时，直接返回学校列表，不分档
    result = allSchools.slice(0, 10).map(s => ({ ...s, tier: null }));
  }
  
  return {
    schools: result.slice(0, 8),
    totalCount: allSchools.length,
    hasMatchScore: allSchools.length > 0 && allSchools[0].matchScore !== null,
    hasBgInfo,
    hasScoreInfo,
    hasBudget,
    hasRegion,
    bgScore: hasBgInfo ? Math.round(bgScore) : null,
    scoreScore: scoreScore !== null ? Math.round(scoreScore) : null
  };
}

// ==================== 显示结果 ====================
function showResults(results) {
  const chatContainer = document.getElementById('chatContainer');
  const messagesEnd = document.getElementById('messagesEnd');
  
  // AI开场白
  const introMsg = document.createElement('div');
  introMsg.className = 'message-group ai-message';
  
  const hasMatch = results.hasMatchScore;
  
  // 生成筛选条件描述
  let filterDesc = [];
  if (results.schools.length > 0 && results.schools[0].major) {
    filterDesc.push(results.schools[0].major);
  }
  if (results.hasRegion) {
    filterDesc.push(results.schools[0]?.region || '目标地区');
  }
  if (results.hasBudget) {
    filterDesc.push('预算内');
  }
  
  let introText = '';
  if (hasMatch) {
    introText = `<p>根据你的背景，为你匹配了 ${results.totalCount} 所院校 👇</p>`;
  } else {
    introText = `<p>为你找到 ${results.totalCount} 所${filterDesc.join(' · ')}院校 👇</p>`;
    if (results.totalCount === 0) {
      introText = `<p>没有找到符合条件的院校，试试放宽筛选条件吧～</p>`;
    }
  }
  
  introMsg.innerHTML = `
    <div class="message-avatar">
      <div class="avatar-inner">🎓</div>
    </div>
    <div class="message-bubble">${introText}</div>
  `;
  chatContainer.insertBefore(introMsg, messagesEnd);
  
  // 院校卡片列表
  if (results.schools.length > 0) {
    const cardsMsg = document.createElement('div');
    cardsMsg.className = 'message-group ai-message';
    cardsMsg.style.width = '100%';
    cardsMsg.innerHTML = `
      <div class="message-avatar" style="display:none"></div>
      <div style="flex:1;">
        <div class="school-cards">
          ${results.schools.map(school => createSchoolCardHtml(school, hasMatch)).join('')}
        </div>
      </div>
    `;
    chatContainer.insertBefore(cardsMsg, messagesEnd);
    
    // 底部CTA
    const ctaMsg = document.createElement('div');
    ctaMsg.className = 'message-group ai-message';
    ctaMsg.innerHTML = `
      <div class="message-avatar">
        <div class="avatar-inner">🎓</div>
      </div>
      <div class="message-bubble">
        <p>点击院校卡片可以查看详细信息哦～</p>
        ${!hasMatch ? '<p style="font-size:0.9em;color:#888;">补充你的学历、工作年限等信息，可以帮你做更精准的上岸概率评估～</p>' : ''}
      </div>
    `;
    chatContainer.insertBefore(ctaMsg, messagesEnd);
  }
  
  scrollToBottom();
  
  // 动画：分数条逐个加载（只有有匹配度时才需要）
  if (hasMatch) {
    setTimeout(() => {
      document.querySelectorAll('.rec-score-fill').forEach((bar, i) => {
        setTimeout(() => {
          const width = bar.dataset.width || '60%';
          bar.style.width = width;
        }, i * 100);
      });
    }, 300);
  }
}

function createSchoolCardHtml(school, hasMatch) {
  const tierClass = school.tier === '冲刺' ? 'rush' : 
                    school.tier === '保底' ? 'safe' : 
                    school.tier === '稳妥' ? 'stable' : '';
  
  const tuition = school.tuition_total ? `${school.tuition_total}万` : '待定';
  const score = school.score_2025 || school.score_2024 || '-';
  const features = (school.features || []).slice(0, 3);
  
  return `
    <div class="school-card ${tierClass}" onclick="showSchoolDetail('${encodeURIComponent(JSON.stringify(school))}')">
      ${hasMatch && school.tier ? `<span class="tier-badge ${tierClass}">${school.tier}</span>` : ''}
      <div class="school-card-top">
        <div>
          <div class="school-card-name">${school.short_name || school.name}</div>
          <span class="school-card-major">${school.major}</span>
        </div>
        ${hasMatch && school.matchScore !== null && school.matchScore !== undefined ? `
        <div class="school-card-match">
          <div class="school-card-match-num">${school.matchScore}%</div>
          <div class="school-card-match-label">匹配度</div>
        </div>
        ` : ''}
      </div>
      
      <div class="school-card-meta">
        <div class="school-card-meta-item">
          <span class="school-card-meta-label">学费</span>
          <span class="school-card-meta-value">${tuition}</span>
        </div>
        <div class="school-card-meta-item">
          <span class="school-card-meta-label">2025分</span>
          <span class="school-card-meta-value">${score}</span>
        </div>
        <div class="school-card-meta-item">
          <span class="school-card-meta-label">地区</span>
          <span class="school-card-meta-value">${school.region || '-'}</span>
        </div>
      </div>
      
      ${features.length > 0 ? `
      <div class="school-card-tags">
        ${features.map(f => `<span class="school-card-tag">${f}</span>`).join('')}
      </div>` : ''}
      
      ${hasMatch ? `
      <div class="school-card-reason">
        ${generateMatchReason(school)}
      </div>` : ''}
    </div>
  `;
}

function generateMatchReason(school) {
  const reasons = [];
  
  if (school.matchScore >= 85) {
    reasons.push('背景高度匹配，录取概率大');
  } else if (school.matchScore >= 70) {
    reasons.push('较为匹配，认真备考有把握');
  } else {
    reasons.push('有一定难度，适合冲刺');
  }
  
  if (school.tuition_total && school.tuition_total <= 15) {
    reasons.push('性价比高');
  }
  
  if (school.school_level && school.school_level.includes('985')) {
    reasons.push('985名校');
  } else if (school.school_level && school.school_level.includes('211')) {
    reasons.push('211院校');
  }
  
  return reasons.join(' · ');
}

// ==================== 院校详情 ====================
function showSchoolDetail(schoolData) {
  const school = JSON.parse(decodeURIComponent(schoolData));
  
  const modal = document.getElementById('schoolModal');
  const modalBody = document.getElementById('schoolModalBody');
  
  const tuition = school.tuition_total ? `${school.tuition_total}万` : '待定';
  const duration = school.duration ? `${school.duration}年` : '-';
  const score = school.score_2025 || school.score_2024 || '-';
  const features = school.features || [];
  const highlights = school.highlights || school.description || '';
  
  modalBody.innerHTML = `
    <div class="detail-header">
      <div class="detail-name">${school.short_name || school.name}</div>
      <span class="detail-major">${school.major}</span>
      <div class="detail-score">
        ${school.matchScore !== null && school.matchScore !== undefined ? `
        <span class="detail-score-num">${school.matchScore}%</span>
        <span class="detail-score-label">匹配度</span>
        ` : ''}
      </div>
    </div>
    
    <div class="detail-section">
      <h3 class="detail-section-title">📊 基本信息</h3>
      <div class="detail-info-grid">
        <div class="detail-info-item">
          <div class="detail-info-label">学费</div>
          <div class="detail-info-value">${tuition}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-label">学制</div>
          <div class="detail-info-value">${duration}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-label">2025分数线</div>
          <div class="detail-info-value">${score}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-label">地区</div>
          <div class="detail-info-value">${school.region || '-'}</div>
        </div>
      </div>
    </div>
    
    ${features.length > 0 ? `
    <div class="detail-section">
      <h3 class="detail-section-title">✨ 项目特色</h3>
      <div class="detail-features">
        ${features.map(f => `<span class="detail-feature-tag">${f}</span>`).join('')}
      </div>
    </div>` : ''}
    
    ${highlights ? `
    <div class="detail-section">
      <h3 class="detail-section-title">📝 项目介绍</h3>
      <p class="detail-desc">${highlights}</p>
    </div>` : ''}
    
    ${(() => {
      // 只有用户输入了的维度才显示
      const bars = [];
      if (school.bgMatch !== null && school.bgMatch !== undefined) {
        bars.push(`<div class="rec-score-bar"><span class="rec-score-label">背景匹配</span><div class="rec-score-track"><div class="rec-score-fill" data-width="${school.bgMatch}%"></div></div><span class="rec-score-value">${school.bgMatch}%</span></div>`);
      }
      if (school.scoreMatch !== null && school.scoreMatch !== undefined) {
        bars.push(`<div class="rec-score-bar"><span class="rec-score-label">分数匹配</span><div class="rec-score-track"><div class="rec-score-fill" data-width="${school.scoreMatch}%"></div></div><span class="rec-score-value">${school.scoreMatch}%</span></div>`);
      }
      if (school.budgetMatch !== null && school.budgetMatch !== undefined) {
        bars.push(`<div class="rec-score-bar"><span class="rec-score-label">预算匹配</span><div class="rec-score-track"><div class="rec-score-fill" data-width="${school.budgetMatch}%"></div></div><span class="rec-score-value">${school.budgetMatch}%</span></div>`);
      }
      if (bars.length === 0) return '';
      return `<div class="detail-section"><h3 class="detail-section-title">📈 匹配维度</h3><div class="rec-summary">${bars.join('')}</div></div>`;
    })()}
    
    <div class="detail-cta">
      <button class="detail-cta-btn" onclick="closeSchoolModal()">知道啦</button>
    </div>
  `;
  
  modal.classList.add('active');
  
  // 动画效果
  setTimeout(() => {
    modalBody.querySelectorAll('.rec-score-fill').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.width;
      }, i * 100);
    });
  }, 300);
}

function closeSchoolModal() {
  const modal = document.getElementById('schoolModal');
  modal.classList.remove('active');
}

// 点击遮罩关闭
document.addEventListener('click', (e) => {
  const modal = document.getElementById('schoolModal');
  if (e.target && e.target.classList.contains('modal-overlay')) {
    closeSchoolModal();
  }
});

// ==================== 标签选择 ====================
function toggleTag(element) {
  const tagList = element.parentElement;
  const field = tagList.dataset.field;
  const value = element.dataset.value;
  
  const selected = state.selectedTags[field] || [];
  const index = selected.indexOf(value);
  
  if (index > -1) {
    selected.splice(index, 1);
    element.classList.remove('active');
  } else {
    selected.push(value);
    element.classList.add('active');
  }
  
  state.selectedTags[field] = selected;
  
  // 更新formData
  if (field === 'majors') {
    state.formData.majors = [...selected];
  } else if (field === 'region') {
    state.formData.region = selected.length > 0 ? selected[0] : null;
  } else if (field === 'budget') {
    state.formData.budget = selected.length > 0 ? selected[0] : null;
  }
}

function generateFromTags() {
  const hasMajor = state.selectedTags.majors && state.selectedTags.majors.length > 0;
  const hasRegion = state.selectedTags.region && state.selectedTags.region.length > 0;
  const hasBudget = state.selectedTags.budget && state.selectedTags.budget.length > 0;
  
  if (!hasMajor && !hasRegion && !hasBudget) {
    showToast('先选几个标签试试吧～');
    return;
  }
  
  // 移除初始的快捷问题和标签区
  const quickQuestions = document.getElementById('quickQuestions');
  const tagSection = document.getElementById('tagSection');
  
  if (quickQuestions) quickQuestions.style.display = 'none';
  if (tagSection) tagSection.style.display = 'none';
  
  // 添加用户选择的摘要
  let summary = [];
  if (state.selectedTags.majors.length > 0) {
    summary.push(state.selectedTags.majors.join('、'));
  }
  if (state.selectedTags.region.length > 0) {
    summary.push(state.selectedTags.region.map(r => {
      const map = { beijing: '北京', shanghai: '上海', guangdong: '广东', jiangsu: '江苏', zhejiang: '浙江', other: '其他' };
      return map[r] || r;
    }).join('、') + '地区');
  }
  if (state.selectedTags.budget.length > 0) {
    summary.push(state.selectedTags.budget.map(b => {
      const map = { '0-10': '10万内', '10-20': '10-20万', '20-40': '20-40万', '40+': '40万以上' };
      return map[b] || b;
    }).join('、') + '预算');
  }
  
  addUserMessage(summary.join(' · '));
  
  // 显示正在输入
  showTyping();
  
  setTimeout(() => {
    hideTyping();
    generateAndShowResults();
  }, 800);
}

// ==================== 工具函数 ====================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:rgba(0,0,0,0.8);color:#fff;padding:12px 24px;border-radius:12px;font-size:14px;z-index:9999;opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => toast.style.opacity = '0', 2000);
}

function goBack() {
  // 返回上一页，或者刷新重置
  if (window.history.length > 1) {
    window.history.back();
  } else {
    location.reload();
  }
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', async () => {
  // 预加载数据
  loadSchoolData();
  
  // 自动聚焦输入框
  setTimeout(() => {
    const input = document.getElementById('messageInput');
    if (input) input.focus();
  }, 500);
});
