import constants from "@utils/constants.js";

const pages = [
    {
        name:"test"
    },
    {
        name: "search",
        auth: true
    },
    {
        name: "res-report-detail",
        auth: true,
        role: true,
    },
    {name: 'cross-border-transaction-order', role: true},
]

function init() {
    console.error("=================init pathMap===================")
    console.error('VERSION', constants.VERSION);
    console.error("VERSION", constants.DATEVERSION);
    console.error('================================================');
    let pagesMap = {};
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        pagesMap[page.name] = page;
    }
    return pagesMap;
}

export default {
    pagesMap: init(),
}
