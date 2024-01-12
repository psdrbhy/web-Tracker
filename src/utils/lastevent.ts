let lastEvent:Event;
['click', 'touchstart', 'mousedown'].forEach(event => {
    document.addEventListener(event, (e) => {
        lastEvent = e;
    }), {
        capture: true,
        passive:true
    }
})

export default function () {
    return lastEvent;
} 