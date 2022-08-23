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