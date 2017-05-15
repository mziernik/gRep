"use strict";

var data = {
    attribute: new DataSet(),
    attrElm: new DataSet(),
    category: new DataSet(),
    categoryAttr: new DataSet(),
    catalog: new DataSet(),
    catalogAttr: new DataSet(),
    resource: new DataSet()
};

function GRep(spa) {
    this.ui = null;

    this.dsTree;

    this.loaded = false;
    this.currentCatalog = null; //obiekt lub id obiektu

    spa.onHashChange = (e) => {

        if (!this.loaded)
            return;

        if (e.path.length >= 2 && e.path[0] === "group")
            this.ui.displayCatalog(parseInt(e.path[1]));

        switch (e.path[0]) {
            case "attributes":
                this.ui.displayAttributes();
                break;
            case "categories":
                this.ui.displayCategories();
                break;
        }
    };


    spa.beforeControllerChange = function (e) {
        if (e.controller && e.controller.id)
            document.body.setAttribute("ctrl", e.controller.id);
        else
            document.body.removeAttribute("ctrl");

        //  $id("mainNavBarTitle").txt(newCtrl !== null ? newCtrl.name : null);
    };

    spa.onLoad = () => {

        var api = window.api = new GrepApi(new WebApi());

        api.api.onEvent = function (controller, sourceName, hashes, callback, data) {
            if (callback && controller.visible)
                callback(data);
        };

        $("#pre-container").enhsplitter({
            vertical: true,
            position: "200px",
            leftMaxSize: "50%"
        });

        spa.container = $id("main-container");

        $(spa.container).enhsplitter({
            vertical: false,
            position: "70%",
            leftMaxSize: "50%"
        });

        // spa.container.innerHTML = marked('## Marked in browser\n\nRendered by **marked**.');

        //     spa.container.innerHTML = new showdown.Converter().makeHtml("## Marked in browser\n\nRendered by **marked**\n\n* aa\n* bb.");

        this.ui = new GrepUI(this, data);
        this.reload();
    };


    // przeładowanie danych
    this.reload = () => {
        this.loaded = false;

        api.model.getAll({
            data: ["attribute", "attrElm", "catalog", "catalogAttr", "category",
                "categoryAttr", "resource"],
            onSuccess: (e) => {

                $.each(data, (name, obj) => {
                    data[name] = e.unnest(e.data[name]);
                });

                data.catalog.forEach(cat => {
                    cat.category = data.category[cat.category];
                    cat.level = 0;
                    if (cat.parent) {
                        cat.parent = data.catalog[cat.parent];
                        cat.level = cat.parent.level + 1;
                        (cat.parent.catalogs = cat.parent.catalogs || new DataSet())
                                .put(cat.id, cat);
                    }
                });


                data.attribute.forEach(attr => {
                    $.each(attr.elements, (idx, elm) => {
                        attr.elements[idx] = data.attrElm[elm];
                    });
                });

                data.catalogAttr.forEach(catAttr => {
                    catAttr.attribute = data.attribute[catAttr.attribute];
                    catAttr.catalog = data.catalog[catAttr.catalog];
                    (catAttr.catalog.attributes = catAttr.catalog.attributes || new DataSet())
                            .put(catAttr.id, catAttr);
                });

                data.resource.forEach(res => {
                    res.catalog = data.catalog[res.catalog];
                    (res.catalog.resources = res.catalog.resources || new DataSet())
                            .put(res.id, res);
                });


                this.loaded = true;
                this.ui.buildMainTree();
                spa.hashChangeEvent();
            }
        });

    };


}

var grep = new GRep(window.spa);


