let data = [];
let matchData = [];
let filterType = "all";
const showList = document.querySelector(".showList");
const btnGroup = document.querySelector(".button-group");
const btnType = document.querySelectorAll(".btn-type");
const crop = document.getElementById("crop");
const search = document.querySelector(".search");
const searchTxt = document.getElementById("js-crop-name");
const selection = document.getElementById("js-select");
const sortAdvance = document.querySelector(".js-sort-advanced");

axios
  .get("https://hexschool.github.io/js-filter-data/data.json")
  .then(function (res) {
    data = res.data.filter((item) => item["作物名稱"]);
    renderData(data);
  })
  .catch(function (err) {
    console.log(err);
  });

function renderData(arr) {
  let str = "";
  arr.forEach(function (item) {
    str += `
      <tr>
        <td>${item.作物名稱}</td>
        <td>${item.上價}</td>
        <td>${item.中價}</td>
        <td>${item.下價}</td>
        <td>${item.平均價}</td>
        <td>${item.交易量}</td>
      </tr>
    `;
  });
  showList.innerHTML = str;
}

//切換分類
btnGroup.addEventListener("click", function (e) {
  if (e.target.getAttribute("data-type")) {
    filterType = e.target.getAttribute("data-type");
  }
  btnType.forEach(function (item) {
    if (item.getAttribute("data-type") == filterType) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
  crop.value = "";
  searchTxt.textContent = "";
  filterData();
});

//篩選列表
function filterData() {
  const newData = data.filter(function (item) {
    if (filterType == "all") {
      return item;
    }
    return item.種類代碼 == filterType;
  });
  matchData = newData;
  renderData(newData);
}

//搜尋列表
crop.addEventListener("change", searchCrop);
search.addEventListener("click", searchCrop);

function searchCrop() {
  let cropTxt = crop.value.trim();
  let searchData = data.filter(function (item) {
    if (cropTxt) {
      if (item.作物名稱) {
        searchTxt.textContent = `以下為「${cropTxt}」的搜尋結果`;
        return item.作物名稱.match(cropTxt);
      }
    } else {
      searchTxt.textContent = "";
      return item;
    }
  });
  if (searchData.length == 0) {
    showList.innerHTML = `<tr>
    <td colspan="6" class="text-center p-3">查詢不到交易資訊QQ</td>
    </tr>`;
  } else {
    renderData(searchData);
  }
}

//排序篩選
selection.addEventListener("change", function () {
  switch (selection.value) {
    case "依上價排序":
      changeSelect("上價");
      break;
    case "依中價排序":
      changeSelect("中價");
      break;
    case "依下價排序":
      changeSelect("下價");
      break;
    case "依平均價排序":
      changeSelect("平均價");
      break;
    case "依交易量排序":
      changeSelect("交易量");
      break;
    default:
      break;
  }
});

function changeSelect(value) {
  matchData.sort((a, b) => {
    return b[value] - a[value];
  });
  renderData(matchData);
}

//箭頭排序
sortAdvance.addEventListener("click", function (e) {
  const arrow = e.target.getAttribute("data-sort");
  const price = e.target.getAttribute("data-price");
  if (arrow == "up") {
    matchData.sort((a, b) => {
      return b[price] - a[price];
    });
  } else if (arrow == "down") {
    matchData.sort((a, b) => {
      return a[price] - b[price];
    });
  }
  renderData(matchData);
});
