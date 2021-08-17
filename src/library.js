
// const divs = document.querySelectorAll('.shazamlibrary');
const dialogImg = document.querySelector('.dialogImg');
const dialogPara = document.querySelector('.dialogPara');

const AllmusicCover = document.querySelectorAll('.musicCover');
const allMenu = document.querySelectorAll('.fa-ellipsis-v');
const dialogBox = document.getElementById('dialogBox');
const dialogContent = document.getElementById('dialogcontent');
const dialogParaTrackID = document.querySelector('.dialogParaTrackID');
const spanArtistName = document.querySelector('.spanArtistName');
const dialogMusicUrl = document.getElementById('dialogMusicUrl');


allMenu.forEach(menu => {
    menu.addEventListener('click', () => {
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
        shareOption.innerHTML = "Share";
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
    dialogContent.style.display = "none";
    shareOption.innerHTML = "Share";
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
// *****************************dialog share option event *******************************************************//
const shareOption = document.querySelector('.optionShare');

shareOption.addEventListener('click', copyLink)
function copyLink() {
    // const dialogMusicUrl = document.getElementById('dialogMusicUrl');
    // const artistNameNode = document.querySelector('.dialogPara');
    dialogMusicUrl.focus();
    dialogMusicUrl.select();
    // dialogMusicUrl.setSelectionRange(0, 99999);
    document.execCommand("copy", true);
    shareOption.innerHTML = "link copied";
    dialogMusicUrl.value = "";
}




// ******************************* dialog view artist option event **************************************************//
const libraryH2 = document.getElementById('libraryH2');
const shazamContainer = document.querySelector('.shazamContainer');
const musicCoverDiv = document.querySelector('.musicCoverDiv');
const musicCoverNode = document.getElementById('cover');
const musicTitleNode = document.getElementById('titleNode');
const musicArtistNameNode = document.querySelector('.artistName');
const musicUrlNode = document.getElementById('musicUrlNode');
const lyricscontainerNode = document.getElementById('lyricsPara');
const artistContainerNode = document.getElementById('artistContainer');
const artistImageNode = document.getElementById('artistImage');
const musicShazamLybrary = document.getElementById('musicShazamInLibrary');
const shazamResponseSection = document.getElementById('shazamResponse');
const welcomeNode = document.getElementById('ShazamWelcome');
const songOption = document.querySelector('.optionSong');
const lyricsOption = document.querySelector('.optionLyrics');
const artistOption = document.querySelector('.optionArtist');
const h4ArtistName = document.querySelector('.artistNameh4');
const inputOfCoping = document.getElementById('inputOfCoping');

function viewArtist() {
    AllmusicCover.forEach(cover => {
        cover.addEventListener('click', () => {
            musicCoverNode.src = `${cover.parentNode.childNodes[0].src}`;
            artistImageNode.src = `${cover.parentNode.childNodes[0].src}`;
            musicTitleNode.innerHTML = `${cover.parentNode.childNodes[1].childNodes[0].data}`;
            musicUrlNode.href = `${cover.parentNode.childNodes[4].innerHTML}`;
            h4ArtistName.innerHTML = `${cover.parentNode.childNodes[1].lastChild.innerHTML}`;
            musicArtistNameNode.innerHTML = `${cover.parentNode.childNodes[1].lastChild.innerHTML}`;
            dialogMusicUrl.value = `${cover.parentNode.childNodes[4].innerHTML}`;
            inputOfCoping.value = `${cover.parentNode.childNodes[4].innerHTML}`;
            shazamResponseSection.style.display = "block";
            const body = document.getElementById('body');
            body.setAttribute('style', 'position:fixed; width:100%;top:0;bottom:0;');
            song();
        });
    });
}
viewArtist();


// *************************************song option click event******************************************************//

songOption.addEventListener('click', song);
function song() {
    artistContainerNode.style.display = "none";
    shazamContainer.setAttribute('hidden', 'true');
    musicCoverDiv.style.filter = "blur(0px)";
    shazamContainer.setAttribute('style', 'display:none !important');
    libraryH2.setAttribute('style', 'display:none !important');
    // lyricsOption.setAttribute('style', 'background:transprent;');
    artistOption.setAttribute('style', 'background:transprent;');
    // artistOption.hidden = "true";
    songOption.setAttribute('style', 'background:rgb(238, 44, 44);');
    // songOption.hidden = "true";
}



// *********************************** artist option click event ***************************************************//
artistOption.addEventListener('click', () => {
    artistOption.setAttribute('style', 'background:rgb(238, 44, 44);');
    songOption.setAttribute('style', 'background:transprent;');
    artistContainerNode.style.display = "block";
    shazamResponseSection.hidden = "false";
    shazamResponseSection.style.display = "block";
    // artistContainerNode.style.backdropFilter = "blur(100px)";
    musicCoverDiv.style.filter = "blur(40px)";
    shazamContainer.setAttribute('style', 'display:none !important');
    shazamContainer.setAttribute('hidden', 'true');
    libraryH2.setAttribute('style', 'display:none !important');
    // musicCoverNode.style.filter = 'blur(100px)';
    // lyricsOption.setAttribute('style', 'background:transprent;');
    // lyricsOption.hidden = "true"
});

// *************************************arrow left event******************************************************//
const arrowleft = document.querySelector('.fa-arrow-left');
arrowleft.addEventListener('click', () => {
    const body = document.getElementById('body');
    body.setAttribute('style','');
    // console.log(arrowleft);
    shazamContainer.setAttribute('style', 'display:grid !important`;')
    shazamResponseSection.hidden = "true";
    shazamResponseSection.style.display = "none";
    shazamContainer.setAttribute('hidden', 'false');
    libraryH2.setAttribute('style', 'display:block !important');
});
// ***********************************share icon event*************************************************************//
const shareIcon = document.querySelector('.shazamResponseShareOption');
shareIcon.addEventListener('click', () => {
    inputOfCoping.focus();
    inputOfCoping.select();
    inputOfCoping.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert('link copied');
});

// ********************************** view dialog option *****************************************************************//
const vewOption = document.querySelector('.optionViewArtist');
vewOption.addEventListener('click', () => {
    allMenu.forEach(menu => {
        if (`${dialogParaTrackID.innerHTML}` === `${menu.parentNode.childNodes[3].innerHTML}`) {
            musicCoverNode.src = `${menu.parentNode.childNodes[0].src}`;
            artistImageNode.src = `${menu.parentNode.childNodes[0].src}`;
            musicTitleNode.innerHTML = `${menu.parentNode.childNodes[1].childNodes[0].data}`;
            musicUrlNode.src = `${menu.parentNode.childNodes[4].innerHTML}`;
            h4ArtistName.innerHTML = `${menu.parentNode.childNodes[1].lastChild.innerHTML}`;
            musicArtistNameNode.innerHTML = `${menu.parentNode.childNodes[1].lastChild.innerHTML}`;
            shazamResponseSection.style.display = "block";
            const body = document.getElementById('body');
            body.setAttribute('style', 'position:fixed; width:100%;top:0;bottom:0;');
            dialogContent.style.display = "none";
            shareOption.innerHTML = "Share";
            song();
        }
    });
});
