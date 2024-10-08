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
  }

  const messageElement = msgStatus.querySelector(".waiting-status");
  if (messageElement) {
    messageElement.remove();
    messageStatus = false;
  }

  if (data.length === 0 && !messageStatus) {
    msgStatus.innerHTML = `<h3 class="waiting-status">جستوجو یافت نشد</h3>`;
    messageStatus = true;
  }

  tableContainer.innerHTML += result;

  addSortEvent(document.querySelector(".price-title"), "price");
  addSortEvent(document.querySelector(".date-title"), "date");
}
// HANDEL SHEVRON ICON AND SORT EVENT
function addSortEvent(titleElement, key) {
  titleElement.addEventListener("click", () => {
    const chevronElement = titleElement.querySelector(
      `img.table-header-icon.${key}-chevron`
    );
    chevronElement.classList.toggle("chevron-ascending");
    chevronElement.classList.remove("hidden");
    currentSortOrder = chevronElement.classList.contains("chevron-ascending")
      ? "asc"
      : "desc";
    key === "price" ? handleSortPriceData() : handleSortDateData();
  });
}

// SORT PRICE DATA AND SORT DATE DATA
function handleSortPriceData() {
  const dataToSort = searchQuery ? searchAllData : allData;
  sortData(dataToSort, currentSortOrder, "price");
}

function handleSortDateData() {
  const dataToSort = searchQuery ? searchAllData : allData;
  sortData(dataToSort, currentSortOrder, "date");
}

function sortData(data, sort, key) {
  const sortedData = data.sort((a, b) => {
    if (key === "price") {
      return sort === "asc" ? a.price - b.price : b.price - a.price;
    } else if (key === "date") {
      return sort === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
  });
  if (key === "price") {
    sortPrice = sortedData;
  } else if (key === "date") {
    sortDate = sortedData;
  }
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
  try {
    const res = await axios.get("http://localhost:3000/transactions");
    allData = res.data;
    createTableData(allData);
  } catch (err) {
    console.log(err.response.data);
  }
}

async function searchData(query) {
  try {
    const res = await axios.get(
      `http://localhost:3000/transactions?refId_like=${query}`
    );
    searchAllData = res.data;
    sortData(
      searchAllData,
      currentSortOrder,
      sortPrice.length > 0
        ? "price"
        : sortDate.length > 0
        ? "date"
        : createTableData(res.data)
    );
  } catch (err) {
    console.log(err);
  }
}
