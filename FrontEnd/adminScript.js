document.addEventListener("DOMContentLoaded", () => {
  checkToken();
  getGallery();
  let editButton = document.querySelector(".edit-button");
  editButton.addEventListener("click", () => {
    openModal();
  });

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

  let submitProject = document.querySelector(".submit-project-button");
  submitProject.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("CLICKED1");
    submitForm();
  });
});

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

  let formData = new FormData();
  formData.append('image', photo.files[0]);
  formData.append('title', `${title.value}`);
  formData.append('category', `${category.value}`);

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
  } else {
    console.log("No Token");
  }
}

function addEditStyling() {
  const editIndicator = document.createElement("div");
  editIndicator.className = "edit-indicator";
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

  let childrenList = galleryDiv.querySelectorAll("figure");
  childrenList.forEach((child) => child.remove());

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
      }
    });
  } catch (e) {
    console.error(e.message);
  }
}
