document.querySelector('.container').addEventListener('click', async (event) => {

    if (event.target.className == 'buttonSub btn') {
        event.preventDefault();
        const maxSong = 247196;

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let data;

        do {
            try {
                // do {
                    let songID = getRandomInt(1, maxSong);
                    console.log('айдишка', songID);
                    let response = await fetch(`/?songID=${songID}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                    });
                    if (response.status === 404) {
                        continue;
                    }
                    data = await response.json();
                    console.log('hhjghghghggjh', data.json.meta.status);
                // } while (data.json.meta.status == 404)
            } catch (e) {
                console.log("Song not found", songID);
                document.querySelector("#error").innerHTML = `Not found, ${songID}`
            }

        } while(!data);


        if (data.json.response.song.release_date !== null) {


            document.querySelector('.row').innerHTML = `<div class="col-1-3">
                    <div class="ourImg">
                    <img class="artImage" src="${data.json.response.song.song_art_image_url}" width="400" height="400" alt="">
                    </div>
                    <div class="rightText">
                    <p style="font-size: 26px; font-weight: bold">Song: <span style="color:red">${data.json.response.song.title}</span></p>
                <p style="font-size: 26px; font-weight: bold">Artist: <span style="color:green">${data.json.response.song.primary_artist.name}</span>
                </p>
             
            <p style="font-size: 26px; font-weight: bold">Release: ${data.json.response.song.release_date}</p>
  
                <button class="buttonSub btn">NEW SONG</button>           
                <button onclick="location.href ='${data.json.response.song.url}'" class="buttonSend btn"><span>GENIUS</span></button>
                
                </div>
                </div>
<div class="col-2-3">        
<!--                        <p class="font-family: 'Hammersmith One', sans-serif; line-height: 10px">${data.lyrics}</p>-->
              
            </div>`;
            for (let i = 0; i < data.lyrics.length; i++) {
                // console.log(data.lyrics[i]);
                let p = document.createElement("p");
                let b = document.querySelector('.row');
                b.appendChild(p);
                p.innerHTML = `${data.lyrics[i]}/<br>`
                // <p class="font-family: 'Hammersmith One', sans-serif; line-height: 10px">${data.lyrics}</p>
            }


        } else {
            document.querySelector('.row').innerHTML = `<div class="col-1-3">
                    <div class="ourImg">
                    <img class="artImage" src="${data.json.response.song.song_art_image_url}" width="400" height="400" alt="">
                    </div>
                    <div class="rightText">
                    <p style="font-size: 26px; font-weight: bold">Song: <span style="color:red">${data.json.response.song.title}</span></p>
                <p style="font-size: 26px; font-weight: bold">Artist: <span style="color:green">${data.json.response.song.primary_artist.name}</span>
                </p>
                <button class="buttonSub btn">NEW SONG</button>
                <button onclick="location.href ='${data.json.response.song.url}'" class="buttonSend btn"><span>GENIUS</span></button>
                </div>
                </div>
<div class="col-2-3">        
<!--                        <p class="font-family: 'Hammersmith One', sans-serif; line-height: 10px">${data.lyrics}</p>-->
              
            </div>`;
            for (let i = 0; i < data.lyrics.length; i++) {

                let p = document.createElement("p");
                let b = document.querySelector('.row');
                b.appendChild(p);
                p.innerHTML = `${data.lyrics[i]}<br>`
                // <p class="font-family: 'Hammersmith One', sans-serif; line-height: 10px">${data.lyrics}</p>
            }

        }
    }
});
