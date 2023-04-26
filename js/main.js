

const auth = {
    url: "",
    user: "",
    password: ""
}

const podium = {

    el: document.getElementById("topthree"),

    init: function (employeesSorted) {
        [this.el.childNodes[3], this.el.childNodes[1], this.el.childNodes[5]].forEach((el, index) => {
            el.childNodes[3].innerText = employeesSorted[index].total;
            el.childNodes[5].innerText = employeesSorted[index].name;
        })

    }
}

const table = {

    el: document?.getElementById("table"),

    sortedBy: "total",

    sortedInDescendingOrder: true,

    columns: { Employee_ID: "Employee Id", name: "Name", client: "Client", country: "Country", retailer: "Retailer", store: "Store", academy: "Academy", challange: "Challange", manual_points: "Manual Points", total: "Total" },

    init: async function () {
        this.employees = await this.fetchData();
        this.calcAndAddTotalToEmployees();
        this.update();
        podium.init(this.employees);
    },

    update: function () {
        this.sortEmployees();
        if (this.el) this.el.innerHTML = this.template();
    },

    onClick: function (column) {
        this.sortedBy === column ? this.sortedInDescendingOrder = !this.sortedInDescendingOrder : this.sortedBy = column;
        this.update();
    },

    calcAndAddTotalToEmployees: function () {
        this.employees.forEach(employee => {
            if(!employee.academy || isNaN(employee.academy)) employee.academy = 0;
            if(!employee.challange || isNaN(employee.challange)) employee.challange = 0;
            employee.total = employee.academy + employee.challange;
        })
    },

    fetchData: async function () {
        const response = await fetch(auth.url, {
            headers: { 'Authorization': 'Basic ' + btoa(`${auth.user}:${auth.password}`) }
        });
        return response.json();
    },

    sortEmployees: function () {
        if (typeof this.sortedInDescendingOrder !== "boolean")
            throw new Error(`Variable sortedInDescendingOrder is not a boolean (${this.sortedInDescendingOrder}).`);
        this.employees.sort((a, b) => {
            if (a[this.sortedBy] === b[this.sortedBy]) return a.name < b.name ? -1 : 1;
            if (this.sortedInDescendingOrder && a[this.sortedBy] > b[this.sortedBy] || !this.sortedInDescendingOrder && a[this.sortedBy] < b[this.sortedBy])
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
              ${Object.keys(this.columns).map(column => `<td>${employee[column] ?? ""}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      `
    }
}


window.addEventListener("DOMContentLoaded", (event) => {
    table.init();
});


module.exports = table;







