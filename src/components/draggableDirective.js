
export const vDraggable = {

    mounted: (el) => {
        let offsetX, offsetY;
        el.onmousedown = function (e) {
            el.style.position = "absolute";

            el.style.zIndex = 1000;

            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;

            function moveAt(e) {
                el.style.left = e.clientX - offsetX + "px";
                el.style.top = e.clientY - offsetY + "px";
            }

            document.onmousemove = function (e) {
                moveAt(e);
            };

            el.onmouseup = function () {
                document.onmousemove = null;
                el.onmouseup = null;
            };
        };

        el.ondragstart = function () {
            return false;
        };
    }
};
