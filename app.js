class Model {
  constructor() {
    this.questions = [
      {
        q: "Which company developed JavaScript?",
        options: ["Netscape", "Facebook", "Google", "I don't care"],
        correct: 0,
        points: 60,
      },
      {
        q: "Which type of JavaScript language is ...?",
        options: [
          "Object Oriented",
          "Object-Based",
          "Assembly-language",
          "High-level",
        ],
        correct: 1,
        points: 70,
      },
      {
        q: `The "function" and " var" are known as`,
        options: [
          "Keywords",
          "Data types",
          "Declaration statements",
          "Prototypes",
        ],
        correct: 0,
        points: 80,
      },
      {
        q: "Which is not a data type in JavaScript",
        options: ["Number", "Float", "String", "Boolean"],
        correct: 1,
        points: 90,
      },
      {
        q: "The order for css box model...?",
        options: [
          "Content Margin Padding Border",
          "Content Padding Margin Border",
          "Content Padding Border Margin",
          "Content Border Pading Margin",
        ],
        correct: 2,
        points: 100,
      },
      {
        q: "Which is not a way to create variables in JavaScript (in browser) ?",
        options: ["window.x = 10;", "this.x = 10;", "x = 10;", "None of these"],
        correct: 3,
        points: 110,
      },
      {
        q: `Which will delete the property in following Object
        <pre>let student = { age: 20, batch: "A" }</pre>
        `,
        options: [
          "Delete student.age;",
          "delete student.age;",
          "student.age.delete()",
          "Both A and B",
        ],
        correct: 1,
        points: 120,
      },
      {
        q: "In CSS, the margin/padding shorthand goes like",
        options: [
          "Top Left Bottom Right",
          "Top Bottom Right Left",
          "Top Right Bottom Left",
          "None of These",
        ],
        correct: 2,
        points: 130,
      },
      {
        q: "which method executes a function for each value of an array and returns a single value which is the function's accumulated result.",
        options: ["reduce", "map", "filter", "forEach"],
        correct: 0,
        points: 140,
      },
      {
        q: "Which is false...?",
        options: [
          `"" == false`,
          "NaN ==  NaN",
          "NaN == undefind",
          "false === false",
        ],
        correct: 1,
        points: 150,
      },
      {
        q: "Which method calls the function for each element of the array and returns the array of results.",
        options: ["reduce", "forEach", "filter", "map"],
        correct: 3,
        points: 160,
      },
      {
        q: "What is 100/0 in JavaScipt...?",
        options: ["NaN", "0", "undefined", "Infinity"],
        correct: 3,
        points: 170,
      },
      {
        q: `What is the return value of this function if we pass 2...?
        <pre>
        function x(i) {
          i++;
          (x = 4 - i) && --x;
          return x;
        }</pre>`,
        options: ["1", "0", "undefined", "Error"],
        correct: 1,
        points: 180,
      },
      {
        q: `The output of following code is <pre>
        let x = 5 , obj = { x: 10 };
        with (obj) {
          console.log(x);
        }</pre>
        `,
        options: ["5", "10", "{ x: 10 }", "None of these"],
        correct: 1,
        points: 190,
      },
      {
        q: `The return value of unary operator(+) if passed a invalid string ?
        <pre>console.log(+"Invalid string");</pre>`,
        options: ["undefined", "NaN", "0", "None of these"],
        correct: 2,
        points: 250,
      },
    ];
    this.isGameOver = false;
    this.attempts = 0;
    this.totalPoints = 0;
    this.questions.forEach((e, i) => {
      e.id = i;
      e.selected = -1;
      this.totalPoints += e.points;
    });
    this.points = 0;
    this.corrected = 0;
    this.currentIndex = 0;
  }
  get state() {
    return {
      questions: this.questions,
      attempts: this.attempts,
      totalPoints: this.totalPoints,
      currentIndex: this.currentIndex,
      points: this.points,
      corrected: this.corrected,
    };
  }
  set state(obj) {
    objectForEach(obj, (x, y) => {
      this[x] = y;
    });
  }
  get question() {
    return this.questions[this.currentIndex];
  }
  get result() {
    return `
    Score : ${this.points}/${this.totalPoints} <br>
    Correct : ${this.corrected}/${this.attempts} <br>
    Attempted : ${this.attempts}/${this.questions.length} <br>
    `;
  }
  get AllQuestionsAsText() {
    return `
    ${this.questions
      .map((e) => {
        return `<br>
        ${e.id + 1}. ${e.q}<br> 
          1. ${e.options[0]}
          2. ${e.options[1]}<br>
          3. ${e.options[2]}
          4. ${e.options[3]}<br>
        correct : ${e.correct + 1}<br>
        `;
      })
      .join(" ")}
    `;
  }
  goToQuestion(i) {
    if (i > this.attempts || (i === -1 && this.attempts !== 15))
      return alert(
        `Please Select One Option for Question ${this.attempts + 1}!!`
      );
    else if (i === -1) this.currentIndex = this.questions.length - 1;
    else if (i < this.questions.length) this.currentIndex = i;
    else if (!i) return this.question;
    else this.currentIndex = 0;
    return this.question;
  }
  getQuestionTo(to) {
    return this.goToQuestion(this.currentIndex + to);
  }
  checkAnswer(id) {
    this.attempts++;
    this.questions[this.currentIndex].selected = id;
    let isCorrect = this.question.correct === id;
    if (isCorrect) {
      this.points += this.question.points;
      this.corrected += 1;
    } else this.isGameOver = true;
    return isCorrect;
  }
  saveState() {
    ls.item("state", this.state);
  }
  resetQuiz() {
    this.points = 0;
    this.corrected = 0;
    this.currentIndex = 0;
    this.attempts = 0;
    this.questions.forEach((e) => (e.selected = -1));
  }
}
class View {
  constructor() {
    this.wrapper = $(".wrapper");
    this.totalCorrected = $("#totalCorrected");
    this.totalPoints = $("#totalPoints");
    this.showQ = $("#showQ");
    this.optionBtns = $(".optionsDiv button");
    this.questionTraker = $(".questionTraker");
    this.page = $(".page");
  }
  // utility
  addClassTo(el, i, className) {
    el.select(i).addClass(className);
  }
  // questionTraker
  paintQuestionTraker(ques, func) {
    ques.forEach(({ points, correct, selected }, i) => {
      let div = $$("div", this.questionTraker)
        .html(`${i + 1} : ${points} Points`)
        .click(() => func(i));
      if (selected !== -1)
        div.addClass(correct === selected ? "corrected" : "wrong");
    });
    this.questionTrakerDivs = this.questionTraker.child();
  }
  updateQuestionTraker(q) {
    this.addClassTo(
      this.questionTrakerDivs,
      q.id,
      q.correct === q.selected ? "corrected" : "wrong"
    );
  }
  //optionBtns
  disableOptionBtns(boolean = true) {
    return this.optionBtns.disable(boolean);
  }
  resetOptionBtns() {
    this.disableOptionBtns(false).removeClass("selected", "corrected");
  }
  onOptionClick(func) {
    this.optionBtns.click((e) => {
      this.disableOptionBtns();
      func(+e.target.id);
    });
  }
  // question
  showQuestion(que) {
    if (!que) return;
    let { q, options, correct, selected, id } = que;
    this.resetOptionBtns();
    this.showQ.html(`${id + 1}. ${q}`);
    this.optionBtns.forEach((e, i) => e.html(options[i]));
    this.updateQuestion(correct, selected);
    // select qt
    this.questionTrakerDivs.removeClass("selected");
    this.addClassTo(this.questionTrakerDivs, id, "selected");
  }
  updateQuestion(correct, selected) {
    if (selected !== -1) this.disableOptionBtns();
    console.log("updateQ", this.optionBtns, selected, correct);
    if (selected === correct) {
      this.addClassTo(this.optionBtns, selected, "corrected");
    } else if (selected !== -1) {
      this.addClassTo(this.optionBtns, selected, "selected");
      this.addClassTo(this.optionBtns, correct, "corrected");
    }
  }
  // scoreboard
  updateScoreBoard(corrected, points, totalQuestions, totalPoints) {
    this.totalCorrected.html(`Correct : ${corrected}/${totalQuestions}`);
    this.totalPoints.html(`Points : ${points}/${totalPoints}`);
  }
  // modals
  hideModal(boolean = true, text) {
    this.wrapper.hide(boolean, "flex");
    if (!boolean) $(".modal").html(text);
  }
  // events
  onClickHideScreen() {
    $("#startBtn").click(() => $(".startScreen").hide());
  }
  viewShortcuts() {
    $("#viewShortBtn").click(() =>
      this.hideModal(
        false,
        `
        <p style="text-align:center;">Keyboard Shortcuts</p> 
        <span class"view-short">
        Right Arrow, Down Arrow : Next Question <br>
        Left Arrow, Top Arrow : Previous Question <br>
        1, 2, 3, 4 : Select Option <br>
        </span>
        <button onclick="$('.startScreen,.wrapper').hide()">Start Quiz</button>
        `
      )
    );
  }
  submit(getResult) {
    this.hideModal(
      false,
      `
      <p style="text-align:center;">Quiz Over</p> 
      <span class="showResult">${getResult()}</span>
      <button id="resetBtn">Reset</button>
      <button id="getAllQBtn">Get All Questions</button>
    `
    );
  }
  showPage(boolean) {
    return this.page.hide(!boolean);
  }
  onPageClick(text) {
    $("#getAllQBtn").click(() => {
      $(".container").hide();
      this.showPage(true).html(
        text + `<button onclick="window.print()">Print or Save as PDF</button>`
      );
    });
  }
  onReset(func) {
    $("#resetBtn").click(() => {
      this.hideModal();
      $(...this.questionTrakerDivs.els, ...this.optionBtns.els).removeClass(
        "selected",
        "corrected",
        "wrong"
      );
      if (func) func();
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.startApp();
  }
  startApp() {
    this.useLocalStorage();
    this.view.showPage(false);
    this.view.hideModal();
    this.view.viewShortcuts();
    this.bindPaintQuestionTraker();
    this.bindUpdateScoreBoard();
    this.bindShowQuestion();
    // events
    this.view.onClickHideScreen();
    this.bindOnOptionClick();
    $("#nextBtn").click(() => this.bindOnClick(1));
    $("#prevBtn").click(() => this.bindOnClick(-1));
    this.addBeforeUnload();
    this.addKeyboardEvents();
  }
  bindShowQuestion(i) {
    this.view.showQuestion(this.model.goToQuestion(i));
  }
  bindUpdateScoreBoard() {
    this.view.updateScoreBoard(
      this.model.corrected,
      this.model.points,
      this.model.questions.length,
      this.model.totalPoints
    );
  }
  bindPaintQuestionTraker() {
    this.view.paintQuestionTraker(this.model.questions, (i) =>
      this.bindShowQuestion(i)
    );
  }
  bindOnClick(to) {
    this.view.showQuestion(this.model.getQuestionTo(to));
  }
  bindOnOptionClick() {
    this.view.onOptionClick((id) => {
      let isCorrect = this.model.checkAnswer(id);
      this.view.updateQuestion(this.model.question.correct, id);
      if (!isCorrect || this.model.attempts === 15) {
        this.view.submit(() => this.model.result);
        this.model.resetQuiz();
        this.bindOnResetQuiz();
        this.view.onPageClick(this.model.AllQuestionsAsText);
      }
      this.bindUpdateScoreBoard();
      this.view.updateQuestionTraker(this.model.question);
    });
  }
  addBeforeUnload() {
    on("beforeunload", () => {
      if (this.model.isGameOver) this.model.resetQuiz();
      this.model.saveState();
    });
  }
  addKeyboardEvents() {
    on("keydown", (e) => {
      switch (e.key) {
        case "1":
        case "2":
        case "3":
        case "4":
          this.view.optionBtns.els[+e.key - 1].click();
          break;
        case "ArrowRight":
        case "ArrowDown":
          this.bindOnClick(1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          this.bindOnClick(-1);
          break;
      }
    });
  }
  bindOnResetQuiz() {
    this.view.onReset(() => {
      this.bindUpdateScoreBoard();
      this.bindShowQuestion();
    });
  }
  useLocalStorage() {
    let tempState = ls.item("state");
    if (tempState) this.model.state = tempState;
    else ls.item("state", this.model.state);
  }
}

const app = new Controller(new Model(), new View());
