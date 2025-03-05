

/* Language selectors */

const languageSelectors = document.querySelectorAll(".language-selector");

const languages = [{ value: "us", name: "English (US)", flagPosition: "left" },
    { value: "br", name: "Português (BR)", flagPosition: "center" }
];

let selectedLanguage = languages[0];

changeLanguageFlag(selectedLanguage);

// Mimicking server fetch request 
function fetchLanguageObj(lang) {
    for(let i = 0; i < languages.length; i++) {
        if (languages[i].value === lang) {
            return languages[i];
        }
    }
}

function changeLanguageFlag(languageObj) {
    let selectorFlags = document.querySelectorAll(".language-selector .circular-flag");

    selectorFlags.forEach(selectorFlag => {
        selectorFlag.setAttribute("src", `./img/flags/${languageObj.value}.png`);
        selectorFlag.setAttribute("srcset", `   ./img/flags/${languageObj.value}.png 1x,
                                                ./img/flags/${languageObj.value}-80.png 2x`);
        selectorFlag.setAttribute("alt", languageObj.name);

        const textElement = selectorFlag.parentElement.querySelector(".language-selector-text");

        if (textElement) {
            textElement.textContent = languageObj.name;
        }

        if (languageObj.flagPosition === "left") {
            selectorFlag.classList.add("flag-left");
        } else {
            selectorFlag.classList.remove("flag-left");
        }
    })
}


// Hack to avoid jarring transition when modal box appears/disappears (still WIP).
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
function toggleRightPadding() {
    if (!scrollbarWidth) return;

    if (document.body.style.paddingRight === "") {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
        document.body.style.paddingRight = "";
    }
}

/* Language form */

const languageForm = document.querySelector(".modal-overlay");
const languageBox = document.querySelector(".modal-box");
const closeModal = document.querySelector(".close-modal-btn");
const modalButtons = document.querySelectorAll(".modal-item");

function toggleLanguageModal() {
    languageForm?.classList.toggle("visible");
    languageBox?.classList.toggle("translated");
    languageForm?.classList.toggle("opaque");
    //document.documentElement.classList.toggle("no-scroll");
    //toggleRightPadding();
}

function isModalOpen() {
    return languageForm?.classList.contains("visible");
}


languageForm.addEventListener("click", event => {
    if (event.target === languageForm) {
        toggleLanguageModal();
    }
});

closeModal.addEventListener("click", event => {
    toggleLanguageModal();
});

modalButtons.forEach(item => {
    item.addEventListener("click", event => {
        event.stopPropagation();
        toggleLanguageModal();
        selectedLanguage = fetchLanguageObj(event.currentTarget.value);
        changeLanguageFlag(selectedLanguage);
    });
});

document.documentElement.addEventListener("keyup", event => {
    if (event.key === "Escape") {
        if (isModalOpen()) {
            toggleLanguageModal();
        }

        if (isMenuOpen()) {
            toggleMenu();
        }
    }


})

languageSelectors.forEach(item => {
    item.addEventListener("click", event => {
        event.stopPropagation();
        toggleLanguageModal();
    })
});

/* Navbar menu */

function initializeMobileNavbar() {
    const menuContent = document.querySelector(".menu-content");
    const menuBtn = document.querySelector(".menu-btn");
    const menuItems = document.querySelectorAll(".menu-item");
    
    menuBtn.addEventListener("click", event => {
        event.stopPropagation();
        toggleMenu(menuContent, menuBtn);
    });
    
    menuContent.addEventListener("click", event => {
        event.stopPropagation();
    });
    
    menuItems.forEach(item => {
        item.addEventListener("click", event => {
            event.stopPropagation();
            toggleMenu(menuContent, menuBtn);
        })
    });

    currentMenu = menuContent;
    currentNavbarMenu = menuContent;
    currentMenuBtn = menuBtn;
}


function toggleMenu(menu, btn) {
    menu?.classList.toggle("opaque");
    menu?.classList.toggle("visible");
    menu?.classList.toggle("translated");
    btn?.classList.toggle("toggled");
}

function isVisible(menu) {
    return menu?.classList.contains("visible");
}

let currentMenu = null;
let currentNavbarMenu = null;
let currentMenuBtn = null;

initializeMobileNavbar();

function isMenuOpen() {
    if (!currentMenu) return false;
    if (currentMenu.classList.contains("visible")) {
        toggleMenu(currentNavbarMenu, currentMenuBtn);
    }
}

