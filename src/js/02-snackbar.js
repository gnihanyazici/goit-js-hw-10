import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      state === "fulfilled" ? resolve(delay) : reject(delay);
    }, delay);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  createPromise(delay, state)
    .then((delay) => {
      iziToast.success({ title: "Success", message: `✅ Fulfilled promise in ${delay}ms` });
    })
    .catch((delay) => {
      iziToast.error({ title: "Error", message: `❌ Rejected promise in ${delay}ms` });
    });
});
