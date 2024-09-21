//
const transactionBtn = document.querySelector(".load-transaction-btn");
const contentApp = document.querySelector(".content_app");
const headerAppSearch = document.querySelector(".header_app-search");
const transactionApp = document.querySelector(".loading_transaction_app");
const tableContainer = document.querySelector(".table_container");
const searchInput = document.querySelector(".search-input");
let allData = [];
let currentSortOrder = "asc";
let searchQuery = "";
// UI
function handleUI() {
  transactionApp.classList.add("hidden");
  contentApp.classList.remove("hidden");
  headerAppSearch.classList.remove("hidden");
}
function createTableData(data) {
  const rows = tableContainer.querySelectorAll("tr.table-data");
  rows.forEach((row) => row.remove());
  let result = ``;

  data.forEach((item) => {
    result += `
             <tr class="table-data">
               <td>${item.id}</td>
               <td class="${
                 item.type === "افزایش اعتبار"
                   ? "green_text"
                   : item.type === "برداشت از حساب"
                   ? "red_text"
                   : ""
               }">${item.type}</td>
               <td>${item.price}</td>
               <td>${item.refId}</td>
               <td>
                 ${new Date(item.date).toLocaleDateString("fa-IR", {
                   year: "numeric",
                   month: "2-digit",
                   day: "2-digit",
                 })} ساعت ${new Date(item.date).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    })}
               </td>
             </tr>
           `;
  });

  tableContainer.innerHTML += result;

  const priceTitle = document.querySelector(".price-title");
  priceTitle.addEventListener("click", (e) => {
    const chevronElement = priceTitle.querySelector(
      "img.table-header-icon.price-chevron"
    );
    chevronElement.classList.toggle("chevron-ascending");
    if (chevronElement.classList.contains("chevron-ascending")) {
      currentSortOrder = "asc";
    } else {
      currentSortOrder = "desc";
    }
    handleSortPriceData(e);
  });
  const dateTitle = document.querySelector(".date-title");
  dateTitle.addEventListener("click", (e) => {
    const chevronElement = dateTitle.querySelector(
      "img.table-header-icon.date-chevron"
    );
    chevronElement.classList.toggle("chevron-ascending");
    if (chevronElement.classList.contains("chevron-ascending")) {
      currentSortOrder = currentSortOrder = "asc";
    } else {
      currentSortOrder = currentSortOrder = "desc";
    }
    handleSortDateData(currentSortOrder);
  });
}
// SORT PRICE DATA AND TOGGLE CHEVRON ANIMATED
function handleSortPriceData(e) {
  sortPriceData(currentSortOrder);
}

function handleSortDateData(sort) {
  const sortDateData = allData.sort((a, b) => {
    if (sort === "asc") {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    } else if (sort === "desc") {
      return new Date(a.date) > new Date(b.date) ? 1 : -1;
    }
  });
  createTableData(sortDateData);
}

// EVENT

transactionBtn.addEventListener("click", () => {
  getData();
  handleUI();
});
searchInput.addEventListener("input", (e) => {
  searchQuery = searchInput.value;
  searchData(searchQuery);
});
searchInput.addEventListener("blur", () => {
  const priceTitle = document.querySelector(".price-title");
  const dateTitle = document.querySelector(".date-title");
  priceTitle.addEventListener("click", () => {
    SearchAndSortTogether(searchQuery, currentSortOrder);
  });
  dateTitle.addEventListener("click", () => {
    SearchAndSortTogether(searchQuery, currentSortOrder);
  });
});

// SERVER

async function getData() {
  const data = await axios
    .get("http://localhost:3000/transactions")
    .then((res) => res.data)
    .catch((err) => console.log(err.response.data));
  allData = data;
  createTableData(data);
}

async function sortPriceData(sort) {
  const data = await axios
    .get(`http://localhost:3000/transactions?_sort=price&_order=${sort}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  createTableData(data);
}

async function searchData(query) {
  const data = await axios
    .get(`http://localhost:3000/transactions?refId_like=${query}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  createTableData(data);
}

async function SearchAndSortTogether(query, sort) {
  console.log("run SearchAndSortTogether");
  const data = await axios
    .get(
      `http://localhost:3000/transactions?refId_like=${query}&_sort=price&_order=${sort}`
    )
    .then((res) => res.data)
    .catch((err) => console.log(err));
  console.log(query, sort);
  createTableData(data);
}
