const signup = document.querySelector('.signup');
signup.addEventListener('click', () => {
    window.open('../signup', '_self');
})
localStorage.clear();
 
const loginform = document.getElementById('loginform');
const checkMailForm = document.getElementById('checkMailForm');
const signupButtonByID = document.getElementById('signup');
const checkUserPassword = document.getElementById('checkUserPassword');
const submitCheckMail = document.getElementById('submitCheckMail');

const forgotPasswordPara = document.querySelector('.forgotPasswordPara');
forgotPasswordPara.addEventListener('click', () => {
    signupButtonByID.style.display = "none";
    forgotPasswordPara.hidden = "true";
    loginform.style.display = "none";
    checkMailForm.style.display = "block";
    submitCheckMail.style.display = "block";
})


const emailInput = document.getElementById('chekUserMail');
const email = emailInput.value;

// const submitCheckMail = document.getElementById('submitCheckMail');
    submitCheckMail.addEventListener('click', () => {
        console.log(email);
        fetch('../check/email', {
            method: "POST",
            headers: {
                "accepts": "*/*",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        }).then(res => {
            return res.text();
        }).then(data => {
            if (data == '404') {
                emailInput.value = '';
                alert('Email Not Find');
            }
            else if (data == 'validation error') {
                emailInput.value = "";
                alert('please complete a normalize email');
            }
            else if (data == '200') {
                checkUserPassword.style.display = "block";
            }
        })
    });
