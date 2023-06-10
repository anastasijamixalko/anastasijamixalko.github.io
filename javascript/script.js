const API_KEY = 'AIzaSyAunL6BMO-dpoqDZr-PGxBH5fD2g9KqZvc';
var API_GENRE = 'classic';
var results = 20;
var startIndex = 0;
var API_URL = `https://www.googleapis.com/books/v1/volumes?q=subject:${API_GENRE}&startIndex=${startIndex}&maxResults=${results}&key=${API_KEY}`;
var genresElements = document.querySelectorAll('.genres');
var searchInput = document.querySelector('.search_input');
var bodyComment = document.querySelector('.body_comment');
var bodyText = document.querySelectorAll('.body_text');
var bodySearch = document.querySelectorAll('.body_search');
var booksContainer = document.querySelector('.books');
var bodyContent = document.querySelector('.body_content');
var searchForm = document.querySelector(".search");
var scrollToTopBtn = document.getElementById("scrollToTopBtn");

var searchTitle;
var backButton;
var moreButton;
var data;
var totalItems;
var lastPicked;
var clearGenresTitle;

function getBooksByGenre(genre) {
  API_GENRE = genre;
  API_URL = `https://www.googleapis.com/books/v1/volumes?q=subject:${API_GENRE}&startIndex=${startIndex}&maxResults=${results}&key=${API_KEY}`;
  fetchData(API_URL);
  lastPicked = 'byGenre';
  clearGenresTitle = `Here are books of the ${API_GENRE} genre:`;
  clearGenres(clearGenresTitle);
  clearBodyText();
}

