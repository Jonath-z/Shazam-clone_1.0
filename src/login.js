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
const emailInput = document.getElementById('chekUserMail');
const passwordInput = document.getElementById('checkUserPassword');
const forgotpasswordDiv = document.getElementById('forgotpasswordDiv');
const submitCheckMailDiv = document.getElementById('submitCheckMailDiv')

const forgotPasswordPara = document.querySelector('.forgotPasswordPara');
forgotPasswordPara.addEventListener('click', () => {
    signupButtonByID.style.display = "none";
    forgotPasswordPara.hidden = "true";
    loginform.style.display = "none";
    checkMailForm.style.display = "block";
    submitCheckMailDiv.style.display = "block";
    // submitCheckMail.style.display = "block";
})
// console.log(submitCheckMail.innerHTML);
// const submitCheckMail = document.getElementById('submitCheckMail');
submitCheckMail.addEventListener('click', () => {
    if (submitCheckMail.innerHTML === "Submit") {
        const email = emailInput.value;
        // console.log(email);
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
            // console.log(data);
            if (data == '404') {
                emailInput.value = '';
                alert('Email Not Find');
            }
            else if (data == 'validation error') {
                emailInput.value = "";
                alert('Please complete a normalize email');
            }
            else if (data == 'email incorrect') {
                alert('No data matched on this Email');
            }
            else if (data == '200') { 
                forgotpasswordDiv.style.display = "block";
                submitCheckMail.innerHTML = 'Update';
            }
        });
    }
    if (submitCheckMail.innerHTML === "Update") {
        const email = emailInput.value;
        const password = passwordInput.value;
        fetch('../update/password', {
            method: "POST",
            headers: {
                "accepts": "*/*",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(res => {
                return res.text();
            })
            .then(data => {
                if (data == 'validation error') {
                    passwordInput.value = '';
                    alert('password must have at least 4 charachters minimum');
                }
                if (data == '200') {
                    alert('password updated');
                    window.open('../login', '_self');
                }
            })
        
    }
});
