
// const divs = document.querySelectorAll('.shazamlibrary');
const dialogImg = document.querySelector('.dialogImg');
const dialogPara = document.querySelector('.dialogPara');

const allMenu = document.querySelectorAll('.fa-ellipsis-v');
const dialogBox = document.getElementById('dialogBox');
const dialogContent = document.getElementById('dialogcontent');
allMenu.forEach(menu => {
    menu.addEventListener('click', () => {
        
        const shazamCover = `${menu.parentNode.childNodes[0].src}`;
        const shazamNameMusic = `${menu.parentNode.childNodes[1]}`;
        const artistName = `${menu.parentNode.childNodes[1].lastChild.innerHTML}`;
        dialogImg.src = `${shazamCover}`;
        dialogPara.innerHTML = menu.parentNode.childNodes[1].childNodes[0].data + `<br><span>${artistName}</span>`;
        dialogContent.style.display = "block"
        // console.log(menu.parentNode.childNodes[1].childNodes[0].data)
        // console.log(menu.parentNode);
    });
});
window.onclick= (e) => {
    // console.log(e.target);
    if (e.target == dialogContent) {
        dialogContent.style.display = "none";
    }
};
// const mainSection = document.querySelector('.shazamContainer');
// mainSection.addEventListener('onclick', () => {
//     dialogBox.style.display = "none";
// });