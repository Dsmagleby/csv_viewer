export default class {
    /**
     * @param {HTMLTableElement} table
     */
    constructor(table) {
        this.table = table;
        
    }

     /**
     * Clears table
     * 
     * @param {string[]} headerData List of table headers
     * @param {string[][]} body 2D array of body (table body)
     */
      update(headerData = [], body) {
        this.clear();
        this.setHeader(headerData);
        this.setBody(body);
    }

     /**
     * Clears table
     */
    clear() {
        this.table.innerHTML = "";
    }

    /**
     * @param {string[]} headerData List of table headers
     */
    setHeader(headerData) {
        this.table.insertAdjacentHTML('afterbegin', `
            <thead>
                <tr>
                    ${headerData.map(text => `<th>${text}</th>`).join("")}
                </tr>
            </thread>    
        `);
    }


    /**
     * @param {string[][]} body 2D array of body (table body)
     */
    setBody(body) {
        const rowsHTML = body.map(row => {
            return `
                <tr>
                    ${row.map(text => `<td>${text}</td>`).join("")}
                </tr>
            `;
        });
        this.table.insertAdjacentHTML('beforeend', `
            <tbody>
                ${rowsHTML.join("")}
            </tbody>
        `);
    }

}
