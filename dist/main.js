/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/components/main.js":
/*!****************************************!*\
  !*** ./src/scripts/components/main.js ***!
  \****************************************/
/***/ (() => {

if (window.location.pathname == '/') {
  window.location.pathname = '/index.html';
}

if (document.location.pathname === '/index.html') {
  const POSTS_CONTAINER = document.getElementById('posts-box');
  const PAGINATION_CONTAINER = document.getElementById('pagination-box');
  const PAGE_PARAMS = new URLSearchParams(window.location.search);

  // Создаём бокс пагинации
  async function createPagination(pageNum) {
    const LIST = await getPostsList(pageNum);
    const PAGINATION_BOX = document.createElement('div');
    const PAGINATION_LENGTH = document.createElement('span');
    const PAGINATION_INPUT = document.createElement('input');

    // Если пагинация уже есть - удаляем
    if (document.querySelector('.pagination__box')) {
      document.querySelector('.pagination__box').remove();
    }

    // В цикле созаём 5 кнопок пагинации
    for (let i = -2; i < 3; ++i) {
      const PAGINATION_LINK = document.createElement('button');

      // Если страница === 1, В пагинации начинаем счёт с 1 
      if (Number(LIST.meta.pagination.page) === 1) {
        PAGINATION_LINK.textContent = Number(LIST.meta.pagination.page) + i + 2;
        PAGINATION_LINK.setAttribute('pageNumber', `${Number(LIST.meta.pagination.page) + i + 2}`);
      }

      // Если страница === 2, В пагинации начинаем счёт с 1 
      if (Number(LIST.meta.pagination.page) === 2) {
        PAGINATION_LINK.textContent = Number(LIST.meta.pagination.page) + i + 1;
        PAGINATION_LINK.setAttribute('pageNumber', `${Number(LIST.meta.pagination.page) + i + 1}`);
      }

      // Если страница >= 3, но меньше чем -2 от конца списка страниц, активную страницу делаем в центре кнопок пагинации 
      if (Number(LIST.meta.pagination.page) > 2 && Number(LIST.meta.pagination.page) <= (Number(LIST.meta.pagination.pages) - 2)) {
        PAGINATION_LINK.textContent = Number(LIST.meta.pagination.page) + i;
        PAGINATION_LINK.setAttribute('pageNumber', `${Number(LIST.meta.pagination.page) + i}`);
      }
      
      // Если страница === -2 от конца списка страниц, пагинация заканчивается концом списка 
      if (Number(LIST.meta.pagination.page) === (Number(LIST.meta.pagination.pages)) - 1) {
        PAGINATION_LINK.textContent = Number(LIST.meta.pagination.page) + i - 1;
        PAGINATION_LINK.setAttribute('pageNumber', `${Number(LIST.meta.pagination.page) + i - 1}`);
      }

      // Если страница === -1 от конца списка страниц, пагинация заканчивается концом списка 
      if (Number(LIST.meta.pagination.page) === (Number(LIST.meta.pagination.pages))) {
        PAGINATION_LINK.textContent = Number(LIST.meta.pagination.page) + i - 2;
        PAGINATION_LINK.setAttribute('pageNumber', `${Number(LIST.meta.pagination.page) + i - 2}`);
      }

      PAGINATION_LINK.classList.add('pagination__btn');
      PAGINATION_BOX.classList.add('pagination__box');

      // Вешаем отдельный класс на активную старницу
      if (PAGINATION_LINK.getAttribute('pageNumber') == Number(LIST.meta.pagination.page)) {
        PAGINATION_LINK.classList.add('pagination__btn--active');
      }
      
      PAGINATION_BOX.append(PAGINATION_LINK);
    }
    
    PAGINATION_LENGTH.textContent = ` из ${Number(LIST.meta.pagination.pages)} страниц. Быстрый переход:`
    PAGINATION_LENGTH.classList.add('pagination__length')

    PAGINATION_INPUT.setAttribute('id', 'pagination-number')
    PAGINATION_INPUT.setAttribute('type', 'number')
    PAGINATION_INPUT.setAttribute('min', '1')
    PAGINATION_INPUT.classList.add('pagination__input')


    PAGINATION_BOX.append(PAGINATION_LENGTH);
    PAGINATION_BOX.append(PAGINATION_INPUT);
    PAGINATION_CONTAINER.append(PAGINATION_BOX);

    // Вешаем на кнопки обработчики события для перехода на нужную страницу
    setListenerOnPaginationBtn(LIST);

    setListenerOnPaginationInput(LIST);
  }
  
  createPagination(PAGE_PARAMS.get('page'));
  
  // Обработчик события 'click' для кнопок пагинации для перехода на нужную страницу
  function setListenerOnPaginationBtn() {
    const PAGINATION_BTN = document.querySelectorAll('.pagination__btn');
  
    PAGINATION_BTN.forEach((e) => {
      const ATTR = e.getAttribute('pageNumber');

      e.addEventListener('click', () => {
        PAGE_PARAMS.set('page', `${ATTR}`);
        createPagination(PAGE_PARAMS.get('page'));
        createPostsList(PAGE_PARAMS.get('page'));
      });
    });
  }

  // обработчик события 'input' для ввода номера страницы вручную
  function setListenerOnPaginationInput(LIST) {
    const PAGINATION_INPUT = document.getElementById('pagination-number');
    let inputDelay
    
    function input() {
      PAGE_PARAMS.set('page', PAGINATION_INPUT.value);
      createPagination(PAGE_PARAMS.get('page'));
      createPostsList(PAGE_PARAMS.get('page'));
      }
      
      PAGINATION_INPUT.addEventListener('input', () => {
        // по вводузначения в строку проверяем максимальную страницу и не даём вводить значение больше
        if (PAGINATION_INPUT.value > Number(LIST.meta.pagination.pages)) {
          PAGINATION_INPUT.value = Number(LIST.meta.pagination.pages)
        }

        // Делаем небольшую задержку вывода информации после ввода страницы
        clearTimeout(inputDelay)
        inputDelay = setTimeout(() => {
          input()
        }, 800);
    });
  }

// Создаём список постов на выбранной странице
  async function createPostsList(pageNum) {
    const LIST = await getPostsList(pageNum);

    // Если посты уже есть - удаляем
    if (document.querySelector('.post-prev')) {
      document.querySelectorAll('.post-prev').forEach((e) => {
        e.remove();
      })
    }

    for (let i = 0; i < LIST.data.length; ++i) {
      const POST = document.createElement('article');
      const USER = document.createElement('p');
      const TITLE = document.createElement('h3');
      const BODY = document.createElement('p');
      const LINK = document.createElement('a');

      POST.classList.add('post-prev');
      TITLE.classList.add('post-prev__title');
      BODY.classList.add('post-prev__body');
      USER.classList.add('post-prev__user');
      LINK.classList.add('post-prev__link');

      TITLE.textContent = LIST.data[i].title;
      BODY.textContent = LIST.data[i].body;
      USER.textContent = LIST.data[i].user_id;

      LINK.setAttribute('href', `post.html?page=${Number(LIST.meta.pagination.page)}&post_id=${LIST.data[i].id}`)

      POST.append(TITLE);
      POST.append(BODY);
      POST.append(USER);
      POST.append(LINK);
      POSTS_CONTAINER.append(POST);
    }
  }

  createPostsList(PAGE_PARAMS.get('page'));

// отпраляем запрос на сервер для получения списка постов 
  async function getPostsList(pageNum) {
    const RESPONSE = await fetch(`https://gorest.co.in/public-api/posts?page=${pageNum}`);
    const RESULT = await RESPONSE.json();

    return RESULT;
  }
}

/***/ }),

