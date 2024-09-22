const transactionBtn = document.querySelector(".load-transaction-btn");
const contentApp = document.querySelector(".content_app");
const headerAppSearch = document.querySelector(".header_app-search");
const transactionApp = document.querySelector(".loading_transaction_app");
const tableContainer = document.querySelector(".table_container");
const searchInput = document.querySelector(".search-input");
const msgStatus = document.querySelector(".msg-status");
let allData = [];
let searchAllData = [];
let sortPrice = [];
let sortDate = [];
let currentSortOrder = "asc";
let searchQuery = "";
let messageStatus = false;
// UI
function handleUI() {
  transactionApp.classList.add("hidden");
  contentApp.classList.remove("hidden");
  headerAppSearch.classList.remove("hidden");
}
function createTableData(data) {
  const rows = tableContainer.querySelectorAll("tr.table-data");
  rows.forEach((row) => row.remove());
  let result = "";
  let message = "";
  if (data.length) {
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
  } else {
    if (!messageStatus) {
      message = `<h3 class="waiting-status">جستوجو یافت نشد</h3>`;
      messageStatus = true;
    }
  }

  if (data.length > 0) {
    const messageElement = msgStatus.querySelectorAll(".waiting-status");
    if (messageElement) {
      messageElement.forEach((item) => {
        item.classList.add("hidden");
      });
    }
    messageStatus = false;
  }
  msgStatus.innerHTML += message;
  tableContainer.innerHTML += result;

  const priceTitle = document.querySelector(".price-title");
  priceTitle.addEventListener("click", (e) => {
    const chevronElement = priceTitle.querySelector(
      "img.table-header-icon.price-chevron"
    );
    chevronElement.classList.remove("hidden");
    chevronElement.classList.toggle("chevron-ascending");
    if (chevronElement.classList.contains("chevron-ascending")) {
      currentSortOrder = "asc";
    } else {
      currentSortOrder = "desc";
    }
    handleSortPriceData();
  });
  const dateTitle = document.querySelector(".date-title");
  dateTitle.addEventListener("click", (e) => {
    const chevronElement = dateTitle.querySelector(
      "img.table-header-icon.date-chevron"
    );
    chevronElement.classList.toggle("chevron-ascending");
    chevronElement.classList.remove("hidden");
    if (chevronElement.classList.contains("chevron-ascending")) {
      currentSortOrder = currentSortOrder = "asc";
    } else {
      currentSortOrder = currentSortOrder = "desc";
    }
    handleSortDateData();
  });
}
// SORT PRICE DATA AND SORT DATE DATA
function handleSortPriceData() {
  const dataToSort = searchQuery ? searchAllData : allData;
  sortPriceData(dataToSort, currentSortOrder);
}

function sortPriceData(data, sort) {
  const sortedData = data.sort((a, b) => {
    return sort === "asc" ? a.price - b.price : b.price - a.price;
  });
  sortPrice = sortedData;
  createTableData(sortedData);
}

function handleSortDateData() {
  const dataToSort = searchQuery ? searchAllData : allData;
  sortDateData(dataToSort, currentSortOrder);
}

function sortDateData(data, sort) {
  const sortedData = data.sort((a, b) => {
    return sort === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });
  sortDate = sortedData;
  createTableData(sortedData);
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

// SERVER

async function getData() {
  const data = await axios
    .get("http://localhost:3000/transactions")
    .then((res) => res.data)
    .catch((err) => console.log(err.response.data));
  allData = data;
  createTableData(data);
}

async function searchData(query) {
  const data = await axios
    .get(`http://localhost:3000/transactions?refId_like=${query}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));

  searchAllData = data;

  if (currentSortOrder) {
    if (sortPrice.length > 0) {
      sortPriceData(data, currentSortOrder);
    } else if (sortDate.length > 0) {
      sortDateData(data, currentSortOrder);
    } else {
      createTableData(data);
    }
  } else {
    createTableData(data);
  }
}
