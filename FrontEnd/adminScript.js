document.addEventListener("DOMContentLoaded", () => {
  checkToken();
  let editButton = document.querySelector(".edit-button");
  editButton.addEventListener("click", () => {
    openEditModal();
  });

  let closeButton = document.querySelector('.btn-close');
  closeButton.addEventListener('click', () => {
    closeEditModal();
  })

  let overlay = document.querySelector('.overlay');
  overlay.addEventListener('click', () => {
    closeEditModal();
  })

  
});

getGallery();

function checkToken() {
  if (sessionStorage.getItem("token")) {
    const token = sessionStorage.getItem("token");
    console.log(token);
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

function openEditModal() {
  let modal = document.querySelector(".modal-section");
  modal.classList.remove("hidden");
  let overlay = document.querySelector('.overlay');
  overlay.classList.remove("hidden")
}

function closeEditModal(){
  let modal = document.querySelector(".modal-section");
  modal.classList.add("hidden");
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

    const htmlModal = `
    <img src="${item.imageUrl}" alt="${item.title}">
    `;
    modalElement.innerHTML = htmlModal;

    galleryDiv.appendChild(element);
    modalGallery.appendChild(modalElement);
  }
  deleteProjects();
}

function deleteProjects(){
  let modalGalleryList = document.querySelector(".modal-gallery");
  console.log(modalGalleryList.childNodes);
}
