(async () => {
    const dataUrl = "data/tech-rta.tsv";
    const dataHeader = document.getElementById("dataHeader");
    const dataBody = document.getElementById("dataBody");

    const createHeaders = (headers) => {
        const template = "<th class='{{className}}' data-sort='{{sortKey}}'>{{title}}</th>";
        const fields = [];

        const html = headers.map((header, index) => {
            fields.push("col" + index);

            let classNames = ["align-middle", "sort"];

            let html = template.replace("{{title}}", header.replace("\n", "<br>"));
            html = html.replace("{{className}}", classNames.join(" "))
            html = html.replace("{{sortKey}}", "col" + index)

            return html;
        });

        return {"html" : html.join(""), fields:fields };
    }

    const createListHtml = (list) => {
        const rowTemplate = "<tr>{{row}}</tr>";
        const cellTemplate = "<td class='{{className}}'>{{data}}</td>";

        const html = list.map(row => {
            const cells = row.map((data, index) => {
                let html = cellTemplate.replace("{{data}}", data);;
                html = html.replace("{{className}}", "col" + index);
                return html;
            });
            return rowTemplate.replace("{{row}}", cells.join(""));
        });

        return html.join("\n");
    };

    const setupList = (headers, data) => {
        const headerData = createHeaders(headers);
        const listHtml = createListHtml(data);
        dataHeader.innerHTML = headerData.html;
        dataBody.innerHTML = listHtml;

        const options = {
            valueNames: headerData.fields
        }
        list = new List('dataList', options);

        list.sort("col0", {order: "asc"});
    }

    const fetchData = async () => {
        const response = await fetch(dataUrl);
        const data = Papa.parse(await response.text()).data;
        const headers = data.shift();
        const _data = data;

        return {headers: headers, data:_data};
    };

    const listData = await fetchData();
    
    setupList(listData.headers, listData.data)

})();