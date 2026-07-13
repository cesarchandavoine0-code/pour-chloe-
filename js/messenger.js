/* ═══════════════════════════════════════════════
   MESSENGER — mots privés (persistés dans ce navigateur)
   ═══════════════════════════════════════════════ */
window.Messenger = (function () {
  var STORAGE_KEY = 'chloe-messages';
  var PIN_OWNER = '2008';

  var currentUser = 'Chloé';
  var messages = [];
  var msgOpen = false;
  var lastSeenCount = 0;

  function loadMessages() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      messages = raw ? JSON.parse(raw) : [];
    } catch (e) {
      messages = [];
    }
  }

  function saveMessages() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      window.App && window.App.toast('Impossible de sauvegarder le message');
    }
  }

  function formatTime(ts) {
    var d = new Date(ts);
    var h = d.getHours(), mn = d.getMinutes();
    return (h < 10 ? '0' : '') + h + 'h' + (mn < 10 ? '0' : '') + mn;
  }

  function renderMessages() {
    var list = document.getElementById('msg-list');
    if (messages.length === 0) {
      list.innerHTML = '<div class="msg-empty">✦<br>Vos premiers mots<br>s\'écriront ici…</div>';
      return;
    }
    list.innerHTML = '';
    messages.forEach(function (msg) {
      var isMe = msg.author === currentUser;
      var bubble = document.createElement('div');
      bubble.className = 'msg-bubble ' + (isMe ? 'me' : 'her');
      var sender = document.createElement('div');
      sender.className = 'msg-sender';
      sender.textContent = msg.author;
      var text = document.createElement('div');
      text.className = 'msg-text';
      text.textContent = msg.text;
      var time = document.createElement('div');
      time.className = 'msg-time';
      time.textContent = formatTime(msg.ts);
      bubble.appendChild(sender);
      bubble.appendChild(text);
      bubble.appendChild(time);
      list.appendChild(bubble);
    });
    list.scrollTop = list.scrollHeight;
  }

  function updateBadge() {
    var badge = document.getElementById('msg-badge');
    var unread = messages.length - lastSeenCount;
    if (!msgOpen && unread > 0) {
      badge.style.display = 'flex';
      badge.textContent = unread > 9 ? '9+' : unread;
    } else {
      badge.style.display = 'none';
    }
  }

  function openMsg() {
    msgOpen = true;
    document.getElementById('msg-wrap').classList.add('on');
    loadMessages();
    renderMessages();
    lastSeenCount = messages.length;
    updateBadge();
  }

  function closeMsg() {
    msgOpen = false;
    lastSeenCount = messages.length;
    document.getElementById('msg-wrap').classList.remove('on');
    updateBadge();
  }

  function sendMsg() {
    var ta = document.getElementById('msg-textarea');
    var text = ta.value.trim();
    if (!text) return;
    messages.push({ author: currentUser, text: text, ts: Date.now() });
    saveMessages();
    ta.value = '';
    ta.style.height = 'auto';
    renderMessages();
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
    requestAnimationFrame(function () {
      var ta = document.getElementById('msg-textarea');
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 110) + 'px';
    });
  }

  function switchIdentity() {
    if (currentUser !== 'Chloé') {
      currentUser = 'Chloé';
      document.getElementById('identity-name').textContent = 'Chloé';
      window.App && window.App.toast('Connecté en tant que Chloé ♥');
      renderMessages();
    } else {
      window.Pin.request({
        code: PIN_OWNER,
        title: 'Code secret',
        sub: 'Entrez votre PIN à 4 chiffres',
        onSuccess: function () {
          currentUser = 'Lui ♥';
          document.getElementById('identity-name').textContent = 'Lui ♥';
          window.App && window.App.toast('Mode expéditeur activé ♥');
          renderMessages();
        }
      });
    }
  }

  function init() {
    document.getElementById('btn-msg').addEventListener('click', openMsg);
    document.getElementById('msg-bg').addEventListener('click', closeMsg);
    document.querySelector('.btn-close-msg').addEventListener('click', closeMsg);
    document.getElementById('btn-send').addEventListener('click', sendMsg);
    document.getElementById('msg-textarea').addEventListener('keydown', handleKey);
    document.getElementById('btn-switch-id').addEventListener('click', switchIdentity);

    loadMessages();
    updateBadge();
  }

  return { init: init };
})();
