import * as params from '@params';

const resList = document.getElementById('searchResults');
const sInput = document.getElementById('searchInput');
const searchBox = document.getElementById('searchbox');
const searchEmpty = document.getElementById('searchEmpty');
const searchExternal = document.getElementById('searchExternal');
const searchExpandHint = document.getElementById('searchExpandHint');
const searchLoading = document.getElementById('searchLoading');

let fuse;
let currentElement = null;
let firstResult = null;
let lastResult = null;
let isExpanded = false;
let allCachedResults = [];

const MAX_PREVIEW = 5;

const defaultFuseOptions = {
    distance: 100,
    threshold: 0.4,
    ignoreLocation: true,
    keys: ['title', 'permalink', 'summary', 'content']
};

const buildFuseOptions = () => {
    if (!params.fuseOpts) return defaultFuseOptions;
    return {
        isCaseSensitive: params.fuseOpts.iscasesensitive ?? false,
        includeScore: params.fuseOpts.includescore ?? false,
        includeMatches: params.fuseOpts.includematches ?? false,
        minMatchCharLength: params.fuseOpts.minmatchcharlength ?? 1,
        shouldSort: params.fuseOpts.shouldsort ?? true,
        findAllMatches: params.fuseOpts.findallmatches ?? false,
        keys: params.fuseOpts.keys ?? defaultFuseOptions.keys,
        location: params.fuseOpts.location ?? 0,
        threshold: params.fuseOpts.threshold ?? defaultFuseOptions.threshold,
        distance: params.fuseOpts.distance ?? defaultFuseOptions.distance,
        ignoreLocation: params.fuseOpts.ignorelocation ?? defaultFuseOptions.ignoreLocation
    };
};

const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => fn(...args), delay);
    };
};

const reset = () => {
    currentElement = null;
    firstResult = null;
    lastResult = null;
    isExpanded = false;
    allCachedResults = [];
    resList.innerHTML = '';
    sInput.value = '';
    sInput.focus();
    hideAllHints();
};

const hideAllHints = () => {
    if (searchEmpty) searchEmpty.style.display = 'none';
    if (searchExpandHint) searchExpandHint.style.display = 'none';
    if (searchLoading) searchLoading.style.display = 'none';
};

const setActiveResult = (element) => {
    document.querySelectorAll('.focus').forEach((item) => item.classList.remove('focus'));
    if (!element) return;
    element.focus();
    element.parentElement?.classList.add('focus');
    currentElement = element;
};

const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();
};

const truncateText = (text, maxLen) => {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '…';
};

// 检查关键词是否真正出现在文本中
const isKeywordMatched = (query, item) => {
    const q = query.toLowerCase();
    const fields = [item.title, item.summary, item.content].filter(Boolean);
    return fields.some(f => stripHtml(f).toLowerCase().includes(q));
};

const renderResults = (results, expanded) => {
    hideAllHints();

    if (!Array.isArray(results) || results.length === 0) {
        resList.innerHTML = '';
        firstResult = lastResult = currentElement = null;
        if (searchEmpty && searchExternal) {
            searchEmpty.style.display = 'block';
            const query = sInput.value.trim();
            searchExternal.href = 'https://www.baidu.com/s?wd=' + encodeURIComponent(query + ' 果芽MBA');
        }
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const result of results) {
        const li = document.createElement('li');
        li.className = 'search-result-item';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'search-result-content';

        const titleEl = document.createElement('div');
        titleEl.className = 'search-result-title';
        titleEl.textContent = result.item.title;
        contentDiv.appendChild(titleEl);

        const arrow = document.createElement('div');
        arrow.className = 'search-result-arrow';
        arrow.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';

        const link = document.createElement('a');
        link.className = 'entry-link';
        link.href = result.item.permalink;
        link.setAttribute('aria-label', result.item.title);

        li.appendChild(contentDiv);
        li.appendChild(arrow);
        li.appendChild(link);
        fragment.appendChild(li);
    }

    resList.innerHTML = '';
    resList.appendChild(fragment);
    firstResult = resList.firstElementChild;
    lastResult = resList.lastElementChild;

    // 预览模式且有更多结果时，显示展开提示
    if (!expanded && allCachedResults.length > MAX_PREVIEW && searchExpandHint) {
        searchExpandHint.style.display = 'flex';
    }
};

const performSearch = (expanded) => {
    if (!fuse) return;

    const query = sInput.value.trim();
    if (!query) {
        allCachedResults = [];
        renderResults([], false);
        return;
    }

    // fuse搜索 + 过滤：只保留关键词真正出现在内容中的结果
    const fuseResults = fuse.search(query);
    allCachedResults = fuseResults.filter(r => isKeywordMatched(query, r.item));

    if (expanded) {
        // 展开模式：先显示加载动画，延迟后展示结果
        hideAllHints();
        resList.innerHTML = '';
        if (searchLoading) searchLoading.style.display = 'flex';

        setTimeout(() => {
            renderResults(allCachedResults, true);
            isExpanded = true;
        }, 400);
    } else {
        renderResults(allCachedResults.slice(0, MAX_PREVIEW), false);
        isExpanded = false;
    }
};

const initSearch = async () => {
    if (!sInput || !resList) return;

    sInput.disabled = false;
    sInput.focus();

    try {
        const response = await fetch('../index.json');
        if (!response.ok) {
            throw new Error(`Search index load failed: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
            fuse = new Fuse(data, buildFuseOptions());
        }
    } catch (error) {
        console.error(error);
    }
};

window.addEventListener('load', initSearch);

sInput?.addEventListener('input', debounce(() => {
    isExpanded = false;
    performSearch(false);
}, 150));

// 回车键：展开所有结果
sInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(true);
    }
});

sInput?.addEventListener('search', () => {
    if (!sInput.value) reset();
});

document.addEventListener('keydown', (event) => {
    const { key } = event;
    const active = document.activeElement;
    const isInSearchBox = searchBox?.contains(active);

    if (key === 'Escape') { reset(); return; }
    if (!firstResult || !isInSearchBox) return;

    if (key === 'ArrowDown') {
        event.preventDefault();
        if (active === sInput) {
            setActiveResult(firstResult.querySelector('.entry-link'));
        } else if (active?.parentElement !== lastResult) {
            setActiveResult(active?.parentElement?.nextElementSibling?.querySelector('.entry-link'));
        }
    } else if (key === 'ArrowUp') {
        event.preventDefault();
        if (active?.parentElement === firstResult) {
            setActiveResult(sInput);
        } else if (active !== sInput) {
            setActiveResult(active?.parentElement?.previousElementSibling?.querySelector('.entry-link'));
        }
    } else if (key === 'ArrowRight') {
        if (active?.matches?.('.entry-link')) active.click();
    }
});