document.documentElement.addEventListener("click", event => {
    if (currentMenu?.classList.contains("visible")) {
        toggleMenu(currentNavbarMenu, currentMenuBtn);
    }
});

/* Expandable Lists */

const footerLists = document.querySelectorAll(".footer-links-list");
const footerListsSection = document.querySelector(".footer-links-lists");

footerLists.forEach( list => {
    const expandoBtn = list.querySelector(".expando-list-btn");
    const arrowIcon = list.querySelector(".small-arrow");

    expandoBtn.addEventListener("click", () => {
        list.classList.toggle("expanded");
        arrowIcon.classList.toggle("arrow-up");
    });
});

/* Tablet media */

const mobileFooterInner = document.querySelector(".footer-links-lists-mobile").innerHTML;
const navbarMenuHTML = document.querySelector(".navbar-links-menu").outerHTML;
const tabletQuery = window.matchMedia("(min-width: 48em)");

tabletQuery.addEventListener("change", event => {
    toggleMobileFooter();
    toggleMobileNavbar();
    toggleNavigateUpMobileBtn();
});

function toggleMobileFooter() {
    if (tabletQuery.matches) {
        removeMobileFooterLinks();
    } else {
        addMobileFooterLinks();
    }
}

function initialFooterQuery() {
    if (tabletQuery.matches) {
        removeMobileFooterLinks();
    } 
}

function addMobileFooterLinks() {

    const lists = document.querySelector(".footer-links-lists");
    lists.classList.add("footer-links-lists-mobile");
    lists.classList.remove("footer-links-lists");
    lists.innerHTML = mobileFooterInner;

    const listArray = lists.querySelectorAll(".footer-links-list");
    listArray.forEach(list => {
        const expandoBtn = list.querySelector(".expando-list-btn");
        const arrowIcon = list.querySelector(".small-arrow");
    
        expandoBtn.addEventListener("click", () => {
            list.classList.toggle("expanded");
            arrowIcon.classList.toggle("arrow-up");
        });
    });
}

function removeMobileFooterLinks() {
    const listArray = document.querySelectorAll(".footer-links-list");
    const mobileLists = document.querySelector(".footer-links-lists-mobile");
    mobileLists.classList.remove("footer-links-lists-mobile");
    mobileLists.classList.add("footer-links-lists");

    mobileLists.querySelectorAll(".footer-list-divider").forEach(divider => { divider.remove(); });
    listArray.forEach(list => {
        const expandoBtn = list.querySelector(".expando-list-btn");
        const heading = list.querySelector("h3");
        list.insertAdjacentElement("afterbegin", heading);
        expandoBtn.remove();
    });
}

initialFooterQuery();

/* Nav links */

function addMobileNavbar() {
    const navbarInner = document.querySelector("#navbar-inner");
    const navbar = document.querySelector(".navbar-links-container");
    navbar.remove();

    navbarInner.insertAdjacentHTML("afterbegin", navbarMenuHTML);
    initializeMobileNavbar();

    const languageSelector = navbarInner.querySelector(".language-selector");
    
    languageSelector.addEventListener("click", event => {
            event.stopPropagation();
            toggleLanguageModal();
    });

    changeLanguageFlag(selectedLanguage);
}

function removeMobileNavbar() {
    const navbarInner = document.querySelector("#navbar-inner");
    const navbarMenu = document.querySelector(".navbar-links-menu");

    const navbarLinks = navbarMenu.querySelector(".menu-content");
    navbarLinks.classList.remove("menu-content");
    navbarLinks.classList.add("navbar-links-container");

    const ul = navbarMenu.querySelector(".navbar-links-mobile");
    ul.classList.remove("navbar-links-mobile");
    ul.classList.add("navbar-links");

    const menuItems = navbarLinks.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        item.classList.remove("menu-item");
        item.classList.remove("button-transparent-contrast");
        item.classList.add("button-transparent");
    })

    const divider = navbarMenu.querySelector(".menu-divider");
    divider.remove();

    const languageBtn = navbarMenu.querySelector(".language-selector");
    languageBtn.classList.add("language-selector-nav");
    languageBtn.classList.remove("button-transparent-contrast");
    languageBtn.classList.add("button-transparent");

    const languageTxt = languageBtn.querySelector(".language-selector-text");
    languageTxt.classList.add("language-selector-text-hidden");

    navbarInner.insertAdjacentElement("afterbegin", navbarLinks);
    navbarMenu.remove();
}

