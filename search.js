(function () {
  function getSearchEntryButton() {
    var desktop = document.getElementById('search-bar-entry');
    if (desktop instanceof HTMLElement && desktop.offsetParent !== null) {
      return desktop;
    }
    var mobile = document.getElementById('search-bar-entry-mobile');
    if (mobile instanceof HTMLElement) {
      return mobile;
    }
    return desktop instanceof HTMLElement ? desktop : null;
  }

  function getAssistantEntryButton() {
    var desktop = document.getElementById('assistant-entry');
    if (desktop instanceof HTMLElement && desktop.offsetParent !== null) {
      return desktop;
    }
    var mobile = document.getElementById('assistant-entry-mobile');
    if (mobile instanceof HTMLElement && mobile.offsetParent !== null) {
      return mobile;
    }
    if (desktop instanceof HTMLElement) {
      return desktop;
    }
    var m = document.getElementById('assistant-entry-mobile');
    return m instanceof HTMLElement ? m : null;
  }

  function openSearch() {
    getSearchEntryButton()?.click();
  }

  function openAssistant() {
    getAssistantEntryButton()?.click();
  }

  function setNativeInputValue(input, value) {
    var desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    if (desc && desc.set) {
      desc.set.call(input, value);
    } else {
      input.value = value;
    }
  }

  function fillSearchInput(term) {
    var maxAttempts = 40;

    function tryFill(attempt) {
      var el = document.getElementById('search-input');
      if (el instanceof HTMLInputElement) {
        setNativeInputValue(el, term);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.focus();
        return;
      }
      if (attempt < maxAttempts) {
        window.setTimeout(function () {
          tryFill(attempt + 1);
        }, 50);
      }
    }

    window.requestAnimationFrame(function () {
      tryFill(0);
    });
  }

  function normalizeExamUrl(raw) {
    var v = (raw || '').trim();
    if (!v) {
      return null;
    }
    if (/^https?:\/\//i.test(v)) {
      return v;
    }
    v = v.replace(/^\/+/, '').replace(/^t\//i, '');
    if (/^[\w.-]+\.[a-z]{2,}\//i.test(v)) {
      return 'https://' + v;
    }
    return 'https://www.proctorly.co/t/' + encodeURIComponent(v);
  }

  function startExam() {
    var input = document.getElementById('ptly-code');
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    var url = normalizeExamUrl(input.value);
    if (!url) {
      input.focus();
      return;
    }
    window.location.href = url;
  }

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t instanceof HTMLInputElement && t.id === 'ptly-code' && e.key === 'Enter') {
      e.preventDefault();
      startExam();
    }
  });

  document.addEventListener('click', function (e) {
    var target = e.target;
    if (!(target instanceof Element)) {
      return;
    }

    var startBtn = target.closest('[data-ptly-start]');
    if (startBtn) {
      e.preventDefault();
      startExam();
      return;
    }

    var trigger = target.closest('[data-search-trigger]');
    if (trigger) {
      e.preventDefault();
      openSearch();
      return;
    }

    var assistantTrigger = target.closest('[data-assistant-trigger]');
    if (assistantTrigger) {
      e.preventDefault();
      openAssistant();
      return;
    }

    var popular = target.closest('[data-popular-search]');
    if (popular) {
      e.preventDefault();
      var term = popular.getAttribute('data-term') || '';
      openSearch();
      if (term) {
        fillSearchInput(term);
      }
    }
  });
})();
