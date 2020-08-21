function testFun(event, str) {
    return
    switch (event.data.str) {
        case "today":
            // var today_page = document.getElementById("v-pills-today")
            // today_page.innerHTML = ""
            // var head_title = document.createElement("p")
            // head_title.className = "head-title"
            // head_title.innerText = "Today"

            // today_page.appendChild(head_title);
            break
        case 'scheduled':
            var scheduled_page = document.getElementById("v-pills-scheduled")
            scheduled_page.innerHTML = ""
            var head_title = document.createElement("h1")
            head_title.innerText = "Scheduled"

            scheduled_page.appendChild(head_title)
            break
        case 'completed':
            var completed_page = document.getElementById("v-pills-completed")
            completed_page.innerHTML = ""
            var head_title = document.createElement("h1")
            head_title.innerText = "Completed"

            completed_page.appendChild(head_title)
            break
        case 'allplans':
            var allplans_page = document.getElementById("v-pills-allplans")
            allplans_page.innerHTML = ""
            var head_title = document.createElement("h1")
            head_title.innerText = "All Plans"

            allplans_page.appendChild(head_title)
            break
        case 'about':
            var about_page = document.getElementById("v-pills-about")
            about_page.innerHTML = ""
            var head_title = document.createElement("h1")
            head_title.innerText = "About"

            about_page.appendChild(head_title)
            break
    }
}