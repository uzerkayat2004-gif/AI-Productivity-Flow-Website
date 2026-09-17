/**
 * Interactive Desktop Demo Controller
 * Windows 11 Desktop + Edge Browser + Twitter/X + Live Flow App
 */
(function() {
  var desktop = document.getElementById('desktopFrame');
  if (!desktop) return;

  var nav = document.getElementById('nav');

  // Buttons & Controls
  var btnDemoVideo = document.getElementById('btnDemoVideo');
  var btnDemoAudio = document.getElementById('btnDemoAudio');
  var btnDemoVoice = document.getElementById('btnDemoVoice');
  var btnDemoReset = document.getElementById('btnDemoReset');

  // Floating Widgets
  var flowHud = document.getElementById('flowSelectionHud');
  var menuBtnVideo = document.getElementById('menuBtnVideo');
  var menuBtnAudio = document.getElementById('menuBtnAudio');
  var menuBtnRead = document.getElementById('menuBtnRead');

  var bottomPill = document.getElementById('flowBottomPill');
  var pillBtnSpeak = document.getElementById('pillBtnSpeak');
  var pillSpeakText = document.getElementById('pillSpeakText');
  var pillBtnVideo = document.getElementById('pillBtnVideo');
  var pillVideoText = document.getElementById('pillVideoText');

  // Video Window
  var videoWin = document.getElementById('videoFlowWindow');
  var btnVideoClose = document.getElementById('btnVideoFlowClose');
  var demoVideo = document.getElementById('interactiveDemoVideo');
  var fVideoPlayBtn = document.getElementById('fVideoPlayBtn');
  var fVideoScrubber = document.getElementById('fVideoScrubber');
  var fVideoTrack = document.getElementById('fVideoTrack');
  var fVideoTime = document.getElementById('fVideoTime');

  // Audio Dialog & Window
  var audioDialog = document.getElementById('flowAudioDialog');
  var btnAudioDialogClose = document.getElementById('btnAudioDialogClose');
  var btnGenerateAudio = document.getElementById('btnGenerateAudioSummary');
  var depthBtns = document.querySelectorAll('.flow-depth-btn');

  var audioWin = document.getElementById('audioFlowWindow');
  var btnAudioClose = document.getElementById('btnAudioFlowClose');
  var realAudio = document.getElementById('realDemoAudio');
  var audioPlayBtn = document.getElementById('btnAudioPlay');
  var audioWaves = document.getElementById('audioSoundwaves');
  var audioStepBack = document.getElementById('btnAudioStepBack');
  var audioStepFwd = document.getElementById('btnAudioStepFwd');
  var audioSeekerBar = document.getElementById('audioSeekerBar');
  var audioSeekerFill = document.getElementById('audioSeekerFill');
  var audioCurTime = document.getElementById('audioCurTime');
  var audioTotTime = document.getElementById('audioTotTime');
  var speedChips = document.querySelectorAll('.speed-chip');

  // Article Elements
  var articleCol = document.getElementById('tweetArticleCol') || document.getElementById('twitterApp');
  var selectable = document.getElementById('selectableArticle');
  var paragraphs = document.querySelectorAll('.article-p');
  var replyText = document.getElementById('xReplyText');

  var lastSelectedText = '';
  var genTimer = null;
  var voiceTimer = null;

  function setActiveChip(activeBtn) {
    [btnDemoVideo, btnDemoAudio, btnDemoVoice].forEach(function(b) {
      if (b) b.classList.remove('is-active');
    });
    if (activeBtn) activeBtn.classList.add('is-active');
  }

  function smoothZoomToPeak() {
    if (!demoTrack) return;
    var vh = window.innerHeight;
    var scrollDist = demoTrack.offsetHeight - vh;
    var currentTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var targetScroll = demoTrack.offsetTop + scrollDist * 0.45;
    if (Math.abs(currentTop - targetScroll) > 80) {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }

  function resetAll() {
    clearTimeout(genTimer);
    clearTimeout(voiceTimer);

    // Close HUDs & Windows
    if (flowHud) {
      flowHud.style.display = 'none';
      flowHud.classList.remove('is-visible', 'is-expanded');
    }
    if (audioDialog) audioDialog.style.display = 'none';
    if (videoWin) videoWin.style.display = 'none';
    if (audioWin) audioWin.style.display = 'none';
    
    var createModal = document.getElementById('videoCreateModal');
    if (createModal) createModal.style.display = 'none';

    // Pause Media
    if (demoVideo) {
      demoVideo.pause();
      demoVideo.currentTime = 0;
    }
    if (realAudio) {
      realAudio.pause();
      realAudio.currentTime = 0;
    }
    if (audioWaves) audioWaves.classList.remove('is-playing');
    if (audioPlayBtn) audioPlayBtn.innerHTML = '&#9658;';

    // Clear Article Selection
    paragraphs.forEach(function(p) {
      p.classList.remove('is-selected-video', 'is-selected-audio');
    });

    // Reset Pill HUD
    if (bottomPill) {
      bottomPill.className = 'flow-floating-pill-hud';
      var tempAudio = bottomPill.querySelector('.audio-pill-temp');
      if (tempAudio) tempAudio.remove();
      Array.from(bottomPill.children).forEach(function(c) {
        c.style.display = '';
      });
    }
    if (pillSpeakText) pillSpeakText.textContent = 'Click to speak';
    if (pillVideoText) pillVideoText.textContent = '... Video';

    // Reset Reply
    if (replyText) {
      replyText.textContent = 'Post your reply (or test Voice Flow dictation)...';
      replyText.classList.remove('is-streaming');
    }
  }

  /* ---------- Video Flow Action ---------- */
  function triggerVideoFlow() {
    resetAll();
    setActiveChip(btnDemoVideo);
    smoothZoomToPeak();

    // Select key paragraph 4 in the tweet
    var targetP = document.getElementById('p4') || paragraphs[3] || paragraphs[0];
    if (targetP) {
      targetP.classList.add('is-selected-video');
      lastSelectedText = targetP.textContent.trim();
      positionHudOverElement(targetP);
    }

    openVideoCreateModal();
  }

  function openVideoCreateModal() {
    var createModal = document.getElementById('videoCreateModal');
    if (!createModal) return;

    var sel = window.getSelection();
    var currentSel = sel ? sel.toString().trim() : '';
    if (currentSel.length > 2) {
      lastSelectedText = currentSel;
    }

    var fillText = lastSelectedText;
    if (!fillText) {
      var p4 = document.getElementById('p4');
      fillText = p4 ? p4.textContent.trim() : 'Voice. Audio. Video. One workflow. Transform information without leaving your workflow.';
    }

    var vcTextarea = document.getElementById('vcSelectedText');
    if (vcTextarea) {
      vcTextarea.value = fillText;
    }

    createModal.style.display = 'block';
  }

  function openVideoWindow() {
    if (flowHud) flowHud.style.display = 'none';
    if (videoWin) {
      videoWin.style.display = 'block';
    }
    if (demoVideo) {
      demoVideo.play().catch(function() {});
      if (fVideoPlayBtn) fVideoPlayBtn.innerHTML = '&#10074;&#10074;';
    }
  }

  /* ---------- Audio Flow Action ---------- */
  function triggerAudioFlow() {
    resetAll();
    setActiveChip(btnDemoAudio);
    smoothZoomToPeak();

    var targetP = document.getElementById('p4') || paragraphs[3] || paragraphs[0];
    if (targetP) {
      targetP.classList.add('is-selected-audio');
      lastSelectedText = targetP.textContent.trim();
      positionHudOverElement(targetP);
    }

    // Open Audio depth dialog
    if (audioDialog) {
      audioDialog.style.display = 'block';
    }
  }

  function openAudioWindow() {
    if (audioDialog) audioDialog.style.display = 'none';
    if (flowHud) flowHud.style.display = 'none';
    if (audioWin) {
      audioWin.style.display = 'block';
    }
    if (realAudio) {
      realAudio.play().catch(function() {});
      if (audioPlayBtn) audioPlayBtn.innerHTML = '&#10074;&#10074;';
      if (audioWaves) audioWaves.classList.add('is-playing');
    }
  }

  /* ---------- Voice Flow Action ---------- */
  function triggerVoiceFlow() {
    resetAll();
    setActiveChip(btnDemoVoice);
    smoothZoomToPeak();

    if (bottomPill) {
      bottomPill.classList.add('is-active-generating');
    }
    if (pillSpeakText) pillSpeakText.textContent = '🎙️ Listening (Speak freely)...';

    var sampleWords = [
      'This', 'app', 'eliminates', 'context', 'switching.',
      'Dictation', 'at', '145', 'words', 'per', 'minute',
      'straight', 'into', 'any', 'Windows', 'application.'
    ];
    var currentText = '';
    var wordIdx = 0;

    if (replyText) {
      replyText.textContent = '';
      replyText.classList.add('is-streaming');
    }

    function typeNext() {
      if (wordIdx < sampleWords.length) {
        currentText += (wordIdx > 0 ? ' ' : '') + sampleWords[wordIdx];
        if (replyText) replyText.textContent = currentText + ' |';
        wordIdx++;
        voiceTimer = setTimeout(typeNext, 120);
      } else {
        if (replyText) {
          replyText.textContent = currentText;
          replyText.classList.remove('is-streaming');
        }
        if (pillSpeakText) pillSpeakText.textContent = '✓ Polished & Pasted (145 WPM)';
        if (bottomPill) {
          bottomPill.classList.remove('is-active-generating');
          bottomPill.classList.add('is-ready');
        }
      }
    }

    voiceTimer = setTimeout(typeNext, 300);
  }

  function positionHudOverElement(el) {
    if (!flowHud || !el) return;
    var container = document.getElementById('browserWindow');
    if (!container) return;

    var cRect = container.getBoundingClientRect();
    var eRect = el.getBoundingClientRect();
    var scale = parseFloat(desktopFrame.style.getPropertyValue('--df-scale')) || 0.65;

    var top = (eRect.top - cRect.top) / scale - 36;
    var left = (eRect.left - cRect.left) / scale + 20;

    top = Math.max(50, top);
    left = Math.max(20, Math.min(left, container.offsetWidth - 260));

    flowHud.style.top = top + 'px';
    flowHud.style.left = left + 'px';
    flowHud.classList.remove('is-expanded');
    flowHud.classList.add('is-visible');
    flowHud.style.display = 'flex';
  }

  // Bind Quick Action Buttons
  if (btnDemoVideo) btnDemoVideo.addEventListener('click', triggerVideoFlow);
  if (btnDemoAudio) btnDemoAudio.addEventListener('click', triggerAudioFlow);
  if (btnDemoVoice) btnDemoVoice.addEventListener('click', triggerVoiceFlow);
  if (btnDemoReset) btnDemoReset.addEventListener('click', function() {
    resetAll();
    [btnDemoVideo, btnDemoAudio, btnDemoVoice].forEach(function(b) {
      if (b) b.classList.remove('is-active');
    });
  });

  // Bind Bottom Pill HUD Buttons directly inside the simulated OS
  if (pillBtnSpeak) pillBtnSpeak.addEventListener('click', triggerVoiceFlow);
  if (pillBtnVideo) pillBtnVideo.addEventListener('click', function(e) {
    e.stopPropagation();
    openVideoCreateModal();
  });

  // HUD Action items
  if (menuBtnVideo) menuBtnVideo.addEventListener('click', function(e) {
    e.stopPropagation();
    if (flowHud) flowHud.style.display = 'none';
    openVideoCreateModal();
  });
  if (menuBtnAudio) menuBtnAudio.addEventListener('click', function(e) {
    e.stopPropagation();
    if (audioDialog) audioDialog.style.display = 'block';
  });
  if (menuBtnRead) menuBtnRead.addEventListener('click', function(e) {
    e.stopPropagation();
    openAudioWindow();
  });

  // Close Windows
  if (btnVideoClose) btnVideoClose.addEventListener('click', function() {
    if (videoWin) videoWin.style.display = 'none';
    if (demoVideo) demoVideo.pause();
    if (bottomPill) {
      bottomPill.classList.remove('is-active-generating', 'is-ready');
    }
    if (pillVideoText) pillVideoText.textContent = '... Video';
  });
  var btnVideoCreateClose = document.getElementById('btnVideoCreateClose');
  if (btnVideoCreateClose) btnVideoCreateClose.addEventListener('click', function(e) {
    e.stopPropagation();
    var createModal = document.getElementById('videoCreateModal');
    if (createModal) createModal.style.display = 'none';
  });
  var btnGenerateVideoNow = document.getElementById('btnGenerateVideoNow');
  if (btnGenerateVideoNow) btnGenerateVideoNow.addEventListener('click', function(e) {
    e.stopPropagation();
    var createModal = document.getElementById('videoCreateModal');
    if (createModal) createModal.style.display = 'none';
    
    if (bottomPill) {
      bottomPill.classList.add('is-active-generating');
    }
    if (pillVideoText) pillVideoText.textContent = 'Generating 1080p Video...';

    genTimer = setTimeout(function() {
      if (flowHud) flowHud.style.display = 'none';
      if (bottomPill) {
        bottomPill.classList.remove('is-active-generating');
        bottomPill.classList.add('is-ready');
      }
      if (pillVideoText) pillVideoText.textContent = '✓ Video Ready';
      openVideoWindow();
    }, 600);
  });
  if (btnAudioClose) btnAudioClose.addEventListener('click', function() {
    if (audioWin) audioWin.style.display = 'none';
    if (realAudio) realAudio.pause();
  });
  if (btnAudioDialogClose) btnAudioDialogClose.addEventListener('click', function() {
    if (audioDialog) audioDialog.style.display = 'none';
  });

  if (btnGenerateAudio) btnGenerateAudio.addEventListener('click', openAudioWindow);

  // Depth Option Selection & Balanced Audio Trigger
  depthBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      depthBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  var btnBalanced = document.getElementById('btnBalanced');
  if (btnBalanced) {
    btnBalanced.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Close dialog & hud
      if (audioDialog) audioDialog.style.display = 'none';
      if (flowHud) {
        flowHud.style.display = 'none';
        flowHud.classList.remove('is-visible', 'is-expanded');
      }
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }

      // Switch bottom pill to active audio player: (🟠 Audio Flow | ❚❚ ■ ⚙ ✕ ⋮⋮)
      if (bottomPill) {
        bottomPill.classList.add('has-audio-player');
        
        // Hide regular pill buttons
        Array.from(bottomPill.children).forEach(function(c) {
          if (!c.classList.contains('audio-pill-temp')) {
            c.style.display = 'none';
          }
        });
        
        var existingAudio = bottomPill.querySelector('.audio-pill-temp');
        if (!existingAudio) {
          var audioWrap = document.createElement('div');
          audioWrap.className = 'audio-pill-temp';
          audioWrap.style.display = 'flex';
          audioWrap.style.alignItems = 'center';
          audioWrap.innerHTML = [
            '<button class=\"flow-pill-btn\" type=\"button\" style=\"color: #f97316; padding: 4px 10px; display:flex; align-items:center; gap:6px; font-weight:600; font-size:12px; border:none; background:none;\">',
            '  🟠 Audio Flow',
            '</button>',
            '<div class=\"flow-pill-divider\" style=\"background:#e5e7eb; width:1px; height:18px; margin:0 2px;\"></div>',
            '<button class=\"flow-pill-btn\" type=\"button\" style=\"color: #374151; padding: 4px 8px; border:none; background:none; font-size:13px; cursor:pointer;\" id=\"audioPillPlay\" title=\"Pause\">❚❚</button>',
            '<button class=\"flow-pill-btn\" type=\"button\" style=\"color: #374151; padding: 4px 8px; border:none; background:none; font-size:13px; cursor:pointer;\" id=\"audioPillStop\" title=\"Stop\">■</button>',
            '<button class=\"flow-pill-btn\" type=\"button\" style=\"color: #6b7280; padding: 4px 8px; border:none; background:none; font-size:13px; cursor:pointer;\" title=\"Settings\">⚙</button>',
            '<button class=\"flow-pill-btn\" type=\"button\" style=\"color: #6b7280; padding: 4px 8px; border:none; background:none; font-size:13px; cursor:pointer;\" id=\"audioPillClose\" title=\"Close\">✕</button>',
            '<button class=\"flow-pill-btn\" type=\"button\" style=\"color: #6b7280; padding: 4px 10px; border:none; background:none; font-size:13px; font-weight:800; cursor:pointer;\">⋮⋮</button>'
          ].join('');
          bottomPill.appendChild(audioWrap);
          
          var audioPillPlay = document.getElementById('audioPillPlay');
          var audioPillStop = document.getElementById('audioPillStop');
          var audioPillClose = document.getElementById('audioPillClose');

          if (audioPillPlay && realAudio) {
            audioPillPlay.addEventListener('click', function(ev) {
              ev.stopPropagation();
              if (realAudio.paused) {
                realAudio.play().catch(function(){});
                audioPillPlay.textContent = '❚❚';
              } else {
                realAudio.pause();
                audioPillPlay.textContent = '▶';
              }
            });
          }
          if (audioPillStop && realAudio) {
            audioPillStop.addEventListener('click', function(ev) {
              ev.stopPropagation();
              realAudio.pause();
              realAudio.currentTime = 0;
              if (audioPillPlay) audioPillPlay.textContent = '▶';
            });
          }
          if (audioPillClose) {
            audioPillClose.addEventListener('click', function(ev) {
              ev.stopPropagation();
              if (realAudio) {
                realAudio.pause();
                realAudio.currentTime = 0;
              }
              if (window.getSelection) {
                window.getSelection().removeAllRanges();
              }
              audioWrap.remove();
              bottomPill.classList.remove('has-audio-player', 'is-expanded', 'is-ready', 'is-active-generating');
              Array.from(bottomPill.children).forEach(function(c) {
                c.style.display = '';
              });
            });
          }
        } else {
          existingAudio.style.display = 'flex';
          var audioPillPlay = document.getElementById('audioPillPlay');
          if (audioPillPlay) audioPillPlay.textContent = '❚❚';
        }
      }
      
      // Play demo audio
      if (realAudio) {
        realAudio.currentTime = 0;
        realAudio.play().catch(function(){});
      }
    });
  }

  // Video Controls
  if (fVideoPlayBtn && demoVideo) {
    fVideoPlayBtn.addEventListener('click', function() {
      if (demoVideo.paused) {
        demoVideo.play();
        fVideoPlayBtn.innerHTML = '&#10074;&#10074;';
      } else {
        demoVideo.pause();
        fVideoPlayBtn.innerHTML = '&#9658;';
      }
    });
  }
  if (demoVideo) {
    demoVideo.addEventListener('timeupdate', function() {
      if (!demoVideo.duration) return;
      var pct = (demoVideo.currentTime / demoVideo.duration) * 100;
      if (fVideoTrack) fVideoTrack.style.width = pct + '%';
      var cMin = Math.floor(demoVideo.currentTime / 60);
      var cSec = Math.floor(demoVideo.currentTime % 60);
      var dMin = Math.floor(demoVideo.duration / 60);
      var dSec = Math.floor(demoVideo.duration % 60);
      if (fVideoTime) fVideoTime.textContent = cMin + ':' + (cSec < 10 ? '0' : '') + cSec + ' / ' + dMin + ':' + (dSec < 10 ? '0' : '') + dSec;
    });
    demoVideo.addEventListener('ended', function() {
      if (fVideoPlayBtn) fVideoPlayBtn.innerHTML = '&#9658;';
    });
  }
  if (fVideoScrubber && demoVideo) {
    fVideoScrubber.addEventListener('click', function(e) {
      var rect = fVideoScrubber.getBoundingClientRect();
      var pos = (e.clientX - rect.left) / rect.width;
      if (demoVideo.duration) demoVideo.currentTime = pos * demoVideo.duration;
    });
  }

  // Audio Controls
  if (audioPlayBtn && realAudio) {
    audioPlayBtn.addEventListener('click', function() {
      if (realAudio.paused) {
        realAudio.play();
        audioPlayBtn.innerHTML = '&#10074;&#10074;';
        if (audioWaves) audioWaves.classList.add('is-playing');
      } else {
        realAudio.pause();
        audioPlayBtn.innerHTML = '&#9658;';
        if (audioWaves) audioWaves.classList.remove('is-playing');
      }
    });
  }
  if (audioStepBack && realAudio) {
    audioStepBack.addEventListener('click', function() {
      realAudio.currentTime = Math.max(0, realAudio.currentTime - 5);
    });
  }
  if (audioStepFwd && realAudio) {
    audioStepFwd.addEventListener('click', function() {
      realAudio.currentTime = Math.min(realAudio.duration || 90, realAudio.currentTime + 5);
    });
  }
  if (realAudio) {
    realAudio.addEventListener('timeupdate', function() {
      var dur = realAudio.duration || 90;
      var cur = realAudio.currentTime || 0;
      var pct = (cur / dur) * 100;
      if (audioSeekerFill) audioSeekerFill.style.width = pct + '%';

      var cMin = Math.floor(cur / 60);
      var cSec = Math.floor(cur % 60);
      var dMin = Math.floor(dur / 60);
      var dSec = Math.floor(dur % 60);
      if (audioCurTime) audioCurTime.textContent = cMin + ':' + (cSec < 10 ? '0' : '') + cSec;
      if (audioTotTime) audioTotTime.textContent = dMin + ':' + (dSec < 10 ? '0' : '') + dSec;
    });
    realAudio.addEventListener('ended', function() {
      if (audioPlayBtn) audioPlayBtn.innerHTML = '&#9658;';
      if (audioWaves) audioWaves.classList.remove('is-playing');
      var audioPillPlay = document.getElementById('audioPillPlay');
      if (audioPillPlay) audioPillPlay.textContent = '▶';
    });
  }
  if (audioSeekerBar && realAudio) {
    audioSeekerBar.addEventListener('click', function(e) {
      var rect = audioSeekerBar.getBoundingClientRect();
      var pos = (e.clientX - rect.left) / rect.width;
      var dur = realAudio.duration || 90;
      realAudio.currentTime = pos * dur;
    });
  }
  speedChips.forEach(function(sc) {
    sc.addEventListener('click', function() {
      speedChips.forEach(function(x) { x.classList.remove('active'); });
      sc.classList.add('active');
      var spd = parseFloat(sc.getAttribute('data-speed')) || 1.0;
      if (realAudio) realAudio.playbackRate = spd;
    });
  });

  // Native mouse text selection inside the tweet article
  // Selecting text anywhere inside the tweet article dynamically spawns the 30x30 circular sunset audio flow trigger at the mouse selection endpoint
  if (articleCol) {
    articleCol.addEventListener('mouseup', function(e) {
      setTimeout(function() {
        var sel = window.getSelection();
        var text = sel ? sel.toString().trim() : '';
        if (text.length > 2) {
          lastSelectedText = text;
          var container = document.getElementById('browserWindow');
          if (!container || !flowHud) return;
          var cRect = container.getBoundingClientRect();
          var scale = parseFloat(desktopFrame.style.getPropertyValue('--df-scale')) || 0.65;

          var mouseX = e.clientX;
          var mouseY = e.clientY;

          if (!mouseX && sel.rangeCount > 0) {
            var rRect = sel.getRangeAt(0).getBoundingClientRect();
            mouseX = rRect.right;
            mouseY = rRect.bottom;
          }

          var relX = (mouseX - cRect.left) / scale;
          var relY = (mouseY - cRect.top) / scale;

          var posX = (relX + 38 > container.offsetWidth) ? (relX - 38) : (relX + 8);
          var posY = Math.max(45, Math.min(relY - 15, container.offsetHeight - 45));

          flowHud.style.left = posX + 'px';
          flowHud.style.top = posY + 'px';
          flowHud.classList.remove('is-expanded');
          flowHud.classList.add('is-visible');
          flowHud.style.display = 'flex';

        }
      }, 10);
    });

    // Dismiss floating trigger if user scrolls the tweet article
    articleCol.addEventListener('scroll', function() {
      if (flowHud && (!audioDialog || audioDialog.style.display === 'none')) {
        flowHud.style.display = 'none';
        flowHud.classList.remove('is-visible', 'is-expanded');
      }
    }, { passive: true });
  }

  // Hovering/clicking the floating trigger button reveals the Audio Flow action pill
  if (flowHud) {
    flowHud.addEventListener('click', function(e) {
      if (!e.target.closest('.flow-menu-btn')) {
        flowHud.classList.toggle('is-expanded');
      }
    });
    flowHud.addEventListener('mouseenter', function() {
      flowHud.classList.add('is-expanded');
    });
    flowHud.addEventListener('mouseleave', function() {
      if (!audioDialog || audioDialog.style.display === 'none') {
        flowHud.classList.remove('is-expanded');
      }
    });
  }

  // Dismiss HUD on click outside
  document.addEventListener('mousedown', function(e) {
    if (flowHud && !flowHud.contains(e.target) && !e.target.closest('#flowAudioDialog') && !e.target.closest('#videoCreateModal')) {
      setTimeout(function() {
        var sel = window.getSelection();
        if (!sel || !sel.toString().trim()) {
          flowHud.style.display = 'none';
          flowHud.classList.remove('is-visible', 'is-expanded');
          if (bottomPill && !bottomPill.classList.contains('is-active-generating') && !bottomPill.classList.contains('is-ready')) {
            bottomPill.classList.remove('is-expanded');
          }
        }
      }, 150);
    }
  });

  /* =========================================================================
     Scroll-Driven Interactive Desktop Zoom Controller
     Smooth Cubic Easing: Entry Zoom-In -> Screen Hold -> Exit Zoom-Out
     ========================================================================= */
  var demoTrack = document.getElementById('demo');
  var demoSticky = document.getElementById('demoSticky');
  var demoHeader = document.getElementById('demoHeader');
  var desktopFrame = document.getElementById('desktopFrame');

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateFrame);
    }
  }

  function updateFrame() {
    ticking = false;
    if (!demoTrack) return;
    var vh = window.innerHeight;
    var scrollDist = demoTrack.offsetHeight - vh;
    if (scrollDist <= 0) return;

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    var demoStart = demoTrack.offsetTop;
    var relScroll = Math.max(0, scrollTop - demoStart);
    var prog = Math.min(1, Math.max(0, relScroll / scrollDist));

    renderDemoZoom(prog);
  }

  function renderDemoZoom(prog) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var canvasW = 1200;
    var canvasH = 675;

    // Resting scale when header is visible
    var headerH = demoHeader ? demoHeader.offsetHeight : 220;
    var availRestingH = Math.max(220, vh - headerH - 24);
    var availRestingW = Math.min(880, vw - 32);
    var restingScale = Math.min(0.65, availRestingW / canvasW, availRestingH / canvasH);
    restingScale = Math.max(0.40, Math.min(0.65, restingScale));

    // Monitor peak zoom sizing with balanced breathing room on all sides
    var availPeakH = Math.max(300, vh - 24);
    var availPeakW = Math.max(320, vw - 36);
    var peakScale = Math.min(0.96, availPeakW / canvasW, availPeakH / canvasH);
    peakScale = Math.max(restingScale + 0.04, Math.min(0.96, peakScale));

    // Base untransformed top of desktopFrame relative to demoSticky
    var stage = document.getElementById('demoShowcaseStage');
    var frameBaseTop = stage ? stage.offsetTop : (demoHeader ? demoHeader.offsetHeight : 220);

    // Center vertically at peak zoom with perfectly balanced viewport margins
    var desiredPeakTop = Math.max(12, Math.round((vh - canvasH * peakScale) / 2));
    var targetY = desiredPeakTop - frameBaseTop;

    var z = 0;
    var curY = 0;
    var curScale = restingScale;

    if (prog < 0.35) {
      // Phase 1: Smooth Zoom In to desktop computer frame
      var pIn = prog / 0.35;
      z = easeInOutCubic(pIn);
      curScale = restingScale + (peakScale - restingScale) * z;
      curY = targetY * z;
    } else if (prog <= 0.70) {
      // Phase 2: Computer Screen Hold (Peak Zoom)
      z = 1.0;
      curScale = peakScale;
      curY = targetY;
    } else {
      // Phase 3: Centered Zoom Out to resting card
      var pOut = Math.min(1, (prog - 0.70) / 0.30);
      var easeOut = easeInOutCubic(pOut);
      z = 1.0 - easeOut;
      curScale = peakScale - (peakScale - restingScale) * easeOut;
      curY = targetY * (1 - easeOut);
    }

    // Header fade & translate
    if (demoHeader) {
      var headerProgress = Math.min(1, prog / 0.18);
      var headerOpacity = Math.max(0, 1 - headerProgress);
      var headerY = -headerProgress * 45;
      demoHeader.style.opacity = headerOpacity.toFixed(3);
      demoHeader.style.transform = 'translateY(' + headerY.toFixed(1) + 'px)';
      demoHeader.style.pointerEvents = headerOpacity < 0.2 ? 'none' : '';
    }

    // Nav fade during peak desktop monitor
    if (nav) {
      if (z > 0.05) {
        nav.style.opacity = Math.max(0, 1 - z * 2.2).toFixed(3);
        nav.style.pointerEvents = z > 0.3 ? 'none' : '';
      } else {
        nav.style.opacity = '';
        nav.style.pointerEvents = '';
      }
    }

    desktopFrame.style.setProperty('--df-scale', curScale.toFixed(4));
    desktopFrame.style.setProperty('--df-y', curY.toFixed(1) + 'px');
    desktopFrame.style.zIndex = prog > 0.05 ? '25' : '10';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  function scrollToDemoPeak(behavior) {
    if (!demoTrack) return;
    var vh = window.innerHeight;
    var scrollDist = demoTrack.offsetHeight - vh;
    if (scrollDist <= 0) return;
    var peakTarget = demoTrack.offsetTop + 0.45 * scrollDist;
    window.scrollTo({
      top: peakTarget,
      behavior: behavior || 'auto'
    });
    updateFrame();
  }

  // Handle nav links to #demo so they smoothly scroll directly to the centered peak desktop demo
  document.querySelectorAll('a[href="#demo"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToDemoPeak('smooth');
      if (history.pushState) {
        history.pushState(null, null, '#demo');
      } else {
        window.location.hash = '#demo';
      }
    });
  });

  window.addEventListener('hashchange', function() {
    if (window.location.hash === '#demo') {
      scrollToDemoPeak('smooth');
    }
  });

  function initDemoPosition() {
    onScroll();
    if (window.location.hash === '#demo') {
      scrollToDemoPeak('auto');
      setTimeout(function() { scrollToDemoPeak('auto'); }, 150);
      setTimeout(function() { scrollToDemoPeak('auto'); }, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoPosition);
  } else {
    initDemoPosition();
  }

  window.addEventListener('load', function() {
    onScroll();
    if (window.location.hash === '#demo') {
      scrollToDemoPeak('auto');
    }
  });
})();
