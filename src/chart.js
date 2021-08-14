const musicCoverNode = document.getElementById('cover');
const musicTitleNode = document.getElementById('titleNode');
const musicArtistNameNode = document.querySelector('.artistName');
const musicUrlNode = document.getElementById('musicUrlNode');
const lyricscontainerNode = document.getElementById('lyricsPara');
const artistContainerNode = document.getElementById('artistContainer');
const artistImageNode = document.getElementById('artistImage');
const musicShazamLybrary = document.getElementById('musicShazamInLibrary');
const welcomeNode = document.getElementById('ShazamWelcome');
const songOption = document.querySelector('.optionSong');
const lyricsOption = document.querySelector('.optionLyrics');
const artistOption = document.querySelector('.optionArtist');
const h4ArtistName = document.querySelector('.artistNameh4');

const chartDiv = document.querySelectorAll('.chartDiv');
const TracksShazamContainer = document.getElementById('TracksShazamContainer');
const chartTracksContainer = document.getElementById('chartTracksContainer');
const chartH2 = document.getElementById('chartH2');

chartDiv.forEach(charts => {
    charts.addEventListener('click', (e) => {
        const target = e.target
        // console.log(e.target.parentNode);
        // console.log(chartDiv.firstChild);
        // console.log(charts.childNodes);
        musicCoverNode.src = `${target.parentNode.childNodes[0].src}`;
        artistImageNode.src = `${target.parentNode.childNodes[0].src}`;
        musicArtistNameNode.innerHTML = `${target.parentNode.childNodes[3].innerHTML}`;
        h4ArtistName.innerHTML = `${target.parentNode.childNodes[3].innerHTML}`;
        musicTitleNode.innerHTML = `${target.parentNode.childNodes[2].innerHTML}`;
        musicUrlNode.setAttribute('href', `${target.parentNode.childNodes[4].innerHTML}`);

        console.log("src="+target.parentNode.childNodes[0].src, "name"+target.parentNode.childNodes[2].innerHTML,
            "song"+target.parentNode.childNodes[3].innerHTML,
            "url"+target.parentNode.childNodes[4].innerHTML
        );
        TracksShazamContainer.style.display = "block";
        chartTracksContainer.hidden = "true";
        chartH2.style.display = "none";
    });
});

// *************************************song option click event******************************************************//
songOption.addEventListener('click', () => {
    artistContainerNode.style.display = "none";
    lyricsOption.setAttribute('style', 'background:transprent;');
    artistOption.setAttribute('style', 'background:transprent;');
    // artistOption.hidden = "true";
    songOption.setAttribute('style', 'background:rgb(238, 44, 44);');
    // songOption.hidden = "true";
});
// *********************************** artist option click event ***************************************************//
artistOption.addEventListener('click', () => {
    artistOption.setAttribute('style', 'background:rgb(238, 44, 44);');
    songOption.setAttribute('style', 'background:transprent;');
    // songOption.hidden = "true"
    artistContainerNode.style.display = "block";
    TracksShazamContainer.hidden = "false";
    TracksShazamContainer.style.display = "block";
    lyricsOption.setAttribute('style', 'background:transprent;');
    // lyricsOption.hidden = "true"
});

const arrowleft = document.querySelector('.fa-arrow-left');
arrowleft.addEventListener('click', () => {
    // console.log(arrowleft);
    TracksShazamContainer.style.display = "none";
    chartTracksContainer.hidden = "false";
    chartH2.style.display = "block";
    // welcomeNode.hidden = "false";
});
