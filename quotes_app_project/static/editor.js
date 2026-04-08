class QuoteEditor{
    constructor(){
        this.init();
    }

    init = () => {
        this.lightbox = document.querySelector("#lightbox");
        this.quoteText = document.querySelector("#new-quote-text");
        this.quoteAuthor = document.querySelector("#new-quote-author");
        this.quotesList = document.querySelector("#quotes-list");

        document.addEventListener("keyup", (e) => {
            if(e.key === "e"){
                this.showEditor();
            }
        });

        document.querySelector("form").addEventListener("submit", (e) => {
            e.preventDefault();
            this.processNewQuote();
        });
    }

    showEditor = async () => {
        this.lightbox.classList.toggle("active");
        await this.reloadQuoteList();
    }

    reloadQuoteList = async () => {
        this.removeAllChildNodes(this.quotesList);


        const quotes = await this.getQuotes();
        

        for(const q of quotes){
            //console.log(q);
            
            const quoteHtml = this.getQuoteHtmlListItem(q);
            this.quotesList.appendChild(quoteHtml);
        }
    }

    removeAllChildNodes = (parent) => {
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }

    getQuotes = async() => {
        try{
            const response = await fetch("/api/quotes");
            const data = await response.json();
            return data;
        } catch(err){
            console.error(err);
            return null;
            
        }
    }

    getQuoteHtmlListItem = (quoteData) => {
        const html = `
        <div class ="quote-list-item">
        ${quoteData.author}: ${quoteData.quote}

        </div>
        <div class="quote-list-item-delete">
            <a href="#" quote-id ="${quoteData._id}">X</a>
        </div>
        `

        const li = document.createElement("li");
        li.classList.add("list-item");
        li.innerHTML = html;

        li.querySelector("a").addEventListener("click", (e) => {
            this.deleteQuote(quoteData._id);
        });

        return li;
    }

    processNewQuote = async() => {
        if(this.quoteText.value.length == 0 || this.quoteAuthor.value.length == 0){
            console.log("Brakl pełnych danych cytatu");
            return;
        }
        const response = await fetch("/api/quote/save", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                quote: this.quoteText.value,
                author: this.quoteAuthor.value
            })
        });
        const data = await response.json();
        if(data && data.saved == true){
            console.log("Nowy element zapisany w bazie z _id:", data._id);

            this.reloadQuoteList();
            this.quoteText.value = "";
            this.quoteAuthor.value = "";
            
        }
    }

    deleteQuote = async(id) => {
        const response = await fetch("/api/quote/delete", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                _id: id
            })
        });

        const data = await response.json();
        if(data && data.deleted == true){
            console.log("Skasowany element");
            
            
        }
      this.reloadQuoteList();
    }
}

const quoteEditor = new QuoteEditor();