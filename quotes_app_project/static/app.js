class RandomQuote{
    constructor() {
        this.init();
    }

    init = () => {
        this.quoteContainer = document.querySelector("#quote-container");
        this.quote = document.querySelector("#quote");
        this.quoteButton = document.querySelector("#next-quote");
        this.author = document.querySelector("#author");

        this.quoteButton.addEventListener("click", this.getQuote);
        document.addEventListener("keyup", e => {
            if(e.code === "Space"){
                this.getQuote();
            }
        });
        this.getQuote();
    }

    getQuote = async () => {
        let apiUrl = "/api/quotes/random";
        try{
        let response = await fetch(apiUrl);
        let data = await response.json();
        this.quote.textContent = data.quote;
        this.author.textContent = data.author;
        }catch(err){
            console.error(err);
            this.quote.textContent = "Server error" + err;
            
        }
    }
}

const randomQuote = new RandomQuote();