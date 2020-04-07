

const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const name = document.querySelectorAll(".team__name");
const menu = document.querySelectorAll(".menu__item");
const left = document.querySelector(".slider__control_prev");
const right = document.querySelector(".slider__control_next");
const list = document.querySelector(".slider__list");
const myForm = document.querySelector('#myForm');
const sendButton = document.querySelector('#sendButton');
const successOverlay = createOverlay("<b>Скоро ты будешь накормлен!</b>");
const failOverlay = createOverlay("<b>Сиди голодный, ты не заслужил!</b>");
const body = document.getElementsByTagName('body')[0];
const more = document.querySelectorAll(".feeds__parent_link");


hamburger.addEventListener('click', function () {
  nav.classList.toggle("nav_active");
  hamburger.classList.toggle("hamburger_active");
});


for (let i = 0; i < name.length; i++) {
  name[i].addEventListener('click', function () {

    if (name[i].classList.value == "team__name team__name_active") {
      name[i].classList.toggle('team__name_active');
    } else {
      if (document.querySelector(".team__name_active")) {
        document.querySelector(".team__name_active").classList.remove('team__name_active');
      }

      name[i].classList.toggle("team__name_active");
    }
  });
}




for (let i = 0; i < menu.length; i++) {
  menu[i].addEventListener('click', function () {
    event.preventDefault();

    if (menu[i].classList.value == "menu__item menu__item_active") {
      menu[i].classList.remove('menu__item_active');
    } else {
      if (document.querySelector(".menu__item_active")) {
        document.querySelector(".menu__item_active").classList.remove('menu__item_active');
      }
      menu[i].classList.toggle("menu__item_active");
    }

  });

}

//slider

left.addEventListener("click", function (e) {
  loop("left", e);
});

right.addEventListener("click", function (e) {
  loop("right", e);
});

function loop(direction, e) {
  e.preventDefault();

  if (direction === "right") {
    list.appendChild(list.firstElementChild);
  } else {
    list.insertBefore(list.lastElementChild, list.firstElementChild);
  }
}

//form

sendButton.addEventListener("click", function (e) {
  event.preventDefault();



  if (validateForm(myForm)) {

    const formData = new FormData();

    formData.append("to", "as.kamaeva@yandex.ru");
    formData.append("name", myForm.elements.name.value);
    formData.append("phone", myForm.elements.phone.value)
    formData.append("comment", myForm.elements.comment.value);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');

    xhr.send(formData);
    xhr.addEventListener('load', function () {

      body.classList.add('hidden');
      let result = JSON.parse(xhr.response);

      if (result.status) {
        document.body.appendChild(successOverlay);
        const formClean = document.querySelector(".order__button_none");
        formClean.click();

      } else {
        document.body.appendChild(failOverlay);
      }
    });
  }

});


function createOverlay(content) {
  const overlayElement = document.createElement("div");
  overlayElement.classList.add("order__overlay");

  const template = document.querySelector("#overlayTemplate");
  overlayElement.innerHTML = template.innerHTML;
  overlayElement.addEventListener('click', function (e) {
    if (e.target == overlayElement) {
      closeElement.click();
    }
  });

  const closeElement = overlayElement.querySelector('.order__overlay_close');
  closeElement.addEventListener('click', function (e) {
    e.preventDefault();
    document.body.removeChild(overlayElement);
    body.classList.remove('hidden');
  });

  const contentElement = overlayElement.querySelector(".order__overlay_content");
  contentElement.innerHTML = content;


  return overlayElement;

}



function validateForm(myForm) {
  let valid = true;

  if (!validateField(myForm.elements.name)) {
    valid = false;
  }

  if (!validateField(myForm.elements.phone)) {
    valid = false;
  }

  if (!validateField(myForm.elements.street)) {
    valid = false;
  }

  if (!validateField(myForm.elements.house)) {
    valid = false;
  }

  if (!validateField(myForm.elements.apartment)) {
    valid = false;
  }

  return valid;

}

