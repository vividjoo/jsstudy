const API_KEY = "48d32d0e132a44259d160c8d8d0d0000";
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((value, key, i) => {
  value.addEventListener("click", (event) => {
    getNewsByCategory(event);
  });
});

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNewsByCategory = async (event) => {
  const category = event.target.id.toLowerCase();
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}&category=${category}`
  );

  getNew(url);
};

const getNew = async (url) => {
  try {
    // url.searchParams.set("page", page);
    // url.searchParams.set("pageSize", pageSize);

    let data = {};

    const response = await fetch(url);
    data = await response.json();

    if (data.totalResults > pageSize) {
      url = url.href + `&page=${page}&pageSize=${pageSize}`;
      console.log(url);
    }

    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("뉴스가 없습니다.");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render(url);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}&q=${keyword}`
  );
  getNew(url);
};

const getNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  getNew(url);
};

const render = async (url) => {
  const newsHTML = newsList
    .map(
      (news) =>
        `<div class="row news">
        <div class="col-lg-4">
          <img src="${news.urlToImage}" alt="" class="new-img-size">
        </div>
        <div class="col-lg-8">
          <h2>${news.title}</h2>
          <p>
            ${news.description}
          </p>
          <div>
            ${news.source.name} * ${news.publishedAt}
          </div>
        </div>
      </div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
  paginationRender(url);
};

const errorRender = (error) => {
  const errorHTML = `
  <div class="alert alert-danger" role="alert" style="display: flex; justify-content: center;">
    ${error}
  </div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = (url) => {
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  const lastPage = pageGroup * groupSize;
  // firstPage
  const firstPage = lastPage - (groupSize - 1);

  let paginationHTML = ``;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item" onclick="moveToPage('${i}',
      '${url}')"><a class="page-link">${i}</a></li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum, url) => {
  page = pageNum;
  console.log(url);
  getNew(url);
};

getNews();

// 1. 클릭 이벤트
// 2. 카테고리별 뉴스 가져오기
// 3. 해당 카테고리 뉴스 보여주기
