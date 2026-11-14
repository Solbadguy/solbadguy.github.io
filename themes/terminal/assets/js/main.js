// ============ TYPEWRITER ============
function initTypewriter() {
  const el = document.getElementById('typewriter-output');
  if (!el) return;
  
  const linesData = el.getAttribute('data-lines');
  if (!linesData) return;

  let lines = [];
  try { lines = JSON.parse(linesData); } catch (e) { return; }

  if (sessionStorage.getItem('typewriter-seen') === 'true') {
    el.innerHTML = lines.map(l => `<div class="manifest-line"><span class="${l.cls || ''}">${l.text}</span></div>`).join('');
    return;
  }

  let lineIdx = 0, charIdx = 0, completedLinesHtml = '';
  const speed = parseInt(el.getAttribute('data-speed')) || 40;

  function typeNext() {
    if (lineIdx >= lines.length) {
      el.innerHTML = completedLinesHtml;
      sessionStorage.setItem('typewriter-seen', 'true');
      return;
    }
    const line = lines[lineIdx];
    if (charIdx < line.text.length) {
      const partial = line.text.substring(0, charIdx + 1);
      const currentLineHtml = `<div class="manifest-line"><span class="${line.cls || ''}">${partial}</span></div>`;
      el.innerHTML = completedLinesHtml + currentLineHtml;
      charIdx++;
      setTimeout(typeNext, speed + Math.random() * 30);
    } else {
      completedLinesHtml += `<div class="manifest-line"><span class="${line.cls || ''}">${line.text}</span></div>`;
      lineIdx++;
      charIdx = 0;
      setTimeout(typeNext, line.delay || 200);
    }
  }
  typeNext();
}

// ============ TOC ============
function initTOC() {
  const toc = document.getElementById('toc');
  if (!toc) return;
  const headings = document.querySelectorAll('.post-content h2, .post-content h3');
  const links = toc.querySelectorAll('a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-20% 0px -80% 0px' });
  headings.forEach(h => observer.observe(h));
}

// ============ HEADING ANCHORS ============
function initHeadingAnchors() {
  document.querySelectorAll('.post-content h2, .post-content h3').forEach(h => {
    if (!h.id) return;
    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = `#${h.id}`;
    anchor.textContent = '#';
    anchor.title = 'Copy link';
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#' + h.id).then(() => {
        anchor.textContent = '✓';
        setTimeout(() => { anchor.textContent = '#'; }, 1500);
      });
    });
    h.insertBefore(anchor, h.firstChild);
  });
}

// ============ COPY CODE ============
function initCodeCopy() {
  document.querySelectorAll('.post-content pre').forEach(pre => {
    if (pre.parentNode.classList.contains('code-block')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    const header = document.createElement('div');
    header.className = 'code-block-header';
    const codeEl = pre.querySelector('code');
    const lang = codeEl?.dataset.lang || (codeEl?.className.match(/language-(\w+)/) || [])[1] || 'shell';
    header.innerHTML = `<div class="lang-badge">${lang}</div>`;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'copy';
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeEl.innerText).then(() => {
        btn.textContent = 'copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
      });
    });
    header.appendChild(btn);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
  });
}

// ============ SEARCH ============
let searchIndex = [], selectedIndex = 0;
async function initSearch() {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const trigger = document.getElementById('search-trigger');
  if (!overlay || !input) return;
  try {
    const res = await fetch('/index.json');
    searchIndex = await res.json();
  } catch (e) { searchIndex = []; }

  function openSearch() { overlay.classList.add('active'); input.focus(); input.value = ''; renderResults(''); }
  function closeSearch() { overlay.classList.remove('active'); }
  trigger?.addEventListener('click', openSearch);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    let filtered = searchIndex;
    if (q) {
      filtered = searchIndex.filter(item =>
        item.title.toLowerCase().includes(q) ||
        (item.tags || []).some(t => t.toLowerCase().includes(q)) ||
        (item.content || '').toLowerCase().includes(q)
      );
    }
    selectedIndex = 0;
    if (filtered.length === 0) {
      results.innerHTML = `<div class="search-empty">grep: ${q || '*'}: No matches found</div>`;
      return;
    }
    results.innerHTML = filtered.slice(0, 15).map((item, i) => `
      <a href="${item.permalink}" class="search-result ${i === 0 ? 'selected' : ''}">
        <span class="search-result-title">&gt; ${item.title}</span>
        <span class="search-result-date">${item.date || ''}</span>
      </a>
    `).join('');
  }
  input.addEventListener('input', (e) => renderResults(e.target.value));
  input.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('.search-result');
    if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, items.length - 1); items.forEach((it, i) => it.classList.toggle('selected', i === selectedIndex)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, 0); items.forEach((it, i) => it.classList.toggle('selected', i === selectedIndex)); }
    else if (e.key === 'Enter') { e.preventDefault(); items[selectedIndex]?.click(); }
  });
}

