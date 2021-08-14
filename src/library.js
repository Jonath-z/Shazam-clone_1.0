
// const divs = document.querySelectorAll('.shazamlibrary');
const dialogImg = document.querySelector('.dialogImg');
const dialogPara = document.querySelector('.dialogPara');

const allMenu = document.querySelectorAll('.fa-ellipsis-v');
const dialogBox = document.getElementById('dialogBox');
const dialogContent = document.getElementById('dialogcontent');
const dialogParaTrackID = document.querySelector('.dialogParaTrackID');
const spanArtistName = document.querySelector('.spanArtistName');


allMenu.forEach(menu => {
    menu.addEventListener('click', () => {
        const dialogMusicUrl = document.getElementById('dialogMusicUrl');
        window.scrollTo(0, document.body.scrollHeight);
        const shazamCover = `${menu.parentNode.childNodes[0].src}`;
        const shazamNameMusic = `${menu.parentNode.childNodes[1]}`;
        const artistName = `${menu.parentNode.childNodes[1].lastChild.innerHTML}`;
        dialogImg.src = `${shazamCover}`;
        dialogPara.innerHTML = menu.parentNode.childNodes[1].childNodes[0].data + `<br><span class="spanArtistName">${artistName}</span>`;
        dialogContent.style.display = "block";
        dialogParaTrackID.innerHTML = `${menu.parentNode.childNodes[3].innerHTML}`;
        dialogMusicUrl.value = `${menu.parentNode.childNodes[4].innerHTML}`;
        // console.log(dialogParaTrackID);
        // console.log(menu.parentNode.childNodes[3].innerHTML)
        // console.log(menu.parentNode);
    });
});
window.onclick= (e) => {
    // console.log(e.target);
    if (e.target == dialogContent) {
        dialogContent.style.display = "none";
    }
};

// ***************************** dialoge remove option event *****************************************************//
const optionRemove = document.querySelector('.optionRemove');
optionRemove.addEventListener('click', () => {
    allMenu.forEach(menu => {
        if (`${dialogParaTrackID.innerHTML}` === `${menu.parentNode.childNodes[3].innerHTML}`) {
            menu.parentNode.remove();
        }
    });
    fetch('../remove', {
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: `${dialogParaTrackID.innerHTML}`
        })
    });
});
// *****************************dialoqg share option event *******************************************************//
const shareOption = document.querySelector('.optionShare');
shareOption.addEventListener('click', () => {
    const dialogMusicUrl = document.getElementById('dialogMusicUrl');
    // const artistNameNode = document.querySelector('.dialogPara');
    dialogMusicUrl.select();
    dialogMusicUrl.setSelectionRange(0, 99999);
    document.execCommand("copy");
    console.log(dialogMusicUrl.value);
    // console.log(dialogPara.children[1].innerHTML);
    // console.log(dialogPara.firstChild);
    // const song = dialogPara.firstChild;
    // const title = `${dialogPara.children[1].innerHTML}-${dialogPara.firstChild}`;
    // const shareData = {
    //     title: title,
    //     text: "I used shazam-Clone V1.0 to get this song",
    //     url: `../`
    // }
    // async function shareSong() {
    //     await navigator.share(shareData);
    // }
    // shareSong();

}); 
// ******************************* dialog view artist option event **************************************************//
