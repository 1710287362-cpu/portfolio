/* ============================================
   沈奕旸 YOUNG 作品集 - 全局交互脚本
   ============================================ */

(function () {
  'use strict';

  /* ---------- 导航栏滚动变色 ---------- */
  var nav = document.getElementById('siteNav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 下载简历弹窗 ---------- */
  var resumeBtn = document.getElementById('btnResume');
  var resumeModal = document.getElementById('resumeModal');
  var closeModalBtn = document.getElementById('closeModal');

  function openResumeModal() {
    if (resumeModal) resumeModal.classList.add('show');
  }

  if (resumeBtn) resumeBtn.addEventListener('click', openResumeModal);
  if (closeModalBtn && resumeModal) {
    closeModalBtn.addEventListener('click', function () {
      resumeModal.classList.remove('show');
    });
  }
  if (resumeModal) {
    resumeModal.addEventListener('click', function (e) {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('show');
      }
    });
  }

  /* ---------- 首页视频：播放时静音（浏览器策略） ---------- */
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.play().catch(function () {
      var tryPlay = function () {
        heroVideo.play().catch(function () {});
        document.removeEventListener('click', tryPlay);
        document.removeEventListener('touchstart', tryPlay);
      };
      document.addEventListener('click', tryPlay, { once: true });
      document.addEventListener('touchstart', tryPlay, { once: true });
    });
  }

  /* ---------- 视频控制按钮：播放/暂停 + 静音 ---------- */
  var btnPlayPause = document.getElementById('btnPlayPause');
  var btnMute = document.getElementById('btnMute');

  if (btnPlayPause && heroVideo) {
    var iconPlay = btnPlayPause.querySelector('.icon-play');
    var iconPause = btnPlayPause.querySelector('.icon-pause');

    function updatePlayIcon() {
      if (heroVideo.paused) {
        iconPlay.style.display = '';
        iconPause.style.display = 'none';
      } else {
        iconPlay.style.display = 'none';
        iconPause.style.display = '';
      }
    }

    heroVideo.addEventListener('play', updatePlayIcon);
    heroVideo.addEventListener('pause', updatePlayIcon);
    updatePlayIcon();

    btnPlayPause.addEventListener('click', function () {
      if (heroVideo.paused) {
        heroVideo.play().catch(function () {});
      } else {
        heroVideo.pause();
      }
    });
  }

  if (btnMute && heroVideo) {
    var iconVolOn = btnMute.querySelector('.icon-vol-on');
    var iconVolOff = btnMute.querySelector('.icon-vol-off');

    function updateMuteIcon() {
      if (heroVideo.muted) {
        iconVolOn.style.display = 'none';
        iconVolOff.style.display = '';
      } else {
        iconVolOn.style.display = '';
        iconVolOff.style.display = 'none';
      }
    }

    heroVideo.addEventListener('volumechange', updateMuteIcon);
    updateMuteIcon();

    btnMute.addEventListener('click', function () {
      heroVideo.muted = !heroVideo.muted;
    });
  }

  /* ---------- 多视频互斥播放 ---------- */
  var allVideos = document.querySelectorAll('video');
  allVideos.forEach(function (video) {
    video.addEventListener('play', function () {
      allVideos.forEach(function (v) {
        if (v !== video && !v.paused) {
          v.pause();
        }
      });
    });
  });

  /* ---------- 项目视频弹窗 ---------- */
  var videoModal = document.getElementById('videoModal');
  var modalVideo = document.getElementById('modalVideo');
  var closeVideoModal = document.getElementById('closeVideoModal');

  if (closeVideoModal && videoModal) {
    closeVideoModal.addEventListener('click', function () {
      closeVideoModalFn();
    });
  }
  if (videoModal) {
    videoModal.addEventListener('click', function (e) {
      if (e.target === videoModal) {
        closeVideoModalFn();
      }
    });
  }

  function closeVideoModalFn() {
    if (videoModal) videoModal.classList.remove('show');
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.src = '';
    }
  }

  function openVideoModal(videoSrc, posterSrc) {
    if (!videoModal || !modalVideo) return;
    modalVideo.src = videoSrc;
    if (posterSrc) modalVideo.poster = posterSrc;
    videoModal.classList.add('show');
    modalVideo.play().catch(function () {});
  }

  // 暴露给全局，供项目卡片点击调用
  window.openVideoModal = openVideoModal;
  window.closeVideoModal = closeVideoModalFn;

  /* ---------- 站内网站预览：沉浸式打开外部链接 ---------- */
  var siteViewer = document.getElementById('siteViewer');
  var siteFrame = document.getElementById('siteFrame');
  var siteViewerTitle = document.getElementById('siteViewerTitle');
  var siteViewerBack = document.getElementById('siteViewerBack');
  var siteViewerNewTab = document.getElementById('siteViewerNewTab');
  var siteViewerLoading = document.getElementById('siteViewerLoading');
  var siteViewerUrl = '';

  function showSiteViewerLoading() {
    if (siteViewerLoading) siteViewerLoading.style.display = 'flex';
  }

  if (siteFrame) {
    siteFrame.addEventListener('load', function () {
      if (siteViewerLoading) siteViewerLoading.style.display = 'none';
    });
  }

  function openSiteViewer(url, title) {
    if (!siteViewer || !siteFrame) return;
    siteViewerUrl = url;
    siteFrame.src = url;
    if (siteViewerTitle) siteViewerTitle.textContent = title || url;
    showSiteViewerLoading();
    siteViewer.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSiteViewer() {
    if (!siteViewer) return;
    siteViewer.classList.remove('show');
    if (siteFrame) siteFrame.src = '';
    siteViewerUrl = '';
    document.body.style.overflow = '';
  }

  if (siteViewerBack) siteViewerBack.addEventListener('click', closeSiteViewer);
  if (siteViewerNewTab) {
    siteViewerNewTab.addEventListener('click', function () {
      if (siteViewerUrl) window.open(siteViewerUrl, '_blank', 'noopener');
    });
  }

  /* ---------- 后台预加载外部链接，点击时秒开 ---------- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var urls = [];
      document.querySelectorAll('[data-link]').forEach(function (card) {
        var url = card.getAttribute('data-link');
        if (url && urls.indexOf(url) === -1) urls.push(url);
      });
      urls.forEach(function (url) {
        var f = document.createElement('iframe');
        f.src = url;
        f.setAttribute('aria-hidden', 'true');
        f.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;pointer-events:none;';
        document.body.appendChild(f);
        setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 120000);
      });
    }, 2000);
  });

  /* ---------- 项目详情视图：上视频/网页 + 下排版（内容动态填充） ---------- */
  var projectViewer = document.getElementById('projectViewer');
  var projectViewerBack = document.getElementById('projectViewerBack');
  var projectViewerTitle = document.getElementById('projectViewerTitle');
  var projectViewerVideo = document.getElementById('projectViewerVideo');
  var projectViewerSite = document.getElementById('projectViewerSite');
  var projectViewerCaption = document.getElementById('projectViewerCaption');
  var projectViewerImgs = document.getElementById('projectViewerImgs');

  function openProjectViewer(card) {
    if (!projectViewer) return;
    if (projectViewerTitle) {
      projectViewerTitle.textContent = card.getAttribute('data-title') || '';
    }
    var site = card.getAttribute('data-site');
    /* 清理上一次的多视频容器 */
    var multiOld = document.getElementById('projectViewerVideos');
    if (multiOld) multiOld.remove();
    if (site && projectViewerSite) {
      /* 网页设计类项目：顶部嵌入网页 */
      projectViewerSite.style.display = 'block';
      projectViewerSite.src = site;
      if (projectViewerVideo) projectViewerVideo.style.display = 'none';
    } else if (projectViewerVideo) {
      /* 视频类项目：顶部播放视频（data-video 支持逗号分隔多条） */
      var videoList = (card.getAttribute('data-video') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      if (videoList.length > 1) {
        projectViewerVideo.style.display = 'none';
        projectViewerVideo.removeAttribute('src');
        projectViewerVideo.load();
        var vWrap = document.createElement('div');
        vWrap.id = 'projectViewerVideos';
        var vPosters = (card.getAttribute('data-vposters') || '').split(',');
        videoList.forEach(function (src, i) {
          if (/\.(webp|gif)(\?|#|$)/i.test(src)) {
            /* 动图：直接以图片形式循环播放 */
            var im = document.createElement('img');
            im.src = src;
            im.alt = (card.getAttribute('data-title') || '作品') + ' 动图 ' + (i + 1);
            vWrap.appendChild(im);
            return;
          }
          var v = document.createElement('video');
          v.src = src;
          v.controls = true;
          v.loop = true;
          v.setAttribute('playsinline', '');
          v.setAttribute('webkit-playsinline', '');
          v.setAttribute('x5-playsinline', '');
          if (vPosters[i] && vPosters[i].trim()) v.poster = vPosters[i].trim();
          vWrap.appendChild(v);
        });
        projectViewerVideo.parentNode.insertBefore(vWrap, projectViewerVideo.nextSibling);
      } else {
        projectViewerVideo.style.display = '';
        projectViewerVideo.src = videoList[0] || '';
        projectViewerVideo.poster = card.getAttribute('data-poster') || '';
      }
      if (projectViewerSite) projectViewerSite.style.display = 'none';
    }
    if (projectViewerCaption) {
      projectViewerCaption.textContent = card.getAttribute('data-caption') || '创意提案 · 排版设计';
    }
    if (projectViewerImgs) {
      projectViewerImgs.innerHTML = '';
      (card.getAttribute('data-imgs') || '').split(',').forEach(function (src, i) {
        src = src.trim();
        if (!src) return;
        var img = document.createElement('img');
        img.src = src;
        img.alt = (card.getAttribute('data-title') || '作品') + ' 排版 ' + (i + 1);
        projectViewerImgs.appendChild(img);
      });
    }
    projectViewer.classList.add('show');
    document.body.style.overflow = 'hidden';
    var body = projectViewer.querySelector('.project-viewer-body');
    if (body) body.scrollTop = 0;
  }

  function closeProjectViewer() {
    if (!projectViewer) return;
    projectViewer.classList.remove('show');
    if (projectViewerVideo) {
      projectViewerVideo.pause();
      projectViewerVideo.src = '';
    }
    var multi = document.getElementById('projectViewerVideos');
    if (multi) {
      multi.querySelectorAll('video').forEach(function (v) { v.pause(); });
      multi.remove();
    }
    if (projectViewerSite) projectViewerSite.src = '';
    document.body.style.overflow = '';
  }

  if (projectViewerBack) projectViewerBack.addEventListener('click', closeProjectViewer);

  /* ---------- 项目卡片点击：详情 / 外链（站内预览） / 播放视频 ---------- */
  function bindCardClick(card) {
    card.addEventListener('click', function () {
      if (card.hasAttribute('data-project')) {
        openProjectViewer(card);
        return;
      }
      var link = card.getAttribute('data-link');
      if (link) {
        openSiteViewer(link, card.getAttribute('data-title') || '');
        return;
      }
      var src = card.getAttribute('data-video');
      var poster = card.getAttribute('data-poster') || '';
      if (src) openVideoModal(src, poster);
    });
  }
  document.querySelectorAll('.project-card').forEach(bindCardClick);
  document.querySelectorAll('.work-card').forEach(bindCardClick);

  /* ---------- 首页滚动到分区（平滑） ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 插画灯箱：放大欣赏模式 ---------- */
  (function initIllustrationLightbox() {
    var lightbox = document.getElementById('illLightbox');
    if (!lightbox) return;

    var items = Array.prototype.slice.call(document.querySelectorAll('.ill-item'));
    var lbImg = document.getElementById('illLbImg');
    var lbCounter = document.getElementById('illLbCounter');
    var btnClose = document.getElementById('illLbClose');
    var btnPrev = document.getElementById('illLbPrev');
    var btnNext = document.getElementById('illLbNext');
    var current = 0;

    function preload(index) {
      if (index < 0 || index >= items.length) return;
      var pre = new Image();
      pre.src = items[index].getAttribute('data-full');
    }

    function render() {
      var item = items[current];
      if (!item) return;
      lbImg.src = item.getAttribute('data-full');
      lbImg.alt = item.alt || ('插画 ' + (current + 1));
      lbCounter.textContent = (current + 1) + ' / ' + items.length;
      preload(current + 1);
      preload(current - 1);
      resetZoom();
    }

    function open(index) {
      current = index;
      render();
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
      resetZoom();
    }

    function step(dir) {
      current = (current + dir + items.length) % items.length;
      render();
    }

    items.forEach(function (item, i) {
      item.addEventListener('click', function () { open(i); });
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { step(-1); });
    btnNext.addEventListener('click', function () { step(1); });

    /* 点击图片外深色区域也可关闭 */
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('show')) return;
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'Escape') close();
    });

    /* ---------- 缩放与平移（滚轮 / 双指 / 拖拽） ---------- */
    var scale = 1, panX = 0, panY = 0;
    var MIN_SCALE = 1, MAX_SCALE = 5;

    function applyTransform() {
      lbImg.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
      lbImg.style.cursor = scale > 1 ? 'grab' : 'default';
    }
    function resetZoom() {
      scale = 1; panX = 0; panY = 0;
      applyTransform();
    }
    function clampPan() {
      var maxX = (lbImg.clientWidth * (scale - 1)) / 2;
      var maxY = (lbImg.clientHeight * (scale - 1)) / 2;
      var slack = 80;
      panX = Math.max(-maxX - slack, Math.min(maxX + slack, panX));
      panY = Math.max(-maxY - slack, Math.min(maxY + slack, panY));
    }
    function setScale(next) {
      scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
      if (scale === MIN_SCALE) { panX = 0; panY = 0; }
      applyTransform();
    }

    /* 滚轮缩放（桌面端） */
    lbImg.addEventListener('wheel', function (e) {
      e.preventDefault();
      if (!lightbox.classList.contains('show')) return;
      setScale(scale * Math.pow(1.0015, -e.deltaY));
    }, { passive: false });

    /* 双指缩放 + 单指/鼠标拖拽平移（Pointer Events） */
    var pointers = new Map();
    var pinchStartDist = 0, pinchStartScale = 1;
    var dragStart = null;

    lbImg.addEventListener('pointerdown', function (e) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        dragStart = { x: e.clientX - panX, y: e.clientY - panY };
        if (scale > 1) lbImg.style.cursor = 'grabbing';
      } else if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        pinchStartScale = scale;
      }
      try { lbImg.setPointerCapture(e.pointerId); } catch (err) {}
    });

    lbImg.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        /* 双指捏合 */
        var pts = Array.from(pointers.values());
        var dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (pinchStartDist > 0) setScale(pinchStartScale * dist / pinchStartDist);
      } else if (pointers.size === 1 && dragStart) {
        /* 拖拽平移（放大时才有意义，但未放大也允许小幅拖动） */
        panX = e.clientX - dragStart.x;
        panY = e.clientY - dragStart.y;
        if (scale > 1) clampPan();
        applyTransform();
      }
    });

    function endPointer(e) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStartDist = 0;
      if (pointers.size === 0) {
        dragStart = null;
        lbImg.style.cursor = scale > 1 ? 'grab' : 'default';
      }
    }
    lbImg.addEventListener('pointerup', endPointer);
    lbImg.addEventListener('pointercancel', endPointer);

    /* 双击 / 双触：在 1x 与 2.5x 之间切换 */
    var lastTap = 0;
    lbImg.addEventListener('dblclick', function () {
      setScale(scale > 1 ? 1 : 2.5);
    });
    lbImg.addEventListener('touchend', function () {
      var now = Date.now();
      if (now - lastTap < 320) setScale(scale > 1 ? 1 : 2.5);
      lastTap = now;
    });
  })();

  /* ---------- 按 ESC 关闭弹窗 ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (resumeModal) resumeModal.classList.remove('show');
      closeVideoModalFn();
      closeSiteViewer();
      closeProjectViewer();
    }
  });

})();