const quote = document.querySelector(".daily-quote");
const author = document.querySelector(".daily-author");
const container = document.querySelector(".container");
const content = document.querySelector(".content");
const authorImage = document.getElementById("daily-author-image");
const spinner = document.querySelector(".loader");
const twitterShareButton = document.getElementById('twitter-btn');

twitterShareButton.addEventListener("click", shareOnTwitter);

//Fetch daily quote and store it in local data
async function getDailyQuote() {
    container.classList.add("loading");
    spinner.style.display = "flex";
    content.style.display = "none";
    const quoteEndpoint = "https://api.quotable.io/random";
    const imageEndpoint = "https://images.quotable.dev/profile/200/";

    const response = await fetch(quoteEndpoint);
    const quoteData = await response.json();

    if (response.ok) {
        const authorSlug = quoteData.authorSlug;
        const imageUrl = `${imageEndpoint}${authorSlug}.jpg`;

        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        authorImage.src = URL.createObjectURL(imageBlob);
        authorImage.alt = quoteData.author;

        quote.textContent = quoteData.content;
        author.textContent = quoteData.author + ".";
        container.classList.remove("loading");
        content.style.display = "flex";
        spinner.style.display = "none";

        localStorage.setItem("quote", quoteData.content);
        localStorage.setItem("author", quoteData.author);
        localStorage.setItem("imageUrl", imageUrl);
        localStorage.setItem("lastFetched", new Date().getTime());
    } else {
        const errorMessage = "An error occurred. Please try again later.";
        quote.textContent = errorMessage;
        author.textContent = "A lazy developer.";
        container.classList.remove("loading");
        spinner.style.display = "none";
        content.style.display = "flex"
        authorImage.src = "https://play-lh.googleusercontent.com/xlnwmXFvzc9Avfl1ppJVURc7f3WynHvlA749D1lPjT-_bxycZIj3mODkNV_GfIKOYJmG"
    }
}

//Function to compare dates
function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

//Checks if date of stored quote matches today's date.
//If it does, displays stored quote. If it doesn't, fetches new quote.
function getNewDailyQuote() {
    container.classList.add("loading");
    spinner.style.display = "flex";
    content.style.display = "none";
    const storedQuote = localStorage.getItem("quote");
    const storedAuthor = localStorage.getItem("author");
    const storedImageUrl = localStorage.getItem("imageUrl");
    const lastFetched = parseInt(localStorage.getItem("lastFetched"));

    if (storedQuote && storedAuthor && isSameDay(new Date(lastFetched), new Date())) {
        quote.textContent = storedQuote;
        author.textContent = storedAuthor + ".";
        container.classList.remove("loading");
        content.style.display = "flex";
        spinner.style.display = "none";
        if (storedImageUrl) {
            authorImage.src = storedImageUrl;
        }
    } else {
        getDailyQuote();
    }
}

//Twitter sharing function
function shareOnTwitter() {
    const quoteText = '"' + quote.textContent.trim() + '"';
    const authorText = author.textContent.trim();
    const url = "https://wasivis.github.io/randomquotegenerator/";
    const text = encodeURIComponent(`${quoteText} - ${authorText}\n\nVisit ${url} for more inspirational quotes!`);
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${text}&hashtags=RandomQuoteGenerator`;
    window.open(twitterShareUrl, "_blank");
}

getNewDailyQuote();