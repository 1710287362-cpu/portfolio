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

  /* ---------- 项目详情视图：上视频 + 下排版（内容动态填充） ---------- */
  var projectViewer = document.getElementById('projectViewer');
  var projectViewerBack = document.getElementById('projectViewerBack');
  var projectViewerTitle = document.getElementById('projectViewerTitle');
  var projectViewerVideo = document.getElementById('projectViewerVideo');
  var projectViewerImgs = document.getElementById('projectViewerImgs');

  function openProjectViewer(card) {
    if (!projectViewer) return;
    if (projectViewerTitle) {
      projectViewerTitle.textContent = card.getAttribute('data-title') || '';
    }
    if (projectViewerVideo) {
      projectViewerVideo.src = card.getAttribute('data-video') || '';
      projectViewerVideo.poster = card.getAttribute('data-poster') || '';
    }
    if (projectViewerImgs) {
      projectViewerImgs.innerHTML = '';
      (card.getAttribute('data-imgs') || '').split(',').forEach(function (src, i) {
        src = src.trim();
        if (!src) return;
        var img = document.createElement('img');
        img.src = src;
        img.alt = (card.getAttribute('data-title') || '作品') + ' 排版 ' + (i + 1);
        img.loading = 'lazy';
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