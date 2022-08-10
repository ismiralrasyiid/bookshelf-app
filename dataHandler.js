// VARIABLES
const localUsernameKey = "LOCAL_USERNAME";
const localSavedBookKey = "LOCAL_SAVED_BOOK";
let savedBook = [];

// FUNCTIONS
const createBookObj = () => {
    const id = +new Date();
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
};
const renderUsername = () => {
    const username = localStorage.getItem(localUsernameKey);
    document.getElementById("usernameTitle").innerText = `Koleksi Buku ${username}`;
    document.getElementById("usernameH1").innerText = username;
};
const renderBookShelf = (savedBook) => {
    if (savedBook[0]) {
        for (const bookObj of savedBook) {
            const {
                id,
                title,
                author,
                year,
                isComplete
            } = bookObj;
            // Target elements
            const incompleteBooks = document.getElementById("incompleteBooks");
            const completeBooks = document.getElementById("completeBooks");
            // Create new elements
            const bookItem = document.createElement("article");
            const bookTitle = document.createElement("h3");
            const bookAuthor = document.createElement("p");
            const bookYear = document.createElement("p");
            const divForBtn = document.createElement("div");
            const switchBtn = document.createElement("button")
            const deleteBtn = document.createElement("button")
            // Add classes
            bookItem.classList.add("bookitem");
            divForBtn.classList.add("action")
            switchBtn.classList.add("switch")
            deleteBtn.classList.add("delete")
            // Add id attribute
            switchBtn.setAttribute("bookId", id);
            deleteBtn.setAttribute("bookId", id);
            // Add contents
            bookTitle.innerText = title;
            bookAuthor.innerText = `Penulis : ${author}`;
            bookYear.innerText = `Tahun : ${year}`;
            if (isComplete) {
                switchBtn.innerText = "Belum Dibaca";
            } else {
                switchBtn.innerText = "Selesai Dibaca"
            };
            deleteBtn.innerText = "Hapus Buku";
            // Append elements
            divForBtn.appendChild(switchBtn);
            divForBtn.appendChild(deleteBtn);
            bookItem.appendChild(bookTitle);
            bookItem.appendChild(bookAuthor);
            bookItem.appendChild(bookYear);
            bookItem.appendChild(divForBtn);
            if (isComplete) {
                completeBooks.appendChild(bookItem);
            } else {
                incompleteBooks.appendChild(bookItem);
            };
        };
    };
};
const clearBookshelf = () => {
    const completeBooks = document.getElementById("completeBooks");
    const incompleteBooks = document.getElementById("incompleteBooks");
    completeBooks.innerHTML = "";
    incompleteBooks.innerHTML = "";
};
const inputUsername = ()=>{
    Swal.fire({
        title: 'Nama saya adalah',
        input : 'text',
        confirmButtonText: 'Lanjut'
    }).then((result)=>{
        if(result.value){
            const username = result.value.charAt(0).toUpperCase() + result.value.slice(1);
            localStorage.setItem(localUsernameKey, username);
            renderUsername();
        }else{
            inputUsername();
        }
        
    });
};
// FEATURES
// Get localStorage data and render it
window.addEventListener("DOMContentLoaded", async () => {
    if (typeof (Storage) !== undefined) {
        // Input username and render it
        if (localStorage.getItem(localUsernameKey) === null) {
            inputUsername();
        };
        renderUsername();
        // Get saved book list and render it
        if (localStorage.getItem(localSavedBookKey)) {
            savedBook = await JSON.parse(localStorage.getItem(localSavedBookKey));
        }
        renderBookShelf(savedBook);
    };
});
window.addEventListener("load", () => {
    // VARIABLES
    const inputForm = document.getElementById("inputForm");
    const changeSpanHandler = document.getElementsByClassName("changeSpan");
    const searchForm = document.getElementById("searchForm");
    const switchBtns = document.getElementsByClassName("switch");
    const deleteBtns = document.getElementsByClassName("delete");
    const backBtn = document.getElementsByClassName("backBtn");
    const confirmationBox = document.getElementById("confirmationBox");
    const confirmYesBtn = document.getElementById("confirmYes");
    const confirmNoBtn = document.getElementById("confirmNo");
    let deleteBookId = null;
    // FEATURES
    // Set book data on localStorage on submit
    inputForm.addEventListener("submit", () => {
        savedBook.push(createBookObj());
        localStorage.setItem(localSavedBookKey, JSON.stringify(savedBook));
    });
    // Change span text on check
    for (const handler of changeSpanHandler) {
        handler.addEventListener("click", () => {
            const spanElement = document.querySelector("#bookSubmit span");
            const isCompleteCheckbox = document.getElementById("inputBookIsComplete");
            if (isCompleteCheckbox.checked) {
                spanElement.innerText = "Selesai Dibaca";
            } else {
                spanElement.innerText = "Belum Selesai Dibaca";
            }

        });
    };
    // Search book
    searchForm.addEventListener("submit", async (event) => {
        // Variables
        const searchValue = document.getElementById("searchBookTitle").value;
        const savedBook = await JSON.parse(localStorage.getItem(localSavedBookKey));
        const filteredBook = [];
        // Loop matched book
        for (const book of savedBook) {
            const titleChecker = book.title.toUpperCase().indexOf(searchValue
                .toUpperCase());
            if (titleChecker > -1) {
                // Filter matched book and push it to filteredBook
                filteredBook.push(book);
            }
        }
        clearBookshelf();
        renderBookShelf(filteredBook);
        backBtn[0].classList.remove("hidden");
        switchBookEvent();
        deleteBookEvent()
        event.preventDefault();
    });
    // Switch between bookshelf
    const switchBookEvent = () => {
        for (const switchBtn of switchBtns) {
            switchBtn.addEventListener("click", async () => {
                const currentId = switchBtn.getAttribute("bookId");
                const savedBook = await JSON.parse(localStorage.getItem(localSavedBookKey));
                const nonTargetedBook = savedBook.filter((book) => {
                    return book.id != currentId;
                });
                const targetedBook = savedBook.filter((book) => {
                    return book.id == currentId;
                });
                targetedBook[0].isComplete = !targetedBook[0].isComplete;
                nonTargetedBook.push(targetedBook[0]);
                localStorage.setItem(localSavedBookKey, JSON.stringify(nonTargetedBook));
                window.location.reload();
            });
        };
    };
    switchBookEvent();
    // Delete book
    const deleteBookEvent = () => {
        for (const deleteBtn of deleteBtns) {
            deleteBtn.addEventListener("click", () => {
                // Get book id and display confirmation box
                deleteBookId = deleteBtn.getAttribute("bookId");
                confirmationBox.classList.remove("hidden");
            });
        };
    };
    deleteBookEvent();
    confirmYesBtn.addEventListener("click", async () => {
        const savedBook = await JSON.parse(localStorage.getItem(localSavedBookKey));
        const remainingBook = savedBook.filter((book) => {
            return book.id != deleteBookId;
        });
        localStorage.setItem(localSavedBookKey, JSON.stringify(remainingBook));
        window.location.reload();
    });
    confirmNoBtn.addEventListener("click", () => {
        confirmationBox.classList.add("hidden");
    });
    // Hide backBtn element and re-render all books
    backBtn[0].addEventListener("click", () => {
        backBtn[0].classList.add("hidden");
        clearBookshelf();
        renderBookShelf(savedBook);
        switchBookEvent();
        deleteBookEvent();
    });
});