//! HTML'den gelenler
const chatInput = document.querySelector("#chat-input");
const sendBtn = document.querySelector("#send-btn");
const defaultText = document.querySelector(".default-text");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

// console.log(deleteButton);

//*Değişkenler

let userText = null;

//* Fonksiyonlar

//Gönderdiğimiz html ve class ismine göre bize bir html oluşturur.
const createElement = (html, className) => {
  //*yeni bir div oluştur
  const chatDiv = document.createElement("div");
  //* Bu oluşturduğumuz dive chat ve dışarıdan parametre olarak gelen classı ver.
  chatDiv.classList.add("chat", className);
  //*Oluşturduğumuz dive chat ve dışarıdan parametre olarak gelen html parametresini ekle
  chatDiv.innerHTML = html;

  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const pElement = document.createElement("p");
  console.log(pElement);
  //* 1.adım: URL'i tanımla
  const url = "https://chatgpt-42.p.rapidapi.com/geminipro";
  //* 2.adım:Options'ı tanımla.
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "f02d1e3127msh3fbd04243ecf372p130752jsn27f031ada121",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    //*body kısmını JSON.stringify(:bodyvalue) şeklinde yaptık.
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `${userText}`,
        },
      ],
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  };
  //*3.adım: API'ye istek at.
  fetch(url, options);

  /* .then yöntemi
   //*Gelen cevabı yakala ve jsona çevir
    .then((res) => res.json())
    //*Json'a çevrilmiş veriyi yakalayıp işlemler gerçekleştirebiliyoruz.
    .then((data) => data.result)
    //*Hata varsa yakalar.
    .catch((error) => console.error(error)); */

  try {
    //*api'ye url ve options kullanarak istek at ve bekle.(arrow başına async konulur.)
    const response = await fetch(url, options);
    //*gelen cevabı json çevir ve bekle
    const result = await response.json();

    //*API'den gelen cevabı oluşturduğumuz p etiketinin içerisine aktardık.
    pElement.innerHTML = result.result;
    // console.log(result);
  } catch (error) {
    // console.log(error);
  }
  //*animasyonu kaldırabilmek için quertSelector ile seçtik ve ekrandan remove ile kaldırdık.
  incomingChatDiv.querySelector(".typing-animation").remove();
  //*API'den gelen cevabı ekrana aktarabilmek için chat-details seçip değişkene aktardık.
  //   const detailDiv = incomingChatDiv.querySelector(".chat-details");
  //   //*bu detail içine oluşturulan pElement etiketi aktarıldı.
  //   detailDiv.appendChild(pElement);

  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);

  chatInput.value = null;
  saveChatHistory();
};

//* Animasyon
const showTypingAnimation = () => {
  const html = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="/images/chatbot.jpg" alt="bot" />
            <div class="typing-animation">
                <div class="typing-dot" style="--delay: 0.2s"></div>
                <div class="typing-dot" style="--delay: 0.3s"></div>
                <div class="typing-dot" style="--delay: 0.4s"></div>
            </div>
        </div>
    </div>
    
    `;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse(incomingChatDiv);
};
//*chat gönderme

const handleOutGoingChat = () => {
  userText = chatInput.value.trim(); //* Inputun içerisindeki değeri al ve fazladan bulunan boşlukları sil.

  //*Inputun içerisinde veri yoksa Fonksiyonu durdur.
  if (!userText) {
    alert("Lütfen veri giriniz!!!");
    return;
  }
  const html = `
        <div class="chat-content">
          <div class="chat-details">
            <img src="/images/user.jpg" alt="user" />
            <p></p>
          </div>
        </div>
  `;
  //* Kullanıcının mesajını içeren bir div oluştur ve bunu chatContainer yapısına ekle.
  const outgoingChatDiv = createElement(html, "outgoing");
  defaultText.remove();
  outgoingChatDiv.querySelector("p").textContent = userText;
  chatContainer.appendChild(outgoingChatDiv);
  setTimeout(showTypingAnimation, 750);
};

//! Olay İzleyicileri

sendBtn.addEventListener("click", handleOutGoingChat);
//* Textarea içerisinde klavyeden herhangi bir tuşa bastığımızda anda bu olay izleyicisi çalışır.
chatInput.addEventListener("keydown", (e) => {
  //*klavyeden enter basılınca fonksiyon çalışır.
  if (e.key === "Enter") {
    handleOutGoingChat();
  }
});
//*ThemeButtona tıkladığımızda bodye light mode classını ekle ve çıkar.
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  //*body light-mode classını içeriyorsa themeButton içerisindeki yazıyı dark_mode , içermiyorsa light_mode yap.
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});
//*sil buton tıklanınca chat-container siler ve defaultText aktarır.
deleteButton.addEventListener("click", () => {
  //*confirm ile ekrana mesaj bastık.confirm true(tamam) ve false(iptal) değer verir.
  if (confirm("Tüm sohbetleri silmek istediğinize emin misiniz?")) {
    chatContainer.remove();
    localStorage.removeItem("chatHistory");
  }

  const defaultText = `
    <div class="default-text">
        <h1>CHAT GPT CLONE</h1>
    </div>
    <div class="chat-container"></div>

    <div class="typing-container">
        <div class="typing-content">
            <div class="typing-textarea">
                <textarea
                    id="chat-input"
                    placeholder="Aramak istediğiniz veriyi giriniz..."
                ></textarea>
                <span class="material-symbols-outlined" id="send-btn"> send </span>
            </div>
            <div class="typing-controls">
                <span class="material-symbols-outlined" id="theme-btn">
                    light_mode
                </span>
                <span class="material-symbols-outlined" id="delete-btn">
                    delete
                </span>
            </div>
        </div>
    </div>
  `;

  document.body.innerHTML = defaultText;
});
//* localStorage veriyi ekleme
const saveChatHistory = () => {
  localStorage.setItem("chatHistory", chatContainer.innerHTML);
};

const loadChatContainer = () => {
  const chatHistory = localStorage.getItem("chatHistory");
  if (chatHistory) {
    chatContainer.innerHTML = chatHistory;
    defaultText.remove();
  }
};

document.addEventListener("DOMContentLoaded", loadChatContainer);
