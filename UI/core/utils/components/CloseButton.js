function closeButton(parent, width, height) {
    /*
     * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260">
     * <path fill="#000000" d="M6 198l68 -68 -68 -68c-8,-8 -8,-21 0,-29l26 -26c8,-8 21,-8 29,0l68 68 68 -68c8,-8 21,-8 29,0l26 26c8,8 8,21 0,29l-68 68 68 68c8,8 8,21 0,29l-26 26c-8,8 -21,8 -29,0l-68 -68 -68 68c-8,8 -21,8 -29,0l-26 -26c-8,-8 -8,-21 0,-29z"/></svg>


     *
     */

    width = Utils.coalesce(width, 16);
    height = Utils.coalesce(height, 16);
    var pre = parent.tag("div");
    var div = pre.tag("div");
    var svg = new SVG(div, (width - 5) + "px", (height - 5) + "px", "0 0 260 260");
    var p = svg.path("M6 198l68 -68 -68 -68c-8,-8 -8,-21 0,-29l26 -26c8,-8 21,-8 29,0l68 "
        + "68 68 -68c8,-8 21,-8 29,0l26 26c8,8 8,21 0,29l-68 68 68 68c8,8 "
        + "8,21 0,29l-26 26c-8,8 -21,8 -29,0l-68 -68 -68 68c-8,8 -21,8 "
        + "-29,0l-26 -26c-8,-8 -8,-21 0,-29z");
    div.onmouseover = function () {
        div.css({backgroundColor: "rgba(240,140,140,1)"});
    };
    div.onmouseout = function () {
        div.css({backgroundColor: "rgba(220,100,100,1)"});
        pre.css({padding: "1px"});
    };
    pre.onmousedown = function () {
        pre.css({padding: "2px 0 2px 0"});
    };
    pre.onmouseup = function () {
        pre.css({padding: "1px"});
    };
    pre.css({
        display: "inline-block",
        padding: "1px",
        margin: 0,
        lineHeight: 0
    });
    div.css({
        display: "inline-block",
        padding: "2px 6px",
        margin: 0,
        backgroundColor: "rgba(220,100,100,1)",
        opacity: 1,
        border: "1px solid #444",
        boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
        borderRadius: "2px",
        lineHeight: 0
    });
    p.css({
        fill: "#FFFFFF",
        pointerEvents: "all",
        stroke: "black",
        strokeWidth: "20"
    });
    return pre;
}
