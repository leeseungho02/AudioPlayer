Number.prototype.timeFormet = function() {
    let h = `0${Math.floor(this / 3600)}`;
    let m = `0${Math.floor(this % 3600 / 60)}`;
    let s = `0${Math.floor(this % 60)}`;

    h = h.substring(h.length - 2, h.length);
    m = m.substring(m.length - 2, m.length);
    s = s.substring(s.length - 2, s.length);

    return `${h}:${m}:${s}`;

}

class App{
    constructor(playerEL, listEL){
        this.player = new Player(playerEL, this);
        this.playList = new PlayList(listEL, this);
    }
}

window.addEventListener("load", ()=>{
    let app = new App("#music_info", "#playList");
    document.querySelectorAll('.playList_header li')[1].addEventListener('click', () => {
        alert('해당 메뉴는 개발중입니다.');
        return;
    });
});