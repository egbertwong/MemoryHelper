function testFun(event, str, db) {
    // return
    switch (event.data.str) {
        case "today":
            // var today_page = document.getElementById("v-pills-today")
            // today_page.innerHTML = ""
            // var head_title = document.createElement("p")
            // head_title.className = "head-title"
            // head_title.innerText = "Today"

            // today_page.appendChild(head_title);
            
            initTodayPage(event.data.db)
            break
        case 'scheduled':
            initScheduledPage(event.data.db)
            break
        case 'completed':
            initCompletedPage(event.data.db)
            break
        case 'tasks':
            initTasksPage(event.data.db)
            break
        case 'about':
            initAboutPage(event.data.db)
            break
    }
}