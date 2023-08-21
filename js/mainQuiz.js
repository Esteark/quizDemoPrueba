const urlMainQuiz = "https://quizdemoback-production.up.railway.app/questions";
let questions = [];
let answers = [];
let counterQuestion = 1;
let answerClick = "";
let isUserClick = false;
let intervalo;

// capturo toda la sección del formulario
const quizMain = document.getElementById("quizMain");
const results = document.getElementById("results");
const answersSummary = document.getElementById("answersSummary");
const lblscore = document.getElementById("lblscore");
const lblscoreLocal = document.getElementById("lblscoreLocal");

//Función que me lleva el puntaje al localStorage
const goTolocalScore = (total) => {
  let OldScore = Number(localStorage.getItem("scoreQuizMain"));
  if (total > OldScore) {
    localStorage.setItem("scoreQuizMain", total);
    OldScore = total;
  }
  return OldScore;
};
const paintScores = () => {
  answersSummary.innerHTML = "";
  let totalScore = 0;

  answers.forEach((item) => {
    let errorContent = "";
    if (!item.isCorrect) {
      errorContent = `<p>Respuesta correcta: <span>${item.correct}</span>  </p>`;
    }
    answersSummary.innerHTML += `<div>
          <img src="${
            item.isCorrect ? "../img/correct.png" : "../img/error.png"
          }" alt="" />
          <h3>${item.question}</h3>
          <p>Respuesta elegida: <span>${item.answer}</span></p>
          ${errorContent}
        </div>
        <hr />`;
    totalScore += item.score;
  });
  lblscore.innerHTML = totalScore;
  lblscoreLocal.innerHTML = goTolocalScore(totalScore);
};

//Funcion que me oculta el contenido principal del cuestionario y me muestra el contenido del resumne de puntaje
const showResults = () => {
  quizMain.classList.add("hidden");
  results.classList.remove("hidden");
  paintScores();
};
// Codigo para obtener las preguntas desde la API
const getQuestions = async () => {
  try {
    const { data } = await axios.get(urlMainQuiz);
    questions = data;
  } catch (error) {
    console.log(error);
  }
};
//Codigo para la animación de la barra de tiempo
const bar = new ProgressBar.Line(container, {
  strokeWidth: 4,
  easing: "easeInOut",
  duration: 10000,
  color: "#FFEA82",
  trailColor: "#eee",
  trailWidth: 1,
  svgStyle: { width: "100%", height: "8px" },
  from: { color: "#9c88ff" },
  to: { color: "#8c7ae6" },
  step: (state, bar) => {
    bar.path.setAttribute("stroke", state.color);
  },
});
const startAnimation = () => {
  bar.set(0); // Establecer el valor inicial
  bar.animate(1.0); // Comenzar la animación nuevamente
};

// Notificacion
const Notify = (mensaje, tipo) => {
  Toastify({
    text: `${mensaje}`,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: `${
        tipo !== "" ? (tipo == "correcto" ? "#8c7ae6" : "#c23616") : "#c23616"
      }`,
    },
    onClick: function () {}, // Callback after click
  }).showToast();
};

//Boton de regreso
const imgBack = document.getElementById("imgBack");
const imgBackScore = document.getElementById("imgBackScore");

imgBackScore.addEventListener("click", () => {
  window.location.href = "../index.html";
});

imgBack.addEventListener("click", () => {
  Swal.fire({
    title: "¿Quieres regresar al menú principal?",
    showDenyButton: true,
    confirmButtonText: "Si",
    denyButtonText: `No`,
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "../index.html";
    }
  });
});

// Acciones para la seccion de las preguntas
const secPreguntas = document.getElementById("questions");
const txtQuestion = document.getElementById("txtQuestion");
const lblcounter = document.getElementById("counter");

//Función para poner o quitar la clase active (El color purpura de fondo en los botones)
const deletePutClassActive = (idElement) => {
  Array.from(secPreguntas.children).forEach((item) => {
    if (idElement !== item.id) {
      item.classList.remove("active");
    } else {
      item.classList.add("active");
    }
  });
};

