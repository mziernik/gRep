
// ToDo: Przerobić na ECMA6



/*  okno komunikatu na środku ekranu */
function CenterBox(data) {
    if (!data)
        return;
    var self = this;
    if (typeof data === "string")
        data = {
            text: data
        };
    var time = Utils.coalesce(data.delay, 0); // czas wyswietlania komunikatu
    var error = Utils.coalesce(data.error, false);
    var grayout = Utils.coalesce(data.grayout, false);
    var closeable = Utils.coalesce(data.closeable, true);
    var zIndex = Utils.coalesce(data.zIndex, null);
    var box = $id("$_center_box");
    if (!box)
        box = document.body.tag("div");
    box.innerHTML = "";
    box.setAttribute("id", "$_center_box");
    box.tag("div").text(data.text);
    if (data.details) {
        box.tag("div")
            .text(data.details)
            .css({
                marginTop: "20px",
                fontSize: "8pt",
                fontStyle: "italic",
                color: "#333"
            });
    }

    box.css({
        font: "10pt Verdana",
        padding: "25px 30px",
        position: "fixed",
        minWidth: "30%",
        textAlign: "center",
        color: "#000",
        border: "1px solid " + (error ? "#a00" : "#060"),
        opacity: 0.9,
        boxShadow: "0 0 4px " + (error ? "#a00" : "#060"),
        textShadow: "0, 0, 2px, #fff",
        zIndex: zIndex,
        transition: "opacity .3s ease-in-out",
        borderRadius: "4px"
    });
    if (error)
        gradient(box, "#faa", "#f66");
    else
        gradient(box, "#efe", "#8f8");
    if (closeable) {
        var btn = Utils.closeButton(box, 16, 16);
        btn.style.position = "absolute";
        btn.style.right = "4px";
        btn.style.top = "4px";
        btn.style.cursor = "pointer";
        btn.onclick = function () {
            self.close();
        };
    }

    var setPos = function () {
        box.css({
            left: (window.innerWidth / 2 - box.offsetWidth / 2) + "px",
            top: (window.innerHeight / 2 - box.offsetHeight / 2) + "px"
        });
    };
    window.addEventListener("resize", function () {
        setPos();
    });
    setPos();
    if (time > 0)
        window.setTimeout(function () {
            self.close();
        }, time, this);
    this.close = function () {
        box.style.opacity = 0;
        window.setTimeout(function () {
            box.remove();
        }, 500);
    };
}