function validateField(order__block) {
  order__block.nextElementSibling.textContent = order__block.validationMessage;
  return order__block.checkValidity();

}

//яндекс карты

let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    center: [59.938477, 30.322235],
    zoom: 11,
    controls: []
  });

  const coords = [
    [59.975457, 30.314638],
    [59.950235, 30.385900],
    [59.931656, 30.271322],
    [59.945328, 30.241630]
  ];

  const myCollection = new ymaps.GeoObjectCollection({}, {

    draggable: false,
    iconLayout: 'default#image',
    iconImageHref: '../img/map-marker.svg',
    iconImageSize: [44, 55],
    iconImageOffset: [-35, -52]
  });

  for (var i = 0; i < coords.length; i++) {
    myCollection.add(new ymaps.Placemark(coords[i]));
  }

  myMap.geoObjects.add(myCollection);

  myMap.behaviors.disable('scrollZoom');
}

ymaps.ready(init);

//player

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: '640',
    height: '360',
    videoId: 'ZLywUPpuOig',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },

    playerVars: {
      'showinfo': 0,
      'rel': 0,
      'modestbranding': 1
    }

  });
}


function onPlayerReady(event) {
  event.target.playVideo();
}


let done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}


//onepage scroll

const sections = $(".section");
const display = $(".maincontent");

let inScroll = false;

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();

const countSectionPosition = (sectionEq) => {

  const position = sectionEq * -100;
  if (isNaN(position))
    console.error("передано не верное значение в countSectionPositon");

  return position;
};

const resetActiveClass = (item, eq) => {
  item.eq(eq).addClass("active").siblings().removeClass("active");
};

const resetSidebarActiveClass = (item, eq) => {
  item.eq(eq).addClass("sidebar__active").siblings().removeClass("sidebar__active");
};

const performTransition = (sectionEq) => {
  if (inScroll) return;

  inScroll = true;

  const position = countSectionPosition(sectionEq);
  const trasitionOver = 1000;
  const mouseInertionOver = 300;

  resetActiveClass(sections, sectionEq);

  display.css({
    transform: `translateY(${position}%)`,
  });

  setTimeout(() => {
    resetSidebarActiveClass($(".sidebar__item"), sectionEq);
    inScroll = false;
  }, trasitionOver + mouseInertionOver);
};

const scroller = () => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) {
        performTransition(nextSection.index());
      }
    },
    prev() {
      if (prevSection.length) {
        performTransition(prevSection.index());
      }
    },
  };
};

$(window).on("wheel", (e) => {
  const deltaY = e.originalEvent.deltaY;
  const windowScroller = scroller();

  if (deltaY > 0) {
    windowScroller.next();
  }

  if (deltaY < 0) {
    windowScroller.prev();
  }
});

$(document).on("keydown", (e) => {
  const tagName = e.target.tagName.toLowerCase();
  const windowScroller = scroller();
  const userTypingInInputs = tagName === "input" || tagName === "textarea";

  if (userTypingInInputs) return;

  switch (e.keyCode) {
    case 38:
      windowScroller.prev();
      break;
    case 40:
      windowScroller.next();
      break;
  }
});

$("[data-scroll-to]").on("click", (e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");

  performTransition(target);
});

if (isMobile) {
  // https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
  $("body").swipe({
    swipe: (event, direction) => {
      let scrollDirection;
      const windowScroller = scroller();

      if (direction === "up") scrollDirection = "next";
      if (direction === "down") scrollDirection = "prev";

      windowScroller[scrollDirection]();
    },
  });
}

//feeds

for (var i = 0; i < more.length; i++) {
  more[i].addEventListener('click', function () {
    let reviewParent = this.parentNode;
    let reviewText = reviewParent.querySelector('.feeds__text').innerText;


    let reviewOverlay = createOverlay(reviewText);
    document.body.appendChild(reviewOverlay);

  });
}