function clearBodyText() {
  for (var i = 0; i < bodySearch.length; i++) {
    var bodySearchElement = bodySearch[i];
    bodySearchElement.parentNode.removeChild(bodySearchElement);
  }
  for (var i = 0; i < bodyText.length; i++) {
    var bodyTextElement = bodyText[i];
    bodyTextElement.parentNode.removeChild(bodyTextElement);
  }
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Bad network');
    }
    data = await response.json();
    totalItems = data.totalItems;
    console.log(data);
    clearBooks(clearGenresTitle);
    createBooksCards(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function loadMoreBooks(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Bad network');
    }
    data = await response.json();
    totalItems = data.totalItems;
    console.log(data);
    createBooksCards(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

function clearBooks(comment) {
  booksContainer.innerHTML = '';
  if (bodyComment) {
    bodyComment.textContent = comment;
  }
}

function createBooksCards(data) {
  data.items.forEach(function (item) {
    var volumeInfo = item.volumeInfo;
    var bookCard = document.createElement('div');
    bookCard.className = 'body_book-card';

    var bookImage = document.createElement('img');
    bookImage.className = 'book-image';
    bookImage.src = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'storage/img/defaultbook.jpeg';
    bookImage.alt = volumeInfo.title;

    var bookInfo = document.createElement('div');
    bookInfo.className = 'book-info';
    bookInfo.title = `"${volumeInfo.title}" by ${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown author'}`;

    var bookTitle = document.createElement('p');
    bookTitle.className = 'book-title';
    bookTitle.textContent = volumeInfo.title;

    var bookAuthor = document.createElement('p');
    bookAuthor.className = 'book-author';
    bookAuthor.textContent = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown author';

    bookInfo.appendChild(bookTitle);
    bookInfo.appendChild(bookAuthor);

    bookCard.appendChild(bookImage);
    bookCard.appendChild(bookInfo);

    booksContainer.appendChild(bookCard);

    bookCard.addEventListener('click', function () {
      showBookDetails(item);
    });

    booksContainer.appendChild(bookCard);

  });
  deleteNavigationButtons();
  createNavigationButtons();
}

function createNavigationButtons() {
  backButton = document.createElement('a');
  backButton.className = 'back-to-genres_button';
  backButton.textContent = 'Back';

  moreButton = document.createElement('a');
  moreButton.className = 'more_button';
  moreButton.textContent = 'More';

  backButton.addEventListener('click', function () {
    location.reload();
  });
  moreButton.addEventListener('click', function () {
    if (startIndex + 20 < totalItems) {
      startIndex = startIndex + 20;
      if (lastPicked === 'byGenre'){
      API_URL = `https://www.googleapis.com/books/v1/volumes?q=subject:${API_GENRE}&startIndex=${startIndex}&maxResults=${results}&key=${API_KEY}`;

      } else if (lastPicked ==='byTitle'){
      API_URL=`https://www.googleapis.com/books/v1/volumes?q=title:${searchTitle}&startIndex=${startIndex}&maxResults=${results}&key=${API_KEY}`;
      }
      console.log(API_URL);
      console.log(startIndex);
      loadMoreBooks(API_URL)
    } else {
      if (moreButton) {
        moreButton.remove();
        moreButton = null;
      }
    }
    if (startIndex + 40 < totalItems) {
      if (moreButton) {
        moreButton.remove();
        moreButton = null;
      }
    }
  });

  bodyContent.appendChild(backButton);
  bodyContent.appendChild(moreButton);
}

function deleteNavigationButtons() {
  if (backButton) {
    backButton.remove();
    backButton = null;
  }
  if (moreButton) {
    moreButton.remove();
    moreButton = null;
  }
}

function showBookDetails(book) {
  deleteNavigationButtons();
  clearBooks(`Here is some information about "${book.volumeInfo.title}"`);

  var bookDetailsContainer = document.createElement('div');
  bookDetailsContainer.className = 'book-details';

  var bookImage = document.createElement('img');
  bookImage.className = 'book-image';
  bookImage.src = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'storage/img/defaultbook.jpeg';
  bookImage.alt = book.volumeInfo.title;

  var bookTitle = document.createElement('h2');
  bookTitle.textContent = book.volumeInfo.title;

  var bookAuthors = document.createElement('p');
  bookAuthors.textContent = 'Authors: ' + (book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown author');

  var bookSubtitle = document.createElement('p');
  bookSubtitle.textContent = 'Subtitle: ' + (book.volumeInfo.subtitle || 'No subtitle available.');

  var bookPublisher = document.createElement('p');
  bookPublisher.textContent = 'Publisher: ' + (book.volumeInfo.publisher || 'No information.');

  var bookRating = document.createElement('p');
  bookRating.textContent = 'Rating: ' + (book.volumeInfo.averageRating || 'No information.');

  var bookDescription = document.createElement('p');
  bookDescription.textContent = 'Description: ' + (book.volumeInfo.description || 'No description available.');

  var bookLink = document.createElement('a');
  bookLink.href = book.volumeInfo.infoLink;
  bookLink.textContent = 'More Info';

  var backButton = document.createElement('a');
  backButton.textContent = 'Back';
  backButton.addEventListener('click', function () {
    startIndex = 0;
    clearGenres(clearGenresTitle);
    fetchData(API_URL);
    createBooksCards(data);
    startIndex = 0;
  });
  bookDetailsContainer.appendChild(bookImage);
  bookDetailsContainer.appendChild(bookTitle);
  bookDetailsContainer.appendChild(bookAuthors);
  bookDetailsContainer.appendChild(bookSubtitle);
  bookDetailsContainer.appendChild(bookPublisher);
  bookDetailsContainer.appendChild(bookRating);
  bookDetailsContainer.appendChild(bookDescription);
  bookDetailsContainer.appendChild(bookLink);
  bookDetailsContainer.appendChild(backButton);
  booksContainer.appendChild(bookDetailsContainer);
}

function clearGenres(comment) {
  for (var i = 0; i < genresElements.length; i++) {
    while (genresElements[i].firstChild) {
      genresElements[i].removeChild(genresElements[i].firstChild);
    }
  }
  if (bodyComment) {
    bodyComment.textContent = comment;
  }
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  lastPicked = 'byTitle';
  searchTitle = searchInput.value;
  API_URL = `https://www.googleapis.com/books/v1/volumes?q=title:${searchTitle}&startIndex=${startIndex}&maxResults=${results}&key=${API_KEY}`;
  clearBodyText();
  clearGenresTitle = `Here are results for your request: ${searchTitle}`;
  clearGenres(clearGenresTitle);
  fetchData(API_URL);
  createBooksCards(data);
});

window.addEventListener("scroll", function() {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
