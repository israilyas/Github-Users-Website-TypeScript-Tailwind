"use strict";
const getUserName = document.querySelector('#user'); //  type assertion
const formSubmit = document.querySelector('.form');
// const formSubmit:HTMLFormElement|null = document.querySelector('.form') 
const main_container = document.querySelector('.main-container');
// ReUsable FUnction:
async function myCustomFetcher(url, option) {
    const response = await fetch(url, option);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }
    ;
    const data = await response.json();
    // console.log(data)
    return data;
}
;
// Lets Display The Card UI
function showResultUI(singleUser) {
    const { avatar_url, location, login, id, url } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `
            <div class="bg-[#15253C]   flex-col items-center justify-center rounded hover:-translate-y-1 transition-all duration-500 p-[5px] md:w-[220px] w-[170px] xsm:w-[220px] hover:shadow-lg  hover:shadow-[#6D28D980] ">
                <img src=${avatar_url} alt="${login}" class="w-[100%]"/>

                <hr class="w-[100%] h-[2px] bg-white align-center m-auto my-3" />

                <div class="card-footer flex flex-row items-center justify-around pb-2">
                    <img src=${avatar_url} class="w-[20%] rounded-full p-0 m-0"/>
                    <a href=${url} class="text-bold uppercase "> ${login}</a>
                </div>

            </div>
        `);
}
// API DATA ==>  Array of an object
function fetchUserData(url) {
    // Reusable Function
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            // console.log(singleUser)
            console.log("login " + singleUser);
            showResultUI(singleUser);
        }
    });
}
;
// Default Function Call => Always called
fetchUserData("https://api.github.com/users");
// Let's Perform Search Functionality
formSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = getUserName.value.toLowerCase();
    try {
        const url = "https://api.github.com/search/users?q=${searchTerm}";
        const allUserData = await myCustomFetcher(url, {});
        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        // Clear Previous Data
        main_container.innerHTML = "";
        if (matchingUsers.length === 0) {
            main_container.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching user</p>`);
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
