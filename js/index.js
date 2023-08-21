const btnQuizMain = document.getElementById("btnQuizMain");
const btnOther = document.getElementById("btnOther");

btnQuizMain.addEventListener("click", () => {
  window.location.href = "./views/quizMain.html";
});

btnOther.addEventListener("click", () => {
  window.location.href = "./views/quizMainPhp.html";
});
