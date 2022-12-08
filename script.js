
function Book(title, author, year, read) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.read = read;

    this.element = function() {
        const div = document.createElement("div");
        div.classList.add("book");
        const title = document.createElement("div");
        title.classList.add("title");
        title.innerText = this.title;
        div.appendChild(title);
        div.appendChild(this.add_info("Author", this.author));
        div.appendChild(this.add_info("Year of Publication", this.year));
        div.appendChild(this.read_button());
        div.appendChild(this.remove_button());
        return div;
    }

    this.toggleRead = function() {
        this.read = !this.read;
    }

    this.remove_button = function () {
        const btn = document.createElement("button");
        btn.classList.add("delete");
        btn.innerText = "DELETE";

        btn.addEventListener("click", () => {
            let book = btn.parentElement;
            let parent = book.parentElement;
            let i = book.dataset.index;
            myLibrary.remove(i);
            parent.removeChild(book);
        })

        return btn;
    }

    this.read_button = function () {
        const btn = document.createElement("button");
        btn.classList.add("read");
        btn.innerText = this.read ? "I HAVE READ THIS BOOK" : "I HAVEN'T READ THIS BOOK";
        btn.dataset.read = this.read;

        btn.addEventListener("click", () => {
            this.toggleRead();
            btn.innerText = this.read ? "I HAVE READ THIS BOOK" : "I HAVEN'T READ THIS BOOK";
            btn.dataset.read = this.read;
        })

        return btn;
    }

    this.add_info = function(info, value) {
        const div = document.createElement("div");
    
        const label = document.createElement("span");
        label.classList.add("label");
        label.innerText = `${info}: `;
        div.appendChild(label);
    
        const text = document.createElement("span");
        text.classList.add("text");
        text.innerText = `${value}`
        div.appendChild(text);
    
        return div;
    }
}

function Add_Book_Dialog() {
    this.form = document.querySelector(".form-container");
    this.add = document.querySelector("#add_button");
    this.cancel = document.querySelector("#cancel");
    this.title = document.querySelector("#title");
    this.author = document.querySelector("#author");
    this.year = document.querySelector("#year");
    this.read = document.querySelector("#read");
    this.book = new Book("The Fellowship of the Ring", "J. R. R. Tolkien", 1953, false);
    
    this.title.addEventListener("input", () => {
        this.setFilled();
    });
    this.author.addEventListener("input", () => {
        this.setFilled();
    });

    this.year.addEventListener("input", () => {
        this.setFilled();
        if (this.year.value != "") this.year.value = parseInt(this.year.value, 10) <= new Date().getFullYear() ? this.year.value : new Date().getFullYear();

    }) 

    this.read.addEventListener("click", (event) => {
        event.preventDefault();
        this.read.dataset.read = !(this.read.dataset.read === "true");
        this.read.innerText = this.read.dataset.read === "true" ? "I HAVE READ THIS BOOK" : "I HAVEN'T READ THIS BOOK";
    })

    this.add.addEventListener("click", (event) => {
        event.preventDefault();
        this.create_book();
        this.close();
    })

    this.cancel.addEventListener("click", (event) => {
        event.preventDefault();
        this.close();
    })

    this.setFilled = function () {
        this.form.dataset.filled = ((this.year.value != "") && (this.title.value != "") && (this.author.value != ""));
        this.add.disabled = this.form.dataset.filled === "false";
    }

    this.open = function () {
        this.clear();
        this.form.dataset.shown = "true";
    }

    this.close = function () {
        this.form.dataset.shown = "false";
    }


    this.create_book = function () {
        let title = this.title.value;
        let author = this.author.value;
        let year = this.year.value;
        let read = this.read.dataset.read === "true";
        let book = new Book(title, author, year, read);
        myLibrary.add_book(book);
    }

    this.clear = function () {
        this.title.value = "";
        this.author.value = "";
        this.year.value = "";
        this.read.dataset.read = "false";
        this.read.innerText = "I HAVEN'T READ THIS BOOK";
        this.add.disabled = true;
    }
}

function Library() {
    this.i = 0;
    this.myLib = [
        new Book("The Fellowship of the Ring", "J.R.R. Tolkien", 1954, true),
        new Book("The Two Towers", "J.R.R. Tolkien", 1954, true),
        new Book("The Return of the King", "J.R.R. Tolkien", 1955, false),
    ];
    this.container = document.querySelector(".container");
    this.rows = this.container.children;

    this.add = document.querySelector("#add");
    this.clear = document.querySelector("#clear");

    this.remove = function (index) {
        if (index == 0) this.myLib.shift();
        else if (index == this.myLib.length - 1) this.myLib.pop();
        else {
            this.myLib = this.myLib.slice(0, index).concat(this.myLib.slice(index + 1));
        }
        this.i--;
    }

    this.clear_books = function () {
        this.myLib = [];
        this.i = 0;
    }

    this.add.addEventListener("click", () => {
        dialog.open();
    })

    this.clear.addEventListener("click", () => {
        this.container.innerHTML = "";
        this.clear_books();
    })

    this.add_book = function(book) {
        this.myLib.push(book);
        this.print_book(book);
    }

    this.print_book = function(book) {
        let element = book.element();
        element.dataset.index = this.i;
        this.i++;
        this.container.appendChild(element);
    }

    this.myLib.forEach(book => this.print_book(book));
}

const dialog = new Add_Book_Dialog();
const myLibrary = new Library();
