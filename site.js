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
        // Keep captions above the controls on narrow players; use more of the
        // available frame on larger players and in fullscreen.
        const positionCaptions = () => {
          const cues = track.track.cues;
          if (!cues) return;
          const line = element.clientWidth < 600 ? 55 : 80;
          let changed = false;
          for (const cue of cues) {
            cue.snapToLines = false;
            if (cue.line !== line) {
              cue.line = line;
              changed = true;
            }
          }
          // Chrome keeps drawing the active cue at its old spot until the
          // track is remounted; toggle the mode so a mid-play resize moves it.
          if (changed && track.track.mode === 'showing') {
            track.track.mode = 'disabled';
            track.track.mode = 'showing';
          }
        };
        track.addEventListener('load', positionCaptions);
        if (typeof ResizeObserver !== 'undefined') {
          new ResizeObserver(positionCaptions).observe(element);
        } else {
          window.addEventListener('resize', positionCaptions);
        }
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
