const quoteDisplay = document.getElementById("quoteDisplay");
const newQuote = document.getElementById("newQuote");

const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

newQuote.addEventListener("click", function showRandomQuote(e) {
  e.preventDefault();
  if (localStorage.getItem("quotes")) {
    let quotesToObject = JSON.parse(localStorage.getItem("quotes") || "[]")
    let randomObject = getRandomObject(quotesToObject);
    let randomText = randomObject.text;
    let randomCategory = randomObject.category;
    quoteDisplay.innerHTML = `Quote: ${randomText} Category: ${randomCategory}`;
  }
});

function addQuote() {
  if (newQuoteText.value !== "" && newQuoteCategory !== "") {
    let quoteObj = {
      text: newQuoteText.value,
      category: newQuoteCategory.value,
    };

    let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    quotes.push(quoteObj);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    console.log(quotes);

    newQuoteText.value = "";
    newQuoteCategory.value = "";
  }
}

function getRandomObject(arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
