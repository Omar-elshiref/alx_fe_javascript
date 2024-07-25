function createAddQuoteForm() {
  let div = document.createElement("div");
  let input1 = document.createElement("input");
  let input2 = document.createElement("input");
  let btn2 = document.createElement("button");
  input1.setAttribute("id", "newQuoteText");
  input1.setAttribute("type", "text");
  input1.setAttribute("placeholder", "Enter a new quote");
  input2.setAttribute("id", "newQuoteCategory");
  input2.setAttribute("type", "text");
  input2.setAttribute("placeholder", "Enter quote category");
  btn2.setAttribute("onclick", "addQuote()");
  btn2.innerHTML = "Add Quote";
  div.appendChild(input1);
  div.appendChild(input2);
  div.appendChild(btn2);
  document.body.appendChild(div);
  // let QuoteForm = `
  // <div>
  //   <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
  //   <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
  //   <button onclick="addQuote()">Add Quote</button>
  // </div>`;
  // document.body.innerHTML += QuoteForm;
}
createAddQuoteForm();

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuote = document.getElementById("newQuote");

const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

newQuote.addEventListener("click", function showRandomQuote(e) {
  e.preventDefault();
  if (localStorage.getItem("quotes")) {
    let quotesToObject = JSON.parse(localStorage.getItem("quotes") || "[]");
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
