

const auth = {
    url: "", 
    user: "", 
    password: "" 
}

const podium = {
    init: function (employeesSorted) {
        this.el = document.getElementById("topthree");
        [this.el.childNodes[3], this.el.childNodes[1], this.el.childNodes[5]].forEach((el, index) => {
            el.querySelector(".points").innerText = employeesSorted[index].total;
            el.querySelector(".name").innerText = employeesSorted[index].name;
        })

    }
}


const table = {

    sortedBy: "total",

    sortedInDescendingOrder: true,

    columns: { Employee_ID: "Employee Id", name: "Name", client: "Client", country: "Country", retailer: "Retailer", store: "Store", academy: "Academy", challange: "Challange", manual_points: "Manual Points", total: "Total" },

    sortHierarchy : ["total", "academy", "challange", "manual_points", "name"],

    init: async function () {
        this.el = document.getElementById("table");
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

    employeeComparer: function(a, b, sortedBy, hierarchyIndex) {
        let currentHierarchyIndex = hierarchyIndex + 1; 
        if (a[sortedBy] === b[sortedBy])
            return currentHierarchyIndex < this.sortHierarchy.length ? 
                this.employeeComparer(a, b, this.sortHierarchy[currentHierarchyIndex], currentHierarchyIndex) : 0;      
        if (this.sortedInDescendingOrder && a[sortedBy] > b[sortedBy] || !this.sortedInDescendingOrder && a[sortedBy] < b[sortedBy])
            return -1;
        return 1;
    },

    sortEmployees: function () {
           this.employees.sort((a, b) => this.employeeComparer(a, b, this.sortedBy, -1))
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


window.addEventListener("DOMContentLoaded", () => {
    table.init();
});