//Funcion para verificar la respuesta elegida
const verifyAnswer = (resp) => {
  //Muestra el mensaje al usuario para indicarle si su respuesta fue correcta o incorrecta
  resp === "sin respuesta"
    ? Notify("Piensa rápido 🤔", "")
    : questions[counterQuestion - 1].correct === resp
    ? Notify("Respuesta correcta 🙂", "correcto")
    : Notify("Respuesta incorrecta 😢", "");
  console.log(counterQuestion);

  let score = questions[counterQuestion - 1].correct === resp ? 100 : 0;
  let correct = questions[counterQuestion - 1].correct;
  let isCorrect =
    questions[counterQuestion - 1].correct === resp ? true : false;

  const newRes = {
    question: questions[counterQuestion - 1].question,
    answer: resp,
    score,
    correct,
    isCorrect,
  };
  answers.push(newRes);
};

const clearAnswer = () => {
  deletePutClassActive("btn0");
  deletePutClassActive("btn1");
  deletePutClassActive("btn2");
  deletePutClassActive("btn3");
};

// Funcion de pintado de las preguntas
const paintAnswers = (array, position) => {
  txtQuestion.textContent = array[position].question;
  lblcounter.textContent = counterQuestion + "/" + questions.length;
  secPreguntas.innerHTML = "";
  array[position].answers.forEach((answer, index) => {
    secPreguntas.innerHTML += ` <button class="btnquestion" id="btn${index}" data-answer="${answer}">${
      index === 0 ? "A. " : index === 1 ? "B. " : index === 2 ? "C. " : "D. "
    }${answer}</button>`;
  });
  clickAnswer();
};

// funcion para terminar el Juego

const isFinishGame = () => {
  if (counterQuestion < 10) {
    stopTimer();
    newQuestion();
    paintAnswers(questions, counterQuestion - 1);
  } else {
    stopTimer();
    showResults();
  }
};

//Funcion del evento clic de los botones
const clickAnswer = () => {
  const btn0 = document.getElementById("btn0");
  const btn1 = document.getElementById("btn1");
  const btn2 = document.getElementById("btn2");
  const btn3 = document.getElementById("btn3");

  btn0.addEventListener("click", () => {
    deletePutClassActive("btn0");
    answerClick = btn0.getAttribute("data-answer");
    isUserClick = true;
    verifyAnswer(answerClick);
    isFinishGame();
  });
  btn1.addEventListener("click", () => {
    deletePutClassActive("btn1");
    answerClick = btn1.getAttribute("data-answer");
    verifyAnswer(answerClick);
    isUserClick = true;
    isFinishGame();
  });
  btn2.addEventListener("click", () => {
    deletePutClassActive("btn2");
    answerClick = btn2.getAttribute("data-answer");
    verifyAnswer(answerClick);
    isUserClick = true;
    isFinishGame();
  });
  btn3.addEventListener("click", () => {
    deletePutClassActive("btn3");
    answerClick = btn3.getAttribute("data-answer");
    verifyAnswer(answerClick);
    isUserClick = true;
    isFinishGame();
  });
};
//Intervalo que almacena el cambio de pregunta

const startInterval = () => {
  intervalo = setInterval(() => {
    startAnimation();
    verifyAnswer("sin respuesta");
    counterQuestion++;
    if (counterQuestion <= 10) {
      paintAnswers(questions, counterQuestion - 1);
    } else {
      bar.set(0);
      clearInterval(intervalo);
      showResults();
    }
  }, 10000);
};
//Cambio a una nueva pregunta
const newQuestion = () => {
  startAnimation();
  if (isUserClick) {
    counterQuestion++;
    isUserClick = false;
  }
  if (counterQuestion <= 10) {
    paintAnswers(questions, counterQuestion - 1);
    startInterval(); // Inicia el nuevo intervalo si aún no se han hecho 10 preguntas
  } else {
    stopTimer();
  }
};

// parar el intervalo
const stopTimer = () => {
  clearInterval(intervalo);
};

document.addEventListener("DOMContentLoaded", async () => {
  await getQuestions();
  newQuestion();
  paintAnswers(questions, counterQuestion - 1);
});
