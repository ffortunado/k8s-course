/*
 * Copy-to-clipboard for code in the "Kubernetes на практике" lesson series.
 * Zero markup required:
 *   - every <pre> block gets a "Копировать" button automatically
 *   - inline single-line commands (e.g. in cheat-sheet tables) opt in with class="cmd":
 *       <code class="cmd">docker ps</code>
 *     click-to-copy, with the same visual feedback.
 */
(function () {
  function flash(el, label) {
    var original = el.dataset.label || el.textContent;
    el.textContent = label;
    el.classList.add("copied");
    setTimeout(function () {
      el.textContent = original;
      el.classList.remove("copied");
    }, 1200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function wrapPre(pre) {
    if (pre.closest(".pre-wrap")) return;
    var wrap = document.createElement("div");
    wrap.className = "pre-wrap";
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.dataset.label = "Копировать";
    btn.textContent = "Копировать";
    btn.addEventListener("click", function () {
      copyText(pre.innerText).then(function () {
        flash(btn, "Скопировано");
      });
    });
    wrap.appendChild(btn);
  }

  function wrapInlineCommand(code) {
    code.classList.add("copyable");
    code.title = "Нажмите, чтобы скопировать";
    code.addEventListener("click", function () {
      copyText(code.textContent).then(function () {
        code.classList.add("copied-flash");
        setTimeout(function () { code.classList.remove("copied-flash"); }, 900);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("pre").forEach(wrapPre);
    document.querySelectorAll("code.cmd").forEach(wrapInlineCommand);
  });
})();
