const urlDisplayDOM = document.querySelector(".url-display");
const loadingDOM = document.querySelector(".loading");
const urlInputDOM = document.querySelector(".url-input");
const formAlertDOM = document.querySelector(".form-alert");
const submitButton = document.querySelector(".btn-submit");
const tableBodyDOM = document.querySelector(".data-table-body");

//Create a new row for table
const createRow = (rowData) => {
  const { _id: deleteid, redirectURL, shortid } = rowData;
  const row = document.createElement("tr");
  row.classList.add("single-row-data");

  const urlCell = document.createElement("td");
  urlCell.textContent = redirectURL;
  row.appendChild(urlCell);
  console.log(redirectURL);
  const shortIdCell = document.createElement("td");
  const redirectLink = document.createElement("a");
  redirectLink.textContent = `https://url-shortener-3bbe.onrender.com/${shortid}`;
  redirectLink.href = `https://url-shortener-3bbe.onrender.com/${shortid}`;

  shortIdCell.appendChild(redirectLink);
  row.appendChild(shortIdCell);

  const optionCell = document.createElement("td");

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("delete-btn");
  deleteButton.dataset.id = deleteid;
  deleteButton.textContent = "Delete";
  optionCell.appendChild(deleteButton);
  row.appendChild(optionCell);

  return row;
};

//Show Data ()
const showData = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { shortID },
    } = await axios.get("/api/v1/");
    if (shortID.length < 1) {
      urlDisplayDOM.innerHTML =
        '<h5 class ="empty-list">No Data Available...</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }

    tableBodyDOM.innerHTML = "";

    for (const userId in shortID) {
      if (Object.hasOwnProperty.call(shortID, userId)) {
        const userData = shortID[userId];
        const row = createRow(userData);
        tableBodyDOM.appendChild(row);
      }
    }
  } catch (error) {
    console.log(error);
    urlDisplayDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try again later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showData();

//delete entry (row)

urlDisplayDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.dataset.id;
    try {
      await axios.delete(`/api/v1/${id}`);
      showData();
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

//form handling

submitButton.addEventListener("click", async (e) => {
  const url = urlInputDOM.value;

  try {
    await axios.post("/api/v1/", { url });

    await showData(); //await (to auto update table data)

    urlInputDOM.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `Short URL generated`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "none";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});
