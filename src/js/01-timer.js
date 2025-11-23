import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Element Seçimi
const startButton = document.querySelector('[data-start]');
const datetimePicker = document.getElementById('datetime-picker');
const dataDays = document.querySelector('[data-days]');
const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

// Başlangıçta Start düğmesini devre dışı bırak
startButton.disabled = true;

// Yardımcı Fonksiyonlar
function convertMs(ms) {
  // ... (Görevin metnindeki convertMs fonksiyonu buraya kopyalanacak)
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  dataDays.textContent = addLeadingZero(days);
  dataHours.textContent = addLeadingZero(hours);
  dataMinutes.textContent = addLeadingZero(minutes);
  dataSeconds.textContent = addLeadingZero(seconds);
}

// flatpickr Seçenekleri
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate.getTime() <= currentDate.getTime()) {
      // Geçmiş tarih seçildi
      startButton.disabled = true;
      iziToast.error({
        title: 'Hata',
        message: 'Lütfen gelecekte bir tarih seçin.',
        position: 'topRight',
      });
      userSelectedDate = null; // Geçersiz tarihi sıfırla
    } else {
      // Geçerli gelecek tarih seçildi
      startButton.disabled = false;
      userSelectedDate = selectedDate;
    }
  },
};

// flatpickr başlatma
flatpickr(datetimePicker, options);

// Zamanlayıcı Başlatma Fonksiyonu
function startTimer() {
  if (!userSelectedDate || timerId) return; // Geçerli tarih yoksa veya zaten çalışıyorsa başlatma

  // Başlat düğmesini ve tarih seçiciyi devre dışı bırak
  startButton.disabled = true;
  datetimePicker.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const msDifference = userSelectedDate.getTime() - currentTime.getTime();

    if (msDifference <= 0) {
      clearInterval(timerId);
      timerId = null;
      datetimePicker.disabled = false; // Tarih seçiciyi tekrar etkinleştir
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.success({
        title: 'Bitti',
        message: 'Geri sayım tamamlandı!',
        position: 'topRight',
      });
      return;
    }

    const time = convertMs(msDifference);
    updateTimerInterface(time);

  }, 1000);
}

// Olay Dinleyicisi
startButton.addEventListener('click', startTimer);