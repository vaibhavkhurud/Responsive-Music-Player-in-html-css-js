console.log("Jai Shree Ram 🚩")
let currentSong = new Audio();
let songs;
let currFolder;

function S_to_M(sec){
    if(isNaN(sec) || sec < 0){
        return "";
    }
    const min = Math.floor(sec / 60);
    const remainingSec = Math.floor(sec % 60);

    const formattedMin = String(min).padStart(2, '0');
    const formattedSec = String(remainingSec).padStart(2, '0');

    return `${formattedMin}:${formattedSec}`;
}

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/${folder}`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }



    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
        
                            <img class="invert" src="svg/music.svg" alt="">
                            <div class="info">
                               <div> ${song.replaceAll("%20", " ")}</div>
                               
                            </div>
                            <div class="playnow">
                             <span>play now</span>
                                <img class="invert" src="svg/play.svg" alt="">
                            </div>
               
        </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    return songs
   
}

const playMusic = (track, pause=false)=>{
    // playing a 1st song
    // var audio = new Audio("/songs/" + track);/
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}





   
    






async function displayAlbumns(){
    let a = await fetch(`/songs`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let cardContainer=document.querySelector(".cardContainer")
    let anchors =  div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if(e.href.includes("/songs")){
        let folder = e.href.split("/").slice(-2)[0]
         //   get metadata of the folder
         let a = await fetch(`/songs/${folder}/info.json`)
         let response = await a.json();
        
         cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder = "${folder}" class="card ">
                        <img src="/songs/${folder}/cover.png" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.discription}</p>

                    </div>`

        }
    }
   
 //load playlist
 
 Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
        
    })
 })
}


async function main() {

    // geting songs list
     await getSongs("songs/ncs")

    playMusic(songs[0],true)


    //display all albums
    displayAlbumns()

     //add eventListener to play, next & prev song
     play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "svg/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "svg/play.svg"
        }
    })
    //previous & next
    previous.addEventListener("click",()=>{
        console.log("previous")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        // console.log(currentSong.src.split("/").slice(-1))
        if ((index-1)>=0) {
            playMusic(songs[index-1]) 
        }
    })


    //next
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index+1) < songs.length) {
            playMusic(songs[index+1]) 
        }
        

    })




    //time update event function
     currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${S_to_M(currentSong.currentTime)} / ${S_to_M(currentSong.duration)}`
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";
    })

    // move seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
      document.querySelector(".circle").style.left = percent + "%";
      currentSong.currentTime = ((currentSong.duration)*percent)/100
    })

    //hamburger open

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    //hamburger close
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    //volume update

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })

    //volume mute
    document.querySelector(".volume>img").addEventListener("click", e=>{
        
        if(e.target.src.includes("svg/volume.svg")){
            e.target.src = e.target.src.replace("svg/volume.svg","svg/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("svg/mute.svg","svg/volume.svg")
            currentSong.volume = 0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })

   
  
}


main()