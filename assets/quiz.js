/*
 * Reusable quiz widget for the "Kubernetes на практике" lesson series.
 * Two quiz types, driven entirely by markup — no per-lesson JS needed:
 *
 * 1. Multiple choice:
 *    <div class="quiz" data-quiz="mc">
 *      <p class="quiz-question">Вопрос?</p>
 *      <label class="quiz-option"><input type="radio" name="q1" value="a" data-correct="true"> вариант</label>
 *      <label class="quiz-option"><input type="radio" name="q1" value="b"> вариант</label>
 *      <button class="quiz-check">Проверить</button>
 *      <p class="quiz-feedback" hidden></p>
 *    </div>
 *
 * 2. Recall (type the answer):
 *    <div class="quiz quiz-recall" data-quiz="recall" data-answer="docker build -t myapp .|docker build -t myapp:latest .">
 *      <p class="quiz-question">Команда, которая соберёт образ myapp из текущей папки:</p>
 *      <input type="text" class="quiz-input" placeholder="docker ...">
 *      <button class="quiz-check">Проверить</button>
 *      <p class="quiz-feedback" hidden></p>
 *    </div>
 *    data-answer accepts one or more acceptable answers separated by "|" (case/space-insensitive match).
 */
(function () {
  function showFeedback(el, ok, correctText) {
    el.hidden = false;
    el.className = "quiz-feedback " + (ok ? "correct" : "incorrect");
    if (ok) {
      el.textContent = "Верно.";
    } else {
      el.textContent = correctText
        ? "Не совсем. Правильный вариант: " + correctText
        : "Не совсем, попробуйте ещё раз.";
    }
  }

  function normalize(str) {
    return str.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function initMultipleChoice(quiz) {
    var button = quiz.querySelector(".quiz-check");
    var feedback = quiz.querySelector(".quiz-feedback");
    if (!button || !feedback) return;
    button.addEventListener("click", function () {
      var checked = quiz.querySelector('input[type="radio"]:checked');
      if (!checked) {
        showFeedback(feedback, false, null);
        feedback.textContent = "Выберите вариант ответа.";
        feedback.className = "quiz-feedback incorrect";
        feedback.hidden = false;
        return;
      }
      var ok = checked.dataset.correct === "true";
      var correctInput = quiz.querySelector('input[data-correct="true"]');
      var correctLabel = correctInput ? correctInput.closest(".quiz-option") : null;
      var correctText = correctLabel ? correctLabel.textContent.trim() : null;
      showFeedback(feedback, ok, correctText);
    });
  }

  function initRecall(quiz) {
    var button = quiz.querySelector(".quiz-check");
    var feedback = quiz.querySelector(".quiz-feedback");
    var input = quiz.querySelector(".quiz-input");
    var answers = (quiz.dataset.answer || "").split("|").map(normalize).filter(Boolean);
    if (!button || !feedback || !input) return;
    button.addEventListener("click", function () {
      var ok = answers.indexOf(normalize(input.value)) !== -1;
      showFeedback(feedback, ok, answers[0]);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") button.click();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[data-quiz="mc"]').forEach(initMultipleChoice);
    document.querySelectorAll('[data-quiz="recall"]').forEach(initRecall);
  });
})();
