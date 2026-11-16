// Shared diagnostics panel for the MP-4895 embed test pages.
// Shows every consent message between this page and the embedded form, and every error on this page.
(function () {
  var panel = document.createElement('div');
  panel.id = 'diag';
  panel.innerHTML = '<strong>Diagnostics (this page)</strong> <button type="button" id="diag-reset">Reset this site\'s choice</button><ol id="diag-log"></ol>' +
    '<p class="hint">The form remembers its own choice separately. To start fresh, open this page in a new private / incognito window.</p>';
  function log(kind, text) {
    var list = document.getElementById('diag-log');
    if (!list) return;
    var li = document.createElement('li');
    li.className = kind;
    li.textContent = new Date().toLocaleTimeString() + '  ' + text;
    list.appendChild(li);
  }
  window.diagLog = log;
  window.addEventListener('error', function (e) { log('error', 'ERROR on this page: ' + e.message); });
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || typeof d.type !== 'string' || d.type.indexOf('ctl-') !== 0) return;
    log('msg', 'Form → page: ' + JSON.stringify(d));
  });
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(panel);
    document.getElementById('diag-reset').onclick = function () {
      try { localStorage.removeItem('host-consent'); } catch (e) {}
      location.reload();
    };
  });
})();