function toggleMobileNavbar() {
    if (tabletQuery.matches) {
        removeMobileNavbar();
    } else {
        addMobileNavbar();
    }
}

function initialNavbarQuery() {
    if (tabletQuery.matches) {
        removeMobileNavbar();
    } 
}

initialNavbarQuery();

/* Carousel List */

const trendingNextBtn = document.querySelector("#trips-trending .carousel-btn-next");
const trendingPreviousBtn = document.querySelector("#trips-trending .carousel-btn-previous");
const trendingCarouselList = document.querySelector("#trips-trending .carousel-list");

const agencyNextBtn = document.querySelector("#meet-us .carousel-btn-next");
const agencyPreviousBtn = document.querySelector("#meet-us .carousel-btn-previous");
const agencyCarouselList = document.querySelector("#meet-us .carousel-list");

function toggleButtons(carouselElement, nextBtn, prevBtn) {
    if (!elementHasScrollHorizontal(carouselElement)) {
        hideElement(nextBtn);
        hideElement(prevBtn);
        return;
    }

    if (isElementAtScrollEndHorizontal(carouselElement)) {
        hideElement(nextBtn);
    } else {
        if (isElementHidden(nextBtn)) {
            showElement(nextBtn);
        }
    }

    if (isElementAtScrollBeginHorizontal(carouselElement)) {
        hideElement(prevBtn);
    } else {
        if (isElementHidden(prevBtn)) {
            showElement(prevBtn);
        }
    }
}

const toggleButtonsDebounced = debounce(toggleButtons, 50);

initializeCarousel(trendingCarouselList, trendingNextBtn, trendingPreviousBtn);
initializeCarousel(agencyCarouselList, agencyNextBtn, agencyPreviousBtn);

function initializeCarousel(carouselElement, nextBtn, prevBtn) {
    nextBtn.addEventListener("click", event => {
        let currentItemWidth = carouselElement.querySelector(".carousel-item")?.offsetWidth;
        let currentX = carouselElement.scrollLeft;
        carouselElement.scrollTo(currentX + currentItemWidth, 0);
    });

    prevBtn.addEventListener("click", event => {
        let currentItemWidth = carouselElement.querySelector(".carousel-item")?.offsetWidth;
        let currentX = carouselElement.scrollLeft;
        carouselElement.scrollTo(currentX - currentItemWidth, 0);
    });

    carouselElement.addEventListener("scroll", event => {
        toggleButtonsDebounced(carouselElement, nextBtn, prevBtn);
    });

    toggleButtons(carouselElement, nextBtn, prevBtn);
}

tabletQuery.addEventListener("change", event => {
    toggleButtons(agencyCarouselList, agencyNextBtn, agencyPreviousBtn);
});

/*
const nextBtn = document.querySelector(".carousel-btn-next");
const previousBtn = document.querySelector(".carousel-btn-previous");
const carouselList = document.querySelector(".carousel-list");

nextBtn.addEventListener("click", event => {
    let currentItemWidth = carouselList.querySelector(".carousel-item")?.offsetWidth;
    let currentX = carouselList.scrollLeft;
    carouselList.scrollTo(currentX + currentItemWidth, 0);
});

previousBtn.addEventListener("click", event => {
    let currentItemWidth = carouselList.querySelector(".carousel-item")?.offsetWidth;
    let currentX = carouselList.scrollLeft;
    carouselList.scrollTo(currentX - currentItemWidth, 0);
});

const togglePreviousButtonDebounced = debounce(togglePreviousButton, 50);

const toggleNextButtonDebounced = debounce(toggleNextButton, 50);

function toggleNextButton(scrollElement, btn) {
    if (!elementHasScrollHorizontal(scrollElement)) return;

    if(isElementAtScrollEndHorizontal(scrollElement)) {
        hideElement(btn);
    } else {
        if (isElementHidden(btn)) {
            showElement(btn);
        }
    }
}

function togglePreviousButton(scrollElement, btn) {
    if (!elementHasScrollHorizontal(scrollElement)) return;

    if(isElementAtScrollBeginHorizontal(scrollElement)) {
        hideElement(btn);
    } else {
        if (isElementHidden(btn)) {
            showElement(btn);
        }
    }
}

toggleNextButton(carouselList, nextBtn);
togglePreviousButton(carouselList, previousBtn);

carouselList.addEventListener("scroll", event => {
    togglePreviousButtonDebounced(carouselList, previousBtn);
    toggleNextButtonDebounced(carouselList, nextBtn);
});
*/

