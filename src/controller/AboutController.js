const { shell, ipcRender } = require('electron');

function loadAboutInterface() {
    $('#v-pills-about').html(`
    <div class="page">
        <div id="content-head">
            <img src="../../res/icons/todo-64.svg" style="margin-left: 35px; margin-top: 35px;">
            <div class="head-title">About</div>
        </div>
    
        <div class="table-area noselect" id="about-list">
            <div class="detail-block">
                <div class="detail-item">
                    Memory Helper
                </div>
                <div class="divider"></div>
                <div class="detail-item">
                    版本：V${getVersion()}
                </div>
                <div class="divider"></div>
                <div class="detail-item">
                    作者：<a href="javascript:openLink('https://github.com/egbertwong')">EgbertWong</a>
                </div>
                <div class="divider"></div>
                <div class="detail-item">
                    项目地址：<a href="javascript:openLink('https://github.com/egbertwong/MemoryHelper')">egbertwong/MemoryHelper</a>
                </div>
                <div class="divider"></div>
                <div class="detail-item">
                    License：<a href="javascript:openLink('https://github.com/egbertwong/MemoryHelper/blob/master/LICENSE.md')">MIT</a>
                </div>
            </div>
        </div>
    </div>
    `)
}

function initAboutPage(db) {
    console.log('initAboutPage')
    loadAboutInterface()
}

function openLink(url) {
    shell.openExternal(url);
}