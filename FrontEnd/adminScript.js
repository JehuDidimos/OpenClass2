document.addEventListener("DOMContentLoaded", () => {
  let finalGalleryList;
  checkToken();
  getGallery();

  let closeButtons = document.querySelectorAll(".btn-close");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeEditModal();
    });
  });

  let backButton = document.querySelector(".back-btn");
  backButton.addEventListener("click", () => {
    backToDelete();
  });

  let overlay = document.querySelector(".overlay");
  overlay.addEventListener("click", () => {
    closeEditModal();
  });

  let addButton = document.querySelector(".add-project-button");
  addButton.addEventListener("click", () => {
    addProjectModal();
  });

  imageInput = document.querySelector("#photo");
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    changeImagePreview(file);
  });

  let formListener = document.querySelector("#new-project");
  formListener.addEventListener("change", () => {
    updateSubmitButton()
  })
  formListener.addEventListener("input", () => {
    updateSubmitButton()
  })

  let submitProject = document.querySelector(".submit-project-button");
  submitProject.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("CLICKED1");
    submitForm();
  });
});

function updateSubmitButton(){
  const form = document.querySelector("#new-project");
  const isValid = form.checkValidity();

  const submitButton = document.querySelector('.submit-project-button');
  submitButton.disabled = !isValid;
}

function changeImagePreview(file) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    let preview = document.querySelector(".preview-image");
    reader.onload = function (e) {
      preview.src = e.target.result;
    };

    reader.onerror = function (err) {
      console.error("FileReader error", err);
    };
    reader.readAsDataURL(file);
    let previewArea = document.querySelector(".photo-input");
    let inputArea = document.querySelector(".photo-button-wrapper");
    previewArea.insertBefore(preview, inputArea);
    inputArea.classList.add("hidden");
  } else {
    window.alert("Please select an image");
  }
}

async function submitForm() {
  let title = document.querySelector("#title");
  let category = document.querySelector("#category");
  let photo = document.querySelector("#photo");

  console.log(title.value);
  console.log(category.value);
  console.log(photo.files[0]);

  console.log(category.value);

  let formData = new FormData();
  formData.append("image", photo.files[0]);
  formData.append("title", `${title.value}`);
  formData.append("category", `${category.value}`);

  const url = "http://localhost:5678/api/works";
  const request = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: formData,
  };

  let response = await fetch(url, request).then(async (response) => {
    console.log(response);
  });

  getGallery();

  const form = document.querySelector("#new-project");
  const previewImg = document.querySelector(".preview-image");
  const fileInputWrapper = document.querySelector(".photo-button-wrapper");
  form.reset();
  previewImg.removeAttribute("src");
  previewImg.alt = "";
  fileInputWrapper.classList.remove("hidden");
}

function backToDelete() {
  let deleteModal = document.querySelector(".delete-modal");
  let addModal = document.querySelector(".add-modal");

  deleteModal.classList.remove("hidden");
  addModal.classList.add("hidden");
}

function addProjectModal() {
  let deleteModal = document.querySelector(".delete-modal");
  deleteModal.classList.add("hidden");

  let addModal = document.querySelector(".add-modal");
  addModal.classList.remove("hidden");
}

function checkToken() {
  if (sessionStorage.getItem("token")) {
    const token = sessionStorage.getItem("token");
    addEditStyling();
    logoutFunction();
    let editButton = document.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
      openModal();
    });
  } else {
    console.log("No Token");
    getCategories();
    const logoutButton = document.querySelector(".logout-button");
    logoutButton.classList.add("hidden");
    const loginButton = document.querySelector(".login-button");
    loginButton.classList.remove("hidden");
    const editIndicator = document.querySelector(".edit-indicator");
    if(editIndicator){
      editIndicator.remove();
    }

    const editButton = document.querySelector(".edit-button");
    if(editButton){
      editButton.remove();
    }
  }
}

function logoutFunction() {
  const logoutButton = document.querySelector(".logout-button");
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    checkToken();
  });
}

function addEditStyling() {
  const editIndicator = document.createElement("div");
  editIndicator.className = "edit-indicator";
  const logoutButton = document.querySelector(".logout-button");
  logoutButton.classList.remove("hidden");
  const loginButton = document.querySelector(".login-button");
  loginButton.classList.add("hidden");
  const header = document.querySelector("header");
  const target = document.querySelector("body");
  target.insertBefore(editIndicator, header);
  editIndicator.innerHTML = `
    <i class="fa-regular fa-pen-to-square fa-lg" style="color: #ffffff;"></i>
    <p>Editing Mode</p>
  `;

  const portfolioTarget = document.querySelector("#portfolio");
  const galleryTarget = document.querySelector(".gallery");
  const editDiv = document.createElement("div");
  editDiv.innerHTML = `
    <h2>My Projects</h2>
    <button class="edit-button">
      <i class="fa-regular fa-pen-to-square fa-lg" style="color: #000000ff;"></i>
      <p>Edit</p>
    </button>
  `;
  editDiv.className = "project-edit";

  portfolioTarget.insertBefore(editDiv, galleryTarget);
}

