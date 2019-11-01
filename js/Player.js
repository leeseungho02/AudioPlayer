const MODE = {
    "NO": 0,
    "ONE": 1,
    "LIST": 2
};

class Player {
    constructor(el, app){
        this.app = app;
        this.playerDom = document.querySelector(el);
        this.audio = this.playerDom.querySelector('audio');
        this.playBtn = this.playerDom.querySelector('.play');
        this.pauseBtn = this.playerDom.querySelector('.pause');
        this.stopBtn = this.playerDom.querySelector('.stop');

        this.currentTime = this.playerDom.querySelector('.current-time');
        this.totalTime = this.playerDom.querySelector('.total-time');

        this.progress = this.playerDom.querySelector('.progress')
        this.fileName = this.playerDom.querySelector('.music_name');

        this.prevBtn = this.playerDom.querySelector('.backward');
        this.nextBtn = this.playerDom.querySelector('.forward');

        this.playable = false; // 현재 플레이가 가능한가

        this.repeatMode = MODE.NO; // 최초에는 반복 없음으로
        this.modeBtnList = document.querySelectorAll(".retweet");

        this.volumeProgress = this.playerDom.querySelector('.volumeProgress');

        this.addListener();
        requestAnimationFrame(this.frame.bind(this));
    }

    addListener(){
        this.playBtn.addEventListener('click',  this.play.bind(this));
        this.pauseBtn.addEventListener('click',  this.pause.bind(this));
        this.stopBtn.addEventListener('click',  this.stop.bind(this));
        this.progress.addEventListener('input', this.changeSeeking.bind(this));
        this.audio.addEventListener("ended", this.musicEnd.bind(this));
        this.prevBtn.addEventListener('click', this.prevMusic.bind(this));
        this.nextBtn.addEventListener('click', this.nextMusic.bind(this));
        this.volumeProgress.addEventListener('input', this.changeVolume.bind(this));

        this.modeBtnList.forEach(btn => {
            btn.addEventListener("click", (e) => {
                btn.classList.add('d-none');
                console.log(this.repeatMode);
                if(this.repeatMode == MODE.ONE){
                    this.modeBtnList[2].classList.remove('d-none');
                    this.repeatMode = this.modeBtnList[2].dataset.idx;
                } else if(this.repeatMode == MODE.LIST) {
                    this.modeBtnList[0].classList.remove('d-none');
                    this.repeatMode = this.modeBtnList[0].dataset.idx;
                } else if(this.repeatMode == MODE.NO) {
                    this.modeBtnList[1].classList.remove('d-none');
                    this.repeatMode = this.modeBtnList[1].dataset.idx;
                }
            });
        });
    }

    musicEnd() {
        document.querySelector('.music_img').classList.remove('active');

        if(this.repeatMode == MODE.ONE){
            this.stop();
            this.play();
        } else if(this.repeatMode == MODE.LIST) {
            this.app.playList.getNextMusic(true); //루프를 적용해서 다음음악
        } else if(this.repeatMode == MODE.NO) {
            this.app.playList.getNextMusic(false); //루프를 적용해서 다음음악
        }
    }

    changeSeeking(){
        if(!this.playable) return this.progress.value = 0;
        this.audio.currentTime = this.audio.duration * this.progress.value / 100;
    }

    changeVolume() {
        if(!this.playable) return this.volumeProgress.value = 0;
        let volume = this.volumeProgress.value / 100;
        if(volume == 0){
            document.querySelector('.volumn i').classList.remove("fa-volume-up");
            document.querySelector('.volumn i').classList.add("fa-volume-mute");
        } else {
            document.querySelector('.volumn i').classList.add("fa-volume-up");
            document.querySelector('.volumn i').classList.remove("fa-volume-mute");
        }
        this.audio.volume = volume;
    }

    play(){
        if(!this.playable) return;
        this.audio.play();
        this.playBtn.classList.add("d-none");
        this.pauseBtn.classList.remove("d-none");
        document.querySelector('.music_img').classList.add('active');
    }

    pause() {
        if(!this.playable) return;
        this.audio.pause();
        this.playBtn.classList.remove("d-none");
        this.pauseBtn.classList.add("d-none");
        document.querySelector('.music_img').classList.remove('active');
    }

    stop(){
        if(!this.playable) return;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.playBtn.classList.remove("d-none");
        this.pauseBtn.classList.add("d-none");
        document.querySelector('.music_img').classList.remove('active');
    }

    frame(timestamp){
        requestAnimationFrame(this.frame.bind(this));
        this.render();
    }

    render() {
        if(!this.playable) return; 
        let current = this.audio.currentTime;
        let duration = this.audio.duration;
        this.progress.value = this.audio.currentTime / this.audio.duration * 100;
        this.totalTime.innerText = duration.timeFormet();
        this.currentTime.innerText = current.timeFormet();
    }

    prevMusic() {
        if(!this.playable) return; 
        let data = this.app.playList.fileList.find(x => x.idx == parseInt(this.prevBtn.dataset.idx) - 1);
        if(data){
            this.loadMusic(data);
            this.app.playList.itemActive(data);
        } else {
            alert('이전 재생할 오디오가 없습니다.');
            return;
        }
    }

    nextMusic() {
        if(!this.playable) return; 
        let data = this.app.playList.fileList.find(x => x.idx == parseInt(this.nextBtn.dataset.idx) + 1);
        if(data){
            this.loadMusic(data);
            this.app.playList.itemActive(data);
        } else {
            alert('다음 재생할 오디오가 없습니다.');
            return;
        }
    }

    loadMusic(data) {
        let musicFile = data.file;
        let fileURL = URL.createObjectURL(musicFile);
        this.prevBtn.dataset.idx = data.idx;
        this.nextBtn.dataset.idx = data.idx;
        this.audio.volume = 1;
        this.volumeProgress.value = 100;
        this.volumeProgress.parentNode.classList.add('active');
        this.audio.pause();
        this.audio.src = fileURL;
        this.audio.addEventListener('loadeddata', () => {
            this.fileName.innerHTML = musicFile.name;
            this.playable = true;
            this.play();
        });
    }

}