const signup = document.querySelector('.signup');
signup.addEventListener('click', () => {
    window.open('../signup', '_self');
})
localStorage.clear();