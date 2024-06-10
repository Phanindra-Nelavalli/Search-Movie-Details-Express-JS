const logregBox = document.querySelector('.logreg-box');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

registerLink.addEventListener('click',()=>{
    logregBox.classList.add('active');
})

loginLink.addEventListener('click',()=>{
    logregBox.classList.remove('active');
})