let finalGalleryList;


getCategories();
getGallery("All");

function checkToken(){
  if(sessionStorage.getItem("token")){
    console.log("TOKEN EXISTS");
    const token = sessionStorage.getItem("token");
    
    const editIndicator = document.createElement("div");
    editIndicator.className = "edit-indicator"
    const header = document.querySelector("header");
    const target = document.querySelector("body");
    target.insertBefore(editIndicator, header);

  } else{
    console.log("No Token");
  }
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
  filterButton.name="All"
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

function activateFilter(e){
    let currentFilter = document.querySelector('#active-filter')
    currentFilter.id = "";
    e.srcElement.id = "active-filter"
    currentFilter = document.querySelector("#active-filter");
    displayGallery(finalGalleryList, currentFilter.name);
}

async function getGallery(filterName) {
  try {
    const url = "http://localhost:5678/api/works";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const responseJson = await response.json();
    displayGallery(responseJson, filterName);
    finalGalleryList = responseJson;
  } catch (error) {
    console.log(error.message);
  }
}

function displayGallery(galleryList, filterName) {
    const galleryDiv = document.querySelector(".gallery");

    let childrenList = galleryDiv.querySelectorAll("figure");
    childrenList.forEach(child => child.remove());


    if(filterName == "All"){
        for (item of galleryList) {
          const element = document.createElement("figure");
          const htmlFigure = `
                <img src="${item.imageUrl}" alt="${item.title}">
                <figcaption>${item.title}</figcaption>
            `;
          element.innerHTML = htmlFigure;

          
          galleryDiv.appendChild(element);
        }
    } else{
        for (item of galleryList) {
            if(item.category.name == filterName){
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
