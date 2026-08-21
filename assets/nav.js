/*
 * Course route — the single source of truth for the lesson sequence.
 * Renders into <nav id="course-route" data-current="N" data-base="..."></nav>.
 *
 *   data-current  — number of the lesson this page IS (omit/0 on non-lesson pages)
 *   data-base     — relative path prefix to the lessons/ folder from this page
 *                    ("" from inside lessons/, "lessons/" from the site root,
 *                    "../lessons/" from reference/)
 *
 * Flip `available: true` here when a new lesson ships — every page's sidebar
 * updates itself, nothing else to touch.
 */
(function () {
  var LESSONS = [
    { n: 1, slug: "0001-docker-just-enough", title: "Docker ровно настолько", duration: "35–40 мин", available: true },
    { n: 2, slug: "0002-minikube-cluster", title: "Первый локальный кластер", duration: "30–40 мин", available: true },
    { n: 3, slug: "0003-pod-deployment", title: "Pod и Deployment", duration: "25–30 мин", available: true },
    { n: 4, slug: "0004-service", title: "Service", duration: "25–30 мин", available: false },
    { n: 5, slug: "0005-configmap-secret", title: "ConfigMap и Secret", duration: "30–35 мин", available: false },
    { n: 6, slug: "0006-health-probes", title: "Health-пробы", duration: "30–35 мин", available: false },
    { n: 7, slug: "0007-ingress", title: "Ingress", duration: "35–40 мин", available: false },
    { n: 8, slug: "0008-scaling-rollouts", title: "Масштабирование и обновления", duration: "25–30 мин", available: false },
    { n: 9, slug: "0009-logs-debug", title: "Логи и отладка", duration: "30–35 мин", available: false },
    { n: 10, slug: "0010-capstone-real-server", title: "Капстоун: реальный сервер", duration: "60–90 мин", available: false }
  ];

  /*
   * Reference docs — shared, growing companions used across many lessons
   * (not one-per-lesson). Renders into
   * <nav id="course-references" data-base="..."></nav>.
   * Flip `available: true` here when a reference doc ships.
   */
  var REFERENCES = [
    { slug: "docker-cheatsheet", title: "Docker", available: true },
    { slug: "kubectl-cheatsheet", title: "kubectl и манифесты", available: false }
  ];

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function render() {
    var mount = document.getElementById("course-route");
    if (!mount) return;

    var current = parseInt(mount.dataset.current || "0", 10);
    var base = mount.dataset.base || "";

    var progressEl = document.querySelector("[data-route-progress]");
    if (progressEl) {
      progressEl.textContent = current ? current + " / " + LESSONS.length : LESSONS.length + " уроков";
    }

    var ol = document.createElement("ol");
    ol.className = "route";

    var track = document.createElement("div");
    track.className = "route-track";
    ol.appendChild(track);

    var lastAvailable = -1;
    LESSONS.forEach(function (l, i) {
      if (l.available) lastAvailable = i;
    });
    var chartedPct = lastAvailable >= 0 ? ((lastAvailable + 0.5) / LESSONS.length) * 100 : 0;

    var progressLine = document.createElement("div");
    progressLine.className = "route-track-charted";
    track.appendChild(progressLine);

    LESSONS.forEach(function (lesson) {
      var li = document.createElement("li");
      li.className = "route-stop";
      if (lesson.n === current) li.classList.add("is-current");
      if (!lesson.available) li.classList.add("is-locked");

      var dot = document.createElement("span");
      dot.className = "route-dot";
      dot.setAttribute("aria-hidden", "true");

      var num = document.createElement("span");
      num.className = "route-num";
      num.textContent = pad(lesson.n);

      var label;
      if (lesson.available && lesson.n !== current) {
        label = document.createElement("a");
        label.href = base + lesson.slug + ".html";
      } else {
        label = document.createElement("span");
      }
      label.className = "route-label";
      label.appendChild(document.createTextNode(lesson.title));

      var duration = document.createElement("span");
      duration.className = "route-duration";
      duration.textContent = "(" + lesson.duration + ")";
      label.appendChild(duration);

      li.appendChild(dot);
      li.appendChild(num);
      li.appendChild(label);

      if (!lesson.available) {
        var soon = document.createElement("span");
        soon.className = "route-soon";
        soon.textContent = "скоро";
        li.appendChild(soon);
      }

      ol.appendChild(li);
    });

    mount.appendChild(ol);

    // Draw the charted (available) portion of the course line after mount,
    // so its height can be measured against the rendered list.
    requestAnimationFrame(function () {
      progressLine.style.height = chartedPct + "%";
    });

    // On narrow viewports the route list opens collapsed by default so the
    // lesson content isn't pushed below a 10-item list on first paint.
    var details = mount.closest("details.route-toggle");
    var desktopQuery = window.matchMedia("(min-width: 900px)");
    if (details && !desktopQuery.matches) {
      details.removeAttribute("open");
    }

    // Desktop CSS unwraps <details> visually (display:contents) and hides
    // the toggle button, but a closed <details> still natively hides its
    // content regardless of that CSS — the browser doesn't know the summary
    // is invisible. Without this, closing the list on mobile and then
    // widening the window leaves the route list stuck invisible with no
    // way to reopen it. Force it open whenever the viewport crosses into
    // the desktop breakpoint, since there's no visible toggle there anyway.
    if (details) {
      desktopQuery.addEventListener("change", function (e) {
        if (e.matches) details.setAttribute("open", "");
      });
    }
  }

  function renderReferences() {
    var mount = document.getElementById("course-references");
    if (!mount) return;
    var base = mount.dataset.base || "";

    var ul = document.createElement("ul");
    ul.className = "ref-list";

    REFERENCES.forEach(function (ref) {
      var li = document.createElement("li");
      if (ref.available) {
        var a = document.createElement("a");
        a.href = base + ref.slug + ".html";
        a.textContent = ref.title;
        li.appendChild(a);
      } else {
        var span = document.createElement("span");
        span.className = "ref-locked";
        span.textContent = ref.title;
        li.appendChild(span);
        var soon = document.createElement("span");
        soon.className = "ref-soon";
        soon.textContent = "скоро";
        li.appendChild(soon);
      }
      ul.appendChild(li);
    });

    mount.appendChild(ul);
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    renderReferences();
  });
})();
