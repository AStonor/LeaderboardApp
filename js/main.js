

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

    columns : {Employee_ID : "Employee Id", name: "Name", client: "Client", country : "Country", retailer: "Retailer", store: "Store", academy: "Academy", challange: "Challange", manual_points: "Manual Points", total: "Total"},

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
            if (a[this.sortedBy] == b[this.sortedBy]) 
               return this.sortedFromMaxToMin && a.name > b.name || !this.sortedFromMaxToMin && a.name < b.name ? -1 : 1; 
            if (this.sortedFromMaxToMin && a[this.sortedBy] > b[this.sortedBy] || !this.sortedFromMaxToMin && a[this.sortedBy] < b[this.sortedBy])
                return -1;
            return 1;
        })
    },

    template: function () {
        return `
        <thead>
          <tr>
            <th scope="col">#</th>
            ${Object.entries(this.columns).map(([key, value]) => `<th scope="col" style="cursor:pointer;" onclick="table.onClick('${key}');return false;">${value}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${this.employees.map((employee, index) => `
            <tr>
              <th scope="row">${index + 1}</th>
              ${Object.keys(this.columns).map(column => `<td>${employee[column] === null ? "" : employee[column]}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      `
    }
}

table.init();