/***/ "./src/scripts/components/post.js":
/*!****************************************!*\
  !*** ./src/scripts/components/post.js ***!
  \****************************************/
/***/ (() => {

if (document.location.pathname === '/post.html') {
  const POST_CONTAINER = document.getElementById('post-box');
  const COMMENT_CONTAINER = document.createElement('div');
  const COMMENT_BOX = document.createElement('div');
  const PAGE_PARAMS = new URLSearchParams(window.location.search);
  const BACK_LINK = document.getElementById('post-back-link');

  COMMENT_CONTAINER.classList.add('comment__container');
  COMMENT_BOX.classList.add('comment__box');
  BACK_LINK.setAttribute('href', `index.html?page=${PAGE_PARAMS.get('page')}`);

  COMMENT_CONTAINER.append(COMMENT_BOX);

  // Создаём пост с новостью
  async function createPost() {
    const LIST = await getPostData();
    const POST = document.createElement('article');
    const TITLE = document.createElement('h1');
    const BODY = document.createElement('p');
    const USER = document.createElement('p');

    TITLE.textContent = LIST.data.title;
    BODY.textContent = LIST.data.body;
    USER.textContent = `ID автора ${LIST.data.user_id}`;

    POST.classList.add('post__article');
    TITLE.classList.add('post__title');
    BODY.classList.add('post__body');
    USER.classList.add('post__user');

    POST.append(TITLE);
    POST.append(BODY);
    POST.append(USER);
    POST_CONTAINER.prepend(POST);
  }
  createPost();

  // Создаём пагинацию для списка комментариев
  async function createPaginationComents(page) {
    const LIST = await getCommentData(page);
    const PAGINATION_BOX = document.createElement('div');
    const COMMENT_TITLE = document.createElement('h2');
    const PAGINATION_INPUT_BOX = document.createElement('div');
    const PAGINATION_INPUT = document.createElement('input');
    const PAGINATION_LENGTH = document.createElement('label');

    COMMENT_TITLE.textContent = 'Комментарии';
    PAGINATION_INPUT.value = LIST.meta.pagination.page;
    PAGINATION_INPUT.setAttribute('type', 'number');
    PAGINATION_INPUT.setAttribute('min', '1');
    PAGINATION_INPUT.setAttribute('id', 'comment-page-input');
    PAGINATION_LENGTH.textContent = ` из ${LIST.meta.pagination.pages} страниц`;
    PAGINATION_LENGTH.setAttribute('for', 'comment-page-input')

    PAGINATION_BOX.classList.add('comment__pagination-box')
    COMMENT_TITLE.classList.add('comment__title');
    PAGINATION_INPUT_BOX.classList.add('comment__pagination-input-box')
    PAGINATION_INPUT.classList.add('comment__pagination-input')
    PAGINATION_LENGTH.classList.add('comment__pagination-length')
    
    // Если пагинация уже есть - удаляем
    if (document.querySelector('.comment__pagination-box')) {
      document.querySelector('.comment__pagination-box').remove();
      document.querySelector('.comment__title').remove();
    }
    
    PAGINATION_INPUT_BOX.prepend(PAGINATION_INPUT);
    PAGINATION_INPUT_BOX.append(PAGINATION_LENGTH);
    PAGINATION_BOX.prepend(COMMENT_TITLE);
    PAGINATION_BOX.append(PAGINATION_INPUT_BOX);
    COMMENT_BOX.prepend(PAGINATION_BOX);

    // Вешаем инпут обработчик события для перехода на нужную страницу
    setListenerOnPaginationInput(LIST);
  }
  createPaginationComents();

  // Обработчик события 'input' для кнопок пагинации для перехода на нужную страницу
  function setListenerOnPaginationInput(LIST) {
    const PAGINATION_INPUT = document.querySelector('.comment__pagination-input');
    let inputDelay

    function input() {
      createPaginationComents(PAGE_PARAMS.get('com_page'));
      createComments(PAGE_PARAMS.get('com_page'));
    }

    // Делаем небольшую задержку между вводом значения и выводом списка
    if (PAGINATION_INPUT) {
      PAGINATION_INPUT.addEventListener('input', () => {
        if (PAGINATION_INPUT.value > LIST.meta.pagination.pages) {
          PAGINATION_INPUT.value = LIST.meta.pagination.pages;
        }
        PAGE_PARAMS.set('com_page', `${PAGINATION_INPUT.value}`)
        clearTimeout(inputDelay)
        inputDelay = setTimeout(() => {
          input();
        }, 300);
      });
    }
  }

// Создаём форму добавления нового комментария
function createFormNewComment() {
  const NEW_COMMENT_CONTAINER = document.createElement('div');
  const NEW_COMMENT_FORM = document.createElement('form');
  const NEW_COMMENT_TITLE = document.createElement('h2');
  const NEW_COMMENT_NAME = document.createElement('input');
  const NEW_COMMENT_EMAIL = document.createElement('input');
  const NEW_COMMENT_BODY = document.createElement('input');
  const NEW_COMMENT_BTN = document.createElement('button');

  NEW_COMMENT_CONTAINER.classList.add('add-comment');
  NEW_COMMENT_FORM.classList.add('add-comment__form');
  NEW_COMMENT_TITLE.classList.add('add-comment__title');
  NEW_COMMENT_NAME.classList.add('add-comment__name', 'add-comment__input');
  NEW_COMMENT_EMAIL.classList.add('add-comment__email', 'add-comment__input');
  NEW_COMMENT_BODY.classList.add('add-comment__body', 'add-comment__input');
  NEW_COMMENT_BTN.classList.add('add-comment__btn', 'add-comment__input');

  NEW_COMMENT_TITLE.textContent = 'Добавить новый комментарий';
  NEW_COMMENT_NAME.setAttribute('placeholder', 'Введите имя');
  NEW_COMMENT_NAME.setAttribute('name', 'name');
  NEW_COMMENT_NAME.setAttribute('autocomplete', '');
  NEW_COMMENT_EMAIL.setAttribute('placeholder', 'Введите e-mail');
  NEW_COMMENT_EMAIL.setAttribute('type', 'email');
  NEW_COMMENT_BODY.setAttribute('placeholder', 'Введите комментарий');
  NEW_COMMENT_BODY.setAttribute('type', 'text');
  NEW_COMMENT_BTN.textContent = 'Отправить';

  // Убираем у формы стандартное поведение создаём новый комментарий, обновляем таблицу и сбрасываем форму
  NEW_COMMENT_FORM.onsubmit = (e) => {
    e.preventDefault();
    createNewComment(NEW_COMMENT_NAME.value.trim(), NEW_COMMENT_EMAIL.value.trim(), NEW_COMMENT_BODY.value.trim());
    NEW_COMMENT_FORM.reset();
    createComments(PAGE_PARAMS.get('com_page'));
  }

  NEW_COMMENT_FORM.append(NEW_COMMENT_NAME);
  NEW_COMMENT_FORM.append(NEW_COMMENT_EMAIL);
  NEW_COMMENT_FORM.append(NEW_COMMENT_BODY);
  NEW_COMMENT_FORM.append(NEW_COMMENT_BTN);

  NEW_COMMENT_CONTAINER.prepend(NEW_COMMENT_TITLE);
  NEW_COMMENT_CONTAINER.append(NEW_COMMENT_FORM);
  COMMENT_CONTAINER.prepend(NEW_COMMENT_CONTAINER);
}
createFormNewComment();

  // Создаём список комментариев
  async function createComments(page) {
    const LIST = await getCommentData(page);

    // Если есть хоть один комментарий, удаляем все
    if (document.querySelector('.comment')) {
      document.querySelectorAll('.comment').forEach((e) => {
        e.remove();
      });
    }

    // Пробегаемся по массиву коментариев и создаём все
    for (let i in LIST.data) {
      const COMMENT = document.createElement('article');
      const COMMENT_AUTHOR = document.createElement('h3');
      const COMMENT_EMAIL = document.createElement('p');
      const COMMENT_BODY = document.createElement('p');
      COMMENT_AUTHOR.textContent = LIST.data[i].name;
      COMMENT_EMAIL.textContent = `(${LIST.data[i].email})`;
      COMMENT_BODY.textContent = LIST.data[i].body;

      COMMENT.classList.add('comment');
      COMMENT_AUTHOR.classList.add('comment__author');
      COMMENT_EMAIL.classList.add('comment__email');
      COMMENT_BODY.classList.add('comment__body');

      COMMENT.append(COMMENT_AUTHOR);
      COMMENT.append(COMMENT_EMAIL);
      COMMENT.append(COMMENT_BODY);
      COMMENT_BOX.append(COMMENT);
    }

    POST_CONTAINER.append(COMMENT_CONTAINER);
  }
  createComments();

  // Запрашиваем с сервера данные о посте
  async function getPostData() {
    const REQUEST = await fetch(`https://gorest.co.in/public-api/posts/${PAGE_PARAMS.get('post_id')}`);
    const RESULT = await REQUEST.json();

    return RESULT;
  }

  // Запрашиваем с сервера данные о комментариях
  async function getCommentData(page) {
    const REQUEST = await fetch(`https://gorest.co.in/public-api/comments?post_id=${PAGE_PARAMS.get('post_id')}&page=${page}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 6e3f8db40faa8ff7cc1016ad04528011604ba032f018cca91f5fa2cfb15984d2',
      },
    });
    const RESULT = await REQUEST.json();

    return RESULT;
  }

  // Отправляем на сервер запрос на добавление нового комментария
  async function createNewComment(nameVal, emailVal, textVal) {
    const REQUEST = await fetch('https://gorest.co.in/public-api/comments', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer 6e3f8db40faa8ff7cc1016ad04528011604ba032f018cca91f5fa2cfb15984d2',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ post_id: PAGE_PARAMS.get('post_id'), name: `${nameVal}`, email: `${emailVal}`, body: `${textVal}` }),
    });
    const RESULT = await REQUEST.json();

    return RESULT;
  }
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./src/scripts/main.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/main */ "./src/scripts/components/main.js");
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_main__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_post__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/post */ "./src/scripts/components/post.js");
/* harmony import */ var _components_post__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_components_post__WEBPACK_IMPORTED_MODULE_1__);


})();

/******/ })()
;
//# sourceMappingURL=main.js.map