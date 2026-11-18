(() => {
  const tabs = Array.from(document.querySelectorAll('.gallery-tab'));
  const panels = Array.from(document.querySelectorAll('[data-gallery]'));

  function showDataset(name) {
    for (const tab of tabs) {
      const selected = tab.dataset.dataset === name;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    }
    for (const panel of panels) {
      const selected = panel.dataset.gallery === name;
      panel.hidden = !selected;
      if (!selected) panel.querySelectorAll('video').forEach(video => video.pause());
    }
  }
  tabs.forEach(tab => tab.addEventListener('click', () => showDataset(tab.dataset.dataset)));

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  document.querySelectorAll('.language-switch a').forEach(link => {
    link.addEventListener('click', () => {
      link.hash = location.hash;
    });
  });

  const media = window.LIDARGEN_MEDIA || {};
  document.querySelectorAll('[data-media-slot]').forEach(slot => {
    const item = media[slot.dataset.mediaSlot];
    if (!item || typeof item.src !== 'string' || !item.src.trim()) return;
    if (item.type !== 'image' && item.type !== 'video') {
      console.warn(`Unsupported media type for ${slot.dataset.mediaSlot}: ${item.type}`);
      return;
    }

    const placeholder = Array.from(slot.childNodes);
    const element = document.createElement(item.type === 'video' ? 'video' : 'img');
    element.className = 'media-element';
    const localizedAlt = isEnglish ? item.altEn : item.altZh;
    const label = localizedAlt || (!isEnglish && item.alt) || slot.dataset.mediaLabel || (isEnglish ? 'LiFTeR project media' : 'LiFTeR 项目素材');
    if (item.type === 'video') {
      element.controls = true;
      element.playsInline = true;
      element.preload = 'metadata';
      element.setAttribute('aria-label', label);
      if (item.poster) element.poster = item.poster;
      if (item.subtitles && typeof item.subtitles.src === 'string' && item.subtitles.src.trim()) {
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.srclang = item.subtitles.language || 'en';
        track.label = item.subtitles.label || 'English';
        track.src = item.subtitles.src;
        track.default = Boolean(item.subtitles.default);
        // Keep the native track and caption controls, while sizing each cue to
        // its text instead of drawing a fixed-width box around short lines.
        const originalText = new WeakMap();
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const positionCaptions = () => {
          const cues = track.track.cues;
          const { width, height } = element.getBoundingClientRect();
          if (!cues || !width || !height || !context) return;

          // Match the ::cue font size in styles.css, including fullscreen.
          const fontSize = Math.min(24, Math.max(12, window.innerWidth * 0.014));
          context.font = `${fontSize}px Arial`;
          const maxWidth = width * 0.6;
          const padding = fontSize * 1.2;
          const maxTextWidth = Math.max(1, maxWidth - padding);
          let changed = false;
          for (const cue of cues) {
            if (!originalText.has(cue)) originalText.set(cue, cue.text);
            const words = originalText.get(cue).trim().split(/\s+/);
            // Use the fewest lines that fit, then balance their lengths so
            // narrow screens do not leave a single word on the last line.
            const best = Array(words.length + 1);
            best[words.length] = { lines: [], score: 0 };
            for (let start = words.length - 1; start >= 0; start--) {
              let candidate = '';
              for (let end = start; end < words.length; end++) {
                candidate = candidate ? `${candidate} ${words[end]}` : words[end];
                const candidateWidth = context.measureText(candidate).width;
                if (candidateWidth > maxTextWidth && end > start) break;
                const lines = [candidate, ...best[end + 1].lines];
                const score = best[end + 1].score + Math.max(0, maxTextWidth - candidateWidth) ** 2;
                if (!best[start] || lines.length < best[start].lines.length ||
                    (lines.length === best[start].lines.length && score < best[start].score)) {
                  best[start] = { lines, score };
                }
              }
            }
            const lines = best[0].lines;
            const text = lines.join('\n');
            const textWidth = Math.max(0, ...lines.map(value => context.measureText(value).width));
            const size = Math.min(60, (textWidth + padding) / width * 100);
            const controlGap = Math.min(height * 0.3, 52);
            const line = Math.max(5, Math.min(width < 600 ? 48 : 80,
              (height - controlGap - fontSize * 1.4 * lines.length - 6) / height * 100));
            if (cue.text !== text || cue.size !== size || cue.line !== line ||
                cue.position !== 50 || cue.positionAlign !== 'center' || cue.snapToLines) {
              cue.text = text;
              cue.snapToLines = false;
              cue.line = line;
              cue.position = 50;
              cue.positionAlign = 'center';
              cue.align = 'center';
              cue.size = size;
              changed = true;
            }
          }
          // Repaint an active cue after resizing without unloading its track.
          if (changed && track.track.mode === 'showing') {
            track.track.mode = 'hidden';
            track.track.mode = 'showing';
          }
        };
        track.addEventListener('load', positionCaptions);
        if (typeof ResizeObserver !== 'undefined') {
          new ResizeObserver(positionCaptions).observe(element);
        }
        window.addEventListener('resize', positionCaptions);
        document.addEventListener('fullscreenchange', positionCaptions);
        element.addEventListener('webkitbeginfullscreen', positionCaptions);
        element.addEventListener('webkitendfullscreen', positionCaptions);
        element.append(track);
      }
    } else {
      element.alt = label;
      element.loading = 'lazy';
    }
    element.addEventListener('error', () => {
      slot.replaceChildren(...placeholder);
      console.warn(`无法加载媒体素材：${item.src}`);
    }, { once: true });
    slot.replaceChildren(element);
    element.src = item.src;
  });
})();
