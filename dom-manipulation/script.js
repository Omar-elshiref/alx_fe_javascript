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
}
createAddQuoteForm();

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuote = document.getElementById("newQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const ExportQuotes = document.getElementById("ExportQuotes");
const importFile = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");


newQuote.addEventListener("click", function showRandomQuote(e) {
  e.preventDefault();
  if (localStorage.getItem("quotes orginal")) {
    let quotesToObject = JSON.parse(localStorage.getItem("quotes") || "[]");
    let randomObject = getRandomObject(quotesToObject);
    let randomText = randomObject.text;
    let randomCategory = randomObject.category;
    quoteDisplay.innerHTML = `Quote: ${randomText} Category: ${randomCategory}`;
  } else {
    quoteDisplay.innerHTML = "No quotes available.";
  }
});

function addQuote() {
  if (newQuoteText.value !== "" && newQuoteCategory.value !== "") {
    let quoteObj = {
      text: newQuoteText.value,
      category: newQuoteCategory.value,
    };

    let quotes = JSON.parse(localStorage.getItem("quotes orginal") || "[]");
    quotes.push(quoteObj);
    localStorage.setItem("quotes orginal", JSON.stringify(quotes));
    console.log(quotes);

    let option = document.createElement("option");
    option.setAttribute("value", `${newQuoteCategory.value}`)
    option.textContent = `${newQuoteCategory.value}`
    categoryFilter.appendChild(option)
    postQuoteToServer(quoteObj);

    newQuoteText.value = "";
    newQuoteCategory.value = "";

  } else {
    alert("Please fill in both fields.");
  }
}

function getRandomObject(arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

ExportQuotes.addEventListener("click", function createAndDownloadFile(e) {
  e.preventDefault();
  if (localStorage.getItem("quotes")) {
    let quotesToJSONExport = localStorage.getItem("quotes");
    let quotesText = JSON.stringify(quotesToJSONExport);
    let blob = new Blob([quotesText], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "data.json";

    document.body.appendChild(a);
    a.click();
  }
});

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    // quotes.push(...importedQuotes);
    localStorage.setItem("quotes orginal", `${importedQuotes}`);
    localStorage.setItem("quotes", `${importedQuotes}`);
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function filterQuotes(event) {
  localStorage.setItem("selectedCategory", event.target.value);

  if (localStorage.getItem("quotes orginal")) {
    let quotesAll = localStorage.getItem("quotes orginal");
    let quotesObj = JSON.parse(quotesAll);
    if (event.target.value === "all") {
      let quotesText2 = JSON.stringify(quotesObj);
      localStorage.setItem("quotes", `${quotesText2}`);
    } else {
      // const populateCategories = quotesObj.filter(
      //   (obj) => obj.category == event.target.value
      // );
      let populateCategories = quotesObj.map( (obj) => {        
          return obj.category === event.target.value ? obj : null;
    }).filter(obj => obj !== null);;
      let quotesText1 = JSON.stringify(populateCategories);
      localStorage.setItem("quotes", `${quotesText1}`);
      let quotesToObject1 = JSON.parse(localStorage.getItem("quotes") || "[]");
      let randomObject1 = getRandomObject(quotesToObject1);
      let randomText1 = randomObject1.text;
      let randomCategory1 = randomObject1.category;
      quoteDisplay.innerHTML = `Quote: ${randomText1} Category: ${randomCategory1}`;
    }
  }
}

const savedCategory = localStorage.getItem("selectedCategory");
if (savedCategory) {
  categoryFilter.value = savedCategory;
}


async function fetchQuotesFromServer() {
  try {
    let response = await fetch('https://jsonplaceholder.typicode.com/posts');
    let serverQuotes = await response.json();
    let localQuotes = JSON.parse(localStorage.getItem("quotes orginal") || "[]");

    localQuotes = localQuotes.map(localQuote => {
      let matchingServerQuote = serverQuotes.find(serverQuote => serverQuote.id === localQuote.id);
      return matchingServerQuote ? matchingServerQuote : localQuote;
    });

    serverQuotes.forEach(serverQuote => {
      if (!localQuotes.find(localQuote => localQuote.id === serverQuote.id)) {
        localQuotes.push(serverQuote);
      }
    });

    localStorage.setItem("quotes orginal", JSON.stringify(localQuotes));
    alert("Quotes synced with server!")
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}


async function postQuoteToServer(quote) {
  try {
    let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(quote)
    });
    if (!response.ok) {
      throw new Error('Failed to post quote');
    }
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

async function syncQuotes() {
  await fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 60000); 
}

syncQuotes();