async function getCategories() {
  try {
    const url = "http://localhost:5678/api/categories";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }

    const responseJson = await response.json();
    createFilterButtons(responseJson);
  } catch (error) {
    console.log(error.message);
  }
}

function createFilterButtons(categoryList) {
  const gallery = document.querySelector(".gallery");
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "filter-wrapper";
  const targetLocation = document.querySelector("#portfolio");
  targetLocation.insertBefore(buttonWrapper, gallery);

  let filterButton = document.createElement("button");
  filterButton.textContent = "All";
  filterButton.className = "filter-button";
  filterButton.id = "active-filter";
  filterButton.name = "All";
  filterButton.addEventListener("click", (e) => {
    activateFilter(e);
  });

  buttonWrapper.appendChild(filterButton);
  for (cat of categoryList) {
    filterButton = document.createElement("button");
    filterButton.textContent = cat.name;
    filterButton.className = "filter-button";
    filterButton.name = cat.name;
    filterButton.addEventListener("click", (e) => {
      activateFilter(e);
    });
    buttonWrapper.appendChild(filterButton);
  }
}

function activateFilter(e) {
  let currentFilter = document.querySelector("#active-filter");
  currentFilter.id = "";
  e.srcElement.id = "active-filter";
  currentFilter = document.querySelector("#active-filter");
  filterGallery(currentFilter.name);
}

function filterGallery(filterName) {
  const galleryDiv = document.querySelector(".gallery");

  let childrenList = galleryDiv.querySelectorAll("figure");
  childrenList.forEach((child) => child.remove());

  if (filterName == "All") {
    for (item of finalGalleryList) {
      const element = document.createElement("figure");
      const htmlFigure = `
                <img src="${item.imageUrl}" alt="${item.title}">
                <figcaption>${item.title}</figcaption>
            `;
      element.innerHTML = htmlFigure;

      galleryDiv.appendChild(element);
    }
  } else {
    for (item of finalGalleryList) {
      if (item.category.name == filterName) {
        const element = document.createElement("figure");
        const htmlFigure = `
                <img src="${item.imageUrl}" alt="${item.title}">
                <figcaption>${item.title}</figcaption>
            `;
        element.innerHTML = htmlFigure;
        galleryDiv.appendChild(element);
      }
    }
  }
}

function openModal() {
  let modal = document.querySelector(".modal-section");
  modal.classList.remove("hidden");

  let deleteModal = document.querySelector(".delete-modal");
  if (deleteModal.classList.contains("hidden")) {
    deleteModal.classList.remove("hidden");
  }

  let overlay = document.querySelector(".overlay");
  overlay.classList.remove("hidden");
}

function closeEditModal() {
  let modal = document.querySelector(".modal-section");
  modal.classList.add("hidden");

  let addModal = document.querySelector(".add-modal");
  if (!addModal.classList.contains("hidden")) {
    addModal.classList.add("hidden");
  }

  let overlay = document.querySelector(".overlay");
  overlay.classList.add("hidden");
}

async function getGallery() {
  try {
    const url = "http://localhost:5678/api/works";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const responseJson = await response.json();
    displayGallery(responseJson);
    finalGalleryList = responseJson;
  } catch (error) {
    console.log(error.message);
  }
}

function displayGallery(galleryList) {
  const galleryDiv = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".modal-gallery");

  let galleryChildren = galleryDiv.querySelectorAll("figure");
  galleryChildren.forEach((child) => child.remove());

  let modalList = modalGallery.querySelectorAll("figure");
  modalList.forEach((child) => child.remove());

  for (item of galleryList) {
    const element = document.createElement("figure");
    const modalElement = document.createElement("figure");
    const htmlFigure = `
                <img src="${item.imageUrl}" alt="${item.title}">
                <figcaption>${item.title}</figcaption>
            `;
    element.innerHTML = htmlFigure;
    element.id = item.id;

    const htmlModal = `
    <img src="${item.imageUrl}" alt="${item.title}">
    `;
    modalElement.innerHTML = htmlModal;
    modalElement.classList.add("modal-project");
    modalElement.id = item.id;

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can fa-xs"  style="color: #ffffff;"></i>`;
    deleteButton.addEventListener("click", (event) => {
      deleteProject(event.currentTarget.parentNode.id);
    });
    modalElement.appendChild(deleteButton);

    galleryDiv.appendChild(element);
    modalGallery.appendChild(modalElement);
  }
}

async function deleteProject(id) {
  try {
    await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }).then(async (response) => {
      if (response.status == 204) {
        let toDeleteProject = document.querySelectorAll(
          `figure#${CSS.escape(id)}`
        );
        console.log(toDeleteProject);
        toDeleteProject.forEach((project) => {
          project.remove();
        });
        getGallery();
      }
    });
  } catch (e) {
    console.error(e.message);
  }
}
