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
    { n: 1, slug: "0001-docker-just-enough", title: "Docker ровно настолько", available: true },
    { n: 2, slug: "0002-minikube-cluster", title: "Первый локальный кластер", available: false },
    { n: 3, slug: "0003-pod-deployment", title: "Pod и Deployment", available: false },
    { n: 4, slug: "0004-service", title: "Service", available: false },
    { n: 5, slug: "0005-configmap-secret", title: "ConfigMap и Secret", available: false },
    { n: 6, slug: "0006-health-probes", title: "Health-пробы", available: false },
    { n: 7, slug: "0007-ingress", title: "Ingress", available: false },
    { n: 8, slug: "0008-scaling-rollouts", title: "Масштабирование и обновления", available: false },
    { n: 9, slug: "0009-logs-debug", title: "Логи и отладка", available: false },
    { n: 10, slug: "0010-capstone-real-server", title: "Капстоун: реальный сервер", available: false }
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
      label.textContent = lesson.title;

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
    // Desktop ignores the open/closed state entirely (CSS unwraps <details>).
    var details = mount.closest("details.route-toggle");
    if (details && window.matchMedia("(max-width: 899px)").matches) {
      details.removeAttribute("open");
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();
