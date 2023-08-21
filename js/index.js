const btnQuizMain = document.getElementById("btnQuizMain");
const btnOther = document.getElementById("btnOther");

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

btnQuizMain.addEventListener("click", () => {
  window.location.href = "./views/quizMain.html";
});

btnOther.addEventListener("click", () => {
  Notify("Lo sentimos peno no tenemos conexión a la base de datos 😞", "");
});
