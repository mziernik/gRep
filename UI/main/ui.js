'use strict';

function GrepUI(grep, data) {

    function apiEdit(modal, table, pk, data) {
        api.model.edit({
            params: {
                table: table,
                key: pk
            },
            data: data,
            onSuccess: () => {
                if (modal)
                    modal.close();
                grep.reload();
            }
        });
    }

    function apiRemove(modal, confirm, table, pk) {

        new DsModal("Usuń").confirm(confirm, (btn) => api.model.remove({
                params: {
                    table: table,
                    key: pk
                },
                onSuccess: () => {
                    btn.modal.close();
                    if (modal)
                        modal.close();
                    grep.reload();
                }
            })
        );

    }

    this.buildMainTree = () => {
        if (!this.dsTree)
            this.dsTree = new DsTree((opt) => {
                opt.id = "tree";
                opt.tag = $id("main-tree");
            });


        this.dsTree.clear();

        var tAttrs = this.dsTree.item("attr", "#Atrybuty");
        tAttrs.onClick = (cat, item) => document.location = "#attributes";

        var tCats = this.dsTree.item("cats", "#Kategorie");
        tCats.onClick = (cat, item) => document.location = "#categories";


        var build = (cat) => {
            var parent = cat.parent ? cat.parent.item : this.dsTree;
            cat.item = parent.item(cat.id, cat.name);
            cat.item.data = cat;
            cat.item.onClick = (cat, item, e) => {
                document.location = "#group/" + cat.id;
            };

            cat.item.onContextMenu = (cat, item, e) => {
                var menu = new PopupMenu();
                menu.add("Przenieś", (mi) => {

                    var div = $tag("div");
                    div.tag("div", "Rodzic");
                    var sel = this.createCatalogsSelect(div, [cat, cat.parent]);

                    new DsModal("Przenieś \"" + item.name + "\"")
                            .buttonsYesCancel((btn, e) =>
                                apiEdit(btn.modal, "catalog", cat.id, {
                                    parent: sel.selectedOptions[0].category.id
                                })
                            ).show(div);

                });
                menu.add("Edytuj", (mi) => {
                    alert(cat);
                });
                menu.add("Usuń", (mi) => {
                    alert(cat.name);
                });
                menu.show();

                e.cancelBubble = true;
                //  e.preventDefault();

                return false;
            };

            if (cat.catalogs)
                cat.catalogs.forEach(it => build(it));
        };


        data.catalog.forEach(cat => {
            if (!cat.parent)
                build(cat);
        });


        const mtree = $id("main-tree");

        mtree.oncontextmenu = (e) => {

            var menu = new PopupMenu();
            menu.add("Nowy katalog", (mi) => {
                new DsModal("Nowy katalog").prompt("Nazwa katalogu", "Katalog", (value, btn, e) => {
                    alert(value);
                });

            });
            menu.show();

            return false;
        };


        $(mtree).sortable({
            axis: "y",
            //    helper: "clone",
            items: "li", //.ds-tree-header
            //   helper: (event, ui) => ui[0].parentNode,

            stop: (event, ui) => {
                var el = ui.item[0];
                var item = el.dsTree;
                var next = el.previousSibling ? el.previousSibling.dsTree : null;
                var parr = el.parentNode ? el.parentNode.dsTree : null;

                item.parent.items.remove(item);

                var par = null;
                var idx;
                if (next) { // Za [next]
                    par = next.parent;
                    idx = par.items.indexOf(next) + 1;
                }

                if (parr && !next) { // Przed [parr]
                    par = parr.parent;
                    idx = par.items.indexOf(parr) - 1;
                }

                if (!par)
                    return;

                var modal;

                var doSort = () => {

                    par.items.splice(idx, 0, item);
                    if (item.parent !== par) {
                        item.data.newParent = par.data || null;
                    }
                    item.parent = par;
                    item.update();


                    var reordered = [];

                    var visit = (item) => {
                        $.each(item.items, (idx, it) => {
                            var cat = it.data;
                            if (!cat)
                                return;

                            if (cat.index !== idx || cat.newParent !== undefined)
                                reordered.push({
                                    table: "catalog",
                                    key: cat.id,
                                    data: {
                                        index: idx,
                                        parent: cat.newParent !== undefined
                                                ? cat.newParent ? cat.newParent.id : null
                                                : undefined
                                    }
                                });

                            cat.index = idx;
                            visit(it);
                        });
                    };
                    visit(this.dsTree);

                    api.model.editMultiple({
                        data: reordered,
                        onSuccess: () => {
                            if (modal)
                                modal.close();
                            grep.reload();
                        }
                    });
                }

                var dstName = par.name || "Gałąź główna";

                if (item.parent === par)
                    doSort();
                else
                    modal = new DsModal("Przenieś katalog").confirm(
                            `Czy na pewno przenieść ${item.name} do ${dstName}?`,
                            doSort, grep.reload);

            }

        }).disableSelection();

        document.addEventListener("keydown", (e) => {
            if (e.keyCode === 27)
                $(mtree).sortable("cancel");
        });




    };




    this.createCatalogsSelect = (tag, excludes) => {
        var sel = tag.tag("select");

        function visit(cat, level) {

            var pre = "";
            for (var i = 0; i < level; i++)
                pre += "\xa0\xa0\xa0\xa0";
            sel.tag("option", pre + cat.name).category = cat;

            cat.catalogs.forEach(cat => {
                visit(cat, level + 1);
            });
        }

        data.catalog.forEach(cat => {
            if (!cat.parent)
                visit(cat, 0);
        });
        return sel;
    };

    this.displayCatalog = (catalog) => {

        if (typeof catalog === "number")
            catalog = data.catalog[catalog];

        if (!catalog)
            return;

        this.currentCatalog = catalog;

        var mcList = $id("mc-list");
        var mcDetails = $id("mc-details");

        mcList.clear();

        mcList.tag("h4", catalog.name);

        var table = mcList.tag("table").cls("mc-table");

        (catalog.attributes || []).forEach(attr => {
            var tr = table.tag("tr");
            tr.tag("td")
                    .tag("span")
                    .cls(attr.attribute.icon ? "fa fa-" + attr.attribute.icon : null);

            tr.tag("td")
                    .tag("a")
                    .on("click", () => this.editAttribute(catalog, attr, attr.attribute))
                    .txt(attr.attribute.name);

            tr.tag("td")
                    .tag("a")
                    .on("click", () => this.editAttribute(catalog, attr, attr.attribute))
                    .txt(attr.value);

        });

        (catalog.resources || []).forEach(res => {
            var tr = table.tag("tr");
            tr.tag("td")
                    .tag("span")
                    .cls("fa fa-file");
            tr.tag("td")
                    .attr("colspan", 2)
                    .tag("a")
                    .txt(res.name);

        });

        var tr = table.tag("tr");
        tr.tag("td").tag("span");

        var sel = tr
                .tag("td")
                .tag("select");

        data.attribute.forEach(attr => sel.tag("option", attr.name).attr = attr);

        tr.tag("td")
                .tag("buton", "Dodaj")
                .on("click", () => this.editAttribute(catalog, null,
                            sel.selectedOptions[0].attr));
    };

    this.displayAttributes = () => {

        var mcList = $id("mc-list");
        var mcDetails = $id("mc-details");

        mcList.clear();
        mcDetails.clear();

        mcList.tag("h4", "Atrybuty");

        var table = mcList.tag("table").cls("mc-table");
        $.each(data.attribute, (idx, attr) => {
            var tr = table.tag("tr");
            tr.attr = attr;

            var td = tr.tag("td");
            if (attr.icon)
                td.tag("span").cls("fa fa-" + attr.icon);

            tr.tag("td", attr.name);

            var elms = [];
            $.each(attr.elements, (idx, elm) => {
                elms.push(elm.name);
            });

            td = tr.tag("td", elms.join(", "));

            tr.tag("td", attr.description);



            tr.on("click", (e) => {
                var attr = e.currentTarget.attr;
                mcDetails.clear();

                mcDetails.tag("h4", "Szczegóły: " + attr.name);

                mcDetails.tag("textarea", attr.comment);


            });

        });
    };

    this.editAttribute = (catalog, catAttr, attr) => {

        var html = $tag("div").cls("mc-attr-edit");

        var tbl = html.tag("table");

        var elms = {};

        var modal = new DsModal((catAttr ? 'Edycja atrybutu' : 'Nowy atrybut')
                + ' "' + attr.name + '"');

        attr.elements.forEach((elm, idx) => {
            var tr = tbl.tag("tr");
            tr.tag("td", elm.name + (elm.required ? " *" : ""));
            var inp = tr.tag("td").tag("input");
            inp.value = catAttr && catAttr.value[idx] ? catAttr.value[idx] : "";
            elms[elm.name] = inp;
            modal.focus = modal.focus || inp;
        });

        html.tag("br");
        html.tag("div", "Notatki");

        var ta = html.tag("textarea", catAttr ? catAttr.notes : null);


        modal.btnOK((btn, e) => {
            var data = {
                catalog: catalog.id,
                attribute: attr.id,
                value: [],
                notes: ta.value};
            $.each(elms, (idx, elm) => data.value.push(elm.value));

            apiEdit(btn.modal, "catalogAttr", catAttr ? catAttr.id : null, data);
        })
                .btnRemove((btn, e) =>
                    apiRemove(btn.modal, "Czy na pewno usunąć atrybut?", "catalogAttr", catAttr.id)
                )
                .btnCancel()
                .show(html);


//        this.title = data.title;
//        this.type = data.type;
//        this.icon = data.icon;
//        this.close = data.type;
//        this.onClick = data.onClick;
//        this.modal = dsModal;

        /*
         td.tag("span")
         .cls("fa fa-remove")
         .on("click", (e) => {
         new DsModal("Usuń atrybut")
         .confirm("Czy na pewno usunąć atrybut \""
         + attr.attribute.name + "\"?", () => {
         alert("aaa");
         });
         });
         */
    };


    $id("btnMainExport").onclick = (e) => {
        api.export();
    };

    $id("btnMainImport").onclick = (e) => {

        var input = $tag("input");
        input.setAttribute("type", "file");
        input.setAttribute("style", "visibility:hidden");

        input.click(e);

        if (!input.files[0])
            return;

        var formData = new FormData(input);

        $.post("", formData, function (data) {
            alert(data);
        });

    };

}