function isElementAtScrollBeginHorizontal(element) {
    return (element.clientWidth === element.scrollWidth) || (element.scrollLeft === 0);
}

function isElementAtScrollBeginVertical(element) {
    return (element.clientHeight === element.scrollHeight) || (element.scrollTop === 0);
}

function isElementAtScrollEndHorizontal(element) {
    return Math.abs(Math.floor(element.scrollWidth - element.scrollLeft - element.clientWidth)) <= 1;
}

function isElementAtScrollEndVertical(element) {
    return Math.abs(Math.floor(element.scrollHeight - element.scrollTop - element.clientHeight)) <= 1;
}

function elementHasScrollHorizontal(element) {
    return element.scrollWidth > element.clientWidth;
}

function isScrollCleared(scrollElement, heightToClear) {
    return scrollElement.scrollTop > heightToClear;
}

function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {func.apply(this, args);}, timeout);
    };
}

/* MeetUs agency list */





/* Search Form */

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchContainer = document.querySelector(".search-container");
const searchBtn = document.querySelector("#search-btn");
const searchSvg = document.querySelector(".search-svg");

searchInput.addEventListener("focus", event => {
    searchSvg.classList.add("active-svg");
    searchContainer.classList.add("active-form");
});

searchInput.addEventListener("blur", event => {
    searchSvg.classList.remove("active-svg");
    searchContainer.classList.remove("active-form");
});

searchBtn.addEventListener("click", event => {
    event.preventDefault();
});

searchBtn.addEventListener("focus", event => {
    searchSvg.classList.add("active-svg");
    searchContainer.classList.add("active-form");
});

searchBtn.addEventListener("blur", event => {
    searchSvg.classList.remove("active-svg");
    searchContainer.classList.remove("active-form");
});

/* 'Go to top' buttons */

function isElementHidden(element) {
    return element.classList.contains("hidden");
}

function showElement(element) {
    element.classList.remove("hidden");
    element.classList.remove("transparent");
}

function hideElement(element) {
    element.classList.add("hidden");
    element.classList.add("transparent");
}

const navigateUpBtnMobileHTML = document.querySelector(".navigate-top-btn-mobile").outerHTML;
const navigateUpBtnHTML = `<a class="navigate-top-btn btn btn-transparent btn-rounded btn-padded" href="#main-content">Go to top</a>`;

const toggleNavigateUpBtnMobile = debounce(() => {
    const heightToClear = document.querySelector(".navbar").clientHeight;
    const navigateUpBtnMobile = document.querySelector(".navigate-top-btn-mobile");

    if (!isScrollCleared(document.documentElement, heightToClear)) {
        if (!isElementHidden(navigateUpBtnMobile)) {
            hideElement(navigateUpBtnMobile);
        }  
    } else {
        if (isElementHidden(navigateUpBtnMobile)) {
            showElement(navigateUpBtnMobile);
        }  
    }

}, 50);

function toggleNavigateUpMobileBtn() {
    if (tabletQuery.matches) {
        removeNavigateUpBtnMobile();
    } else {
        addNavigateUpBtnMobile();
    }
}

function initializeNavigateUpMobileBtn() {
    if (tabletQuery.matches) {
        removeNavigateUpBtnMobile();
    } else {
        window.addEventListener("scroll", toggleNavigateUpBtnMobile);
    }
}

function removeNavigateUpBtnMobile() {
    const headingContainers = document.querySelectorAll(".section-heading-container");
    const navigateUpBtnMobile = document.querySelector(".navigate-top-btn-mobile");

    navigateUpBtnMobile.remove();
    headingContainers.forEach(containers => {
        containers.insertAdjacentHTML("beforeend", navigateUpBtnHTML);
    });

    window.removeEventListener("scroll", toggleNavigateUpBtnMobile);
}

function addNavigateUpBtnMobile() {
    const mainElement = document.querySelector("#main-content");
    const headingContainersBtns = document.querySelectorAll(".section-heading-container .navigate-top-btn");

    mainElement.insertAdjacentHTML("beforeend", navigateUpBtnMobileHTML);
    headingContainersBtns.forEach(btn => {
        btn.remove();
    });

    window.addEventListener("scroll", toggleNavigateUpBtnMobile);
}

initializeNavigateUpMobileBtn();