// ============ READING PROGRESS ============
function initReadingProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = ((h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100) + '%';
  });
}

// ============ BACK TO TOP ============
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============ ЖИВОЙ UPTIME ============
function initUptime() {
  const el = document.getElementById('uptime-counter');
  if (!el) return;
  let startTime = sessionStorage.getItem('blog-uptime-start');
  if (!startTime) {
    startTime = Date.now();
    sessionStorage.setItem('blog-uptime-start', startTime);
  } else {
    startTime = parseInt(startTime, 10);
  }
  setInterval(() => {
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    if (h > 0) el.textContent = `${h}h ${m}m ${s}s`;
    else if (m > 0) el.textContent = `${m}m ${s}s`;
    else el.textContent = `${s}s`;
  }, 1000);
}

// ============ HOTKEYS ============
function initHotkeys() {
  const helpOverlay = document.getElementById('help-overlay');
  if (!helpOverlay) return;
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === '?') { e.preventDefault(); helpOverlay.classList.toggle('active'); }
    else if (e.key === 'Escape') { helpOverlay.classList.remove('active'); document.getElementById('search-overlay')?.classList.remove('active'); }
    else if (e.key === '/') { e.preventDefault(); document.getElementById('search-overlay')?.classList.add('active'); document.getElementById('search-input')?.focus(); }
    else if (e.key === 'g') {
      const handler = (e2) => { if (e2.key === 'h') window.location.href = '/'; document.removeEventListener('keydown', handler); };
      document.addEventListener('keydown', handler, { once: true });
      setTimeout(() => document.removeEventListener('keydown', handler), 1000);
    }
  });
  helpOverlay.addEventListener('click', (e) => { if (e.target === helpOverlay) helpOverlay.classList.remove('active'); });
}

// ============ EASTER EGG ============
function initEasterEgg() {
  let buffer = '';
  document.addEventListener('keydown', (e) => {
    if (e.key.length === 1) buffer += e.key.toLowerCase();
    if (buffer.length > 20) buffer = buffer.slice(-20);
    if (buffer.includes('sudorm')) {
      document.body.style.transition = 'filter 0.3s';
      document.body.style.filter = 'invert(1)';
      setTimeout(() => { document.body.style.filter = ''; alert("rm: cannot remove '/': Permission denied"); }, 500);
      buffer = '';
    }
  });
}

// ============ NEOFETCH DEBIAN ANIMATION ============
function initNeofetchDebian() {
  const container = document.getElementById('neofetch-output');
  if (!container) return;
  
  // Очищаем sessionStorage для отладки, если хотите видеть анимацию каждый раз:
  // sessionStorage.removeItem('neofetch-debian-seen'); 

  if (sessionStorage.getItem('neofetch-debian-seen') === 'true') {
    // Если уже видели, рендерим сразу
    const debianArt = getDebianArt();
    container.innerHTML = debianArt.map(line => `<div class="debian-art">${line}</div>`).join('');
    return;
  }

  const debianArt = getDebianArt();
  let currentLine = 0;
  
  function printNextLine() {
    if (currentLine >= debianArt.length) {
      sessionStorage.setItem('neofetch-debian-seen', 'true');
      return;
    }
    
    const line = document.createElement('div');
    line.className = 'debian-art';
    line.textContent = debianArt[currentLine];
    container.appendChild(line);
    
    currentLine++;
    setTimeout(printNextLine, 80);
  }

  printNextLine();
}

function getDebianArt() {
  return [
    "       _,met$$$$$gg.",
    "    ,g$$$$$$$$$$$$$$$P.",
    "  ,g$$P\"     \"\"\"Y$$.\"",
    " ,$$P'              `$$$.",
    "',$$P       ,ggs.     `$$b:",
    "`d$$'     ,$P\"'   .    $$$",
    " $$P      d$'     ,    $$P",
    " $$:      $$.   -    ,d$$'",
    " $$;      Y$b._   _,d$P'",
    " Y$$.    `.`\"Y$$$$P\"'",
    " `$$b      \"-.__",
    "  `Y$$",
    "   `Y$$.",
    "     `$$b.",
    "       `Y$$b.",
    "          `\"Y$b._",
    "              `\"\"\""
  ];
}

// ============ ИНИЦИАЛИЗАЦИЯ ============
document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initTOC();
  initHeadingAnchors();
  initCodeCopy();
  initSearch();
  initReadingProgress();
  initBackToTop();
  initUptime();
  initHotkeys();
  initEasterEgg();
  initNeofetchDebian();
});
