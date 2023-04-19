

const auth = {
    url : "",
    user : "",
    password : ""
}

const podio = {

    el: document.getElementById("topthree"),

    init: function (employeesSorted) {
        [this.el.childNodes[3], this.el.childNodes[1], this.el.childNodes[5]].forEach((el, index) => {
            el.childNodes[3].innerText = employeesSorted[index].total;
            el.childNodes[5].innerText = employeesSorted[index].name;
        })

    }
}

const table = {

    el: document.getElementById("table"),

    sortedBy: "total",

    sortedFromMaxToMin: true,

    init: async function () {
        this.employees = await this.fetchData();
        this.calcAndAddTotalToEmployees();
        this.update();
        podio.init(this.employees);
    },

    update: function () {
        this.sortEmployees();
        this.el.innerHTML = this.template();
    },

    catagories: function () {
        return Object.keys(this.employees[0]);
    },

    onClick: function (clickedCatagory) {
        this.sortedBy === clickedCatagory ? this.sortedFromMaxToMin = !this.sortedFromMaxToMin : this.sortedBy = clickedCatagory;
        this.update();
    },

    calcAndAddTotalToEmployees: function () {
        this.employees.forEach(employee => {
            employee.total = employee.academy + employee.challange;
        })
    },

    fetchData: async function () {
        const data = await fetch(auth.url, {
            headers: { 'Authorization': 'Basic ' + btoa(auth.user + ":" + auth.password) }
        });
        return data.json();
    }, 

    sortEmployees: function () {
        this.employees.sort((a, b) => {
            if (a[this.sortedBy] == b[this.sortedBy]) return 0
            if (this.sortedFromMaxToMin && a[this.sortedBy] > b[this.sortedBy] || !this.sortedFromMaxToMin && a[this.sortedBy] < b[this.sortedBy])
                return -1;
            return 1;
        })
    },

    template: function () {
        const catagories = this.catagories();
        let template = `<thead><tr><th scope="col">#</th>`
        catagories.forEach(catagory => {
            template += `<th scope="col" style="cursor:pointer;" onclick="table.onClick('${catagory}');return false;">${catagory}</th>`
        });
        template += `</tr></thead><tbody>`;
        this.employees.forEach((employee, index) => {
            template += `<tr><th scope="row">${index + 1}</th>`
            catagories.forEach(catagory => {
                template += `<td>${employee[catagory] === null ? "" : employee[catagory]}</td>`
            });
        })
        template += `</tr>`

        return template;
    }
}

table.init();

