class PlayList {
    constructor(el, app){
        this.app = app;
        this.listDom = document.querySelector(el);
        this.itemList = this.listDom.querySelector(".item-list");
        this.addBtn = this.listDom.querySelector("#openDialog");
        this.fileInput = this.listDom.querySelector("#audioFile");

        this.itemList.innerHTML = "";
        this.fileList = []; //플레이리스트 상에 있는 음악파일들을 저장
        this.playIdx = null; //현재 재생중인 음악의 인덱스를 저장
        this.currentMusic = null;

        this.addEvent();
    }

    addEvent(){
        this.addBtn.addEventListener("click", e => this.fileInput.click());
        this.fileInput.addEventListener("change", this.addList.bind(this));
    }

    addList(e) {
        console.log(e.target);
        // dom.classList.add('active');
        Array.from(e.target.files).forEach(file => {
            let name = file.name;
            if(name.substring(name.length - 3) != "mp3"){
                return;
            }

            let obj = {idx: this.fileList.length, file: file, dom: null};
            this.fileList.push(obj);
            let item = document.createElement("li");
            item.classList.add("item");
            item.classList.add("d-flex");
            item.classList.add("align-items-center");

            let img = new Image();
            img.src = '../images/record.png';
            item.appendChild(img);
            obj.dom = item;
            item.addEventListener("dblclick", (e) => {
                this.itemActive(obj);
                let data = this.fileList.find(x => x.idx == obj.idx);
                this.playItem(data);
            });

            let span = document.createElement("span");
            span.innerHTML = file.name;
            item.appendChild(span);
            this.itemList.appendChild(item);
        });
    }

    playItem(data) {
        this.fileList.forEach(data => {
            data.dom.classList.remove("active");
        });
        this.currentMusic = data.idx;

        data.dom.classList.add("active");
        this.app.player.loadMusic(data);
    }

    getNextMusic(loop) {
        let now = this.fileList.findIndex(x => x.idx == this.currentMusic);
        if(now < this.fileList.length - 1){
            this.playItem(this.fileList[now + 1]);
        } else if (loop) {
            this.playItem(this.fileList[0]);
        }
    }

    itemActive(obj) {
        this.fileList.forEach(data => {
            data.dom.classList.remove('active');
        });
        obj.dom.classList.add('active');
    }
}