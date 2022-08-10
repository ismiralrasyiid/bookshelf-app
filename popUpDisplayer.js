// VARIABLES 
const inputNavBtn = document.getElementById("inputNavBtn");
const searchNavBtn = document.getElementById("searchNavBtn");
const inputCloseBtn = document.getElementById("inputCloseBtn")
const searchCloseBtn = document.getElementById("searchCloseBtn")
const inputMenu = document.getElementById("inputMenu");
const searchMenu = document.getElementById("searchMenu");
// FUNCTIONS
const hideElement = (element) => {
    if (!element.classList.contains("hidden")) {
        element.classList.add("hidden");
    }
};
const toggleElement = (element) => {
    element.classList.toggle("hidden");
};
const clearInputOnClose = () => {
    const clearInputElements = document.getElementsByTagName("input");
    for (const element of clearInputElements) {
        element.value = "";
    }
};
// FEATURES
// Close and clear input menus on click
inputNavBtn.addEventListener("click", () => {
    hideElement(searchMenu);
    toggleElement(inputMenu);
    clearInputOnClose();
});
searchNavBtn.addEventListener("click", () => {
    hideElement(inputMenu);
    toggleElement(searchMenu);
    clearInputOnClose();
});
inputCloseBtn.addEventListener("click", () => {
    hideElement(inputMenu)
    clearInputOnClose();
});
searchCloseBtn.addEventListener("click", () => {
    hideElement(searchMenu)
    clearInputOnClose();
});
