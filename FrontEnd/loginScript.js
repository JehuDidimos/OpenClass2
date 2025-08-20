document.addEventListener('DOMContentLoaded', ()=> {
    const submitButton = document.querySelector(".submit-button");
    //createUser();
    submitButton.addEventListener("click", ($event) => {
      $event.preventDefault();
      login()
    });
})

async function createUser(){
    const emailInput = "UserEmail@email.com";
    const passwordInput = "123456"

    try{
        const response = await fetch("http://localhost:5678/api/users/signup", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput,
                password: passwordInput
            })
        }).then(async (response) => {
            const data = await response.json();
            console.log(data);
        })
    } catch(e){
        console.error(e.message);
    }
}

async function login() {
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');

    console.log(
      JSON.stringify({
        email: email.value,
        password: password.value,
      })
    );

    try{
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
            }).then(async (response) => {
                const data = await response.json();
                if(response.status == 200) successfulLogin(data);
                else if(response.status == 404 || response.status == 401) failedLogin();
                
                
                
            });
    } catch (e){
        console.error(e.message);
    }
}

function successfulLogin(data){
    console.log("Setting Token");
    sessionStorage.setItem("token", data.token);
    window.location.href = "./index.html";
}

function failedLogin(){
    window.alert("Invalid Login try again");
}
