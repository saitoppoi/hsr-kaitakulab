(async () => {
    const dataUrl = "data/basic-attack.tsv";
    const dataHeader = document.getElementById("dataHeader");
    const dataBody = document.getElementById("dataBody");
    let list;

    const createHeaders = (headers) => {
        const template = "<th class='{{className}}' data-sort='{{sortKey}}'>{{title}}</th>";
        const fields = [];

        const html = headers.map((header, index) => {
            fields.push("col" + index);

            let classNames = ["align-middle", "sort"];

            if (index >= headers.length -1) {
            } else if (index >= 18) {
                classNames.push("table-success");
            } else if (index >= 13) {
                classNames.push("table-danger");
            } else if (index >= 8) {
                classNames.push("table-primary");
            }

            let html = template.replace("{{title}}", header.replace("\n", "<br>"));
            html = html.replace("{{className}}", classNames.join(" "))
            html = html.replace("{{sortKey}}", "col" + index)
            return html
        });

        return {"html" : html.join(""), fields:fields };
    }

    const createListHtml = (data) => {
        const rowTemplate = "<tr>{{row}}</tr>";
        const cellTemplate = "<td class='{{className}}'>{{data}}</td>";

        const html = data.map(row => {
            const cells = row.map((data, index) => {
                let html = cellTemplate.replace("{{data}}", data);;
                html = html.replace("{{className}}", "col" + index);
                return html;
            });
            return rowTemplate.replace("{{row}}", cells.join(""));
        });

        return html.join("\n");
    };

    const filterList = () => {
        list.filter((item) => {
            // 属性
            const selectCombatTypes = [...document.querySelectorAll(".combatType:checked")].map( dom => parseInt(dom.value));
            const combatTypeIndex = HSRKLAB.config.combatTypes.indexOf(item.values().col5);

            if (selectCombatTypes.indexOf(combatTypeIndex) == -1) {
                return false;
            }

            // 運命
            const selectPaths = [...document.querySelectorAll(".path:checked")].map( dom => parseInt(dom.value));
            const pathIndex = HSRKLAB.config.paths.indexOf(item.values().col6);

            if (selectPaths.indexOf(pathIndex) == -1) {
                return false;
            }

            // 距離区分
            const selectRanges = [...document.querySelectorAll(".range:checked")].map( dom => parseInt(dom.value));
            const rangeIndex = HSRKLAB.config.ranges.indexOf(item.values().col7);

            if (selectRanges.indexOf(rangeIndex) == -1) {
                return false;
            }

            return true;
        })

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

    const setupFilterForm = () => {
        // 属性
        const combatTypes = document.getElementById("combatTypes");
        const combatTypeTemplateHtml = `<div class="form-check form-check-inline">
<input class="form-check-input combatType" type="checkbox" id="combatType{{index}}" value="{{value}}" checked>
<label class="form-check-label" for="combatType{{index}}">{{name}}</label>
</div>`;
        const combatTypesHtml = HSRKLAB.config.combatTypes.map((name, index) => {
            let html = combatTypeTemplateHtml.replaceAll("{{index}}", index);
            html = html.replaceAll("{{value}}", index);
            html = html.replaceAll("{{name}}", name);
            return html;
        });
        combatTypes.innerHTML = combatTypesHtml.join("\n");
        document.querySelectorAll(".combatType").forEach(dom => {
            dom.addEventListener("change", () => {
                filterList();
            });
        });

        const allCombatTypesButton = document.getElementById("allCombatTypesButton");
        allCombatTypesButton.addEventListener("click", () => {
            document.querySelectorAll(".combatType").forEach(dom => {
                dom.checked = true;
            });
            filterList();
        });

        // 運命
        const paths = document.getElementById("paths");
        const pathsTemplateHtml = `<div class="form-check form-check-inline">
<input class="form-check-input path" type="checkbox" id="paths{{index}}" value="{{value}}" checked>
<label class="form-check-label" for="paths{{index}}">{{name}}</label>
</div>`;
        const pathsHtml = HSRKLAB.config.paths.map((name, index) => {
            let html = pathsTemplateHtml.replaceAll("{{index}}", index);
            html = html.replaceAll("{{value}}", index);
            html = html.replaceAll("{{name}}", name);
            return html;
        });
        paths.innerHTML = pathsHtml.join("\n");
        document.querySelectorAll(".path").forEach(dom => {
            dom.addEventListener("change", () => {
                filterList();
            });
        });

        const allPathsButton = document.getElementById("allPathsButton");
        allPathsButton.addEventListener("click", () => {
            document.querySelectorAll(".path").forEach(dom => {
                dom.checked = true;
            });
            filterList();
        });

        // 距離区分
        const ranges = document.getElementById("ranges");
        const rangesTemplateHtml = `<div class="form-check form-check-inline">
<input class="form-check-input range" type="checkbox" id="ranges{{index}}" value="{{value}}" checked>
<label class="form-check-label" for="ranges{{index}}">{{name}}</label>
</div>`;
        const rangesHtml = HSRKLAB.config.ranges.map((name, index) => {
            let html = rangesTemplateHtml.replaceAll("{{index}}", index);
            html = html.replaceAll("{{value}}", index);
            html = html.replaceAll("{{name}}", name);
            return html;
        });
        ranges.innerHTML = rangesHtml.join("\n");
        document.querySelectorAll(".range").forEach(dom => {
            dom.addEventListener("change", () => {
                filterList();
            });
        });

        const allRangesButton = document.getElementById("allRangesButton");
        allRangesButton.addEventListener("click", () => {
            document.querySelectorAll(".range").forEach(dom => {
                dom.checked = true;
            });
            filterList();
        });
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
    setupFilterForm();
})();