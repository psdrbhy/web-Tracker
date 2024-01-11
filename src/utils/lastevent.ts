let lastEvent:Event;
['click', 'touchstart', 'mousedown'].forEach(event => {
    document.addEventListener(event, (e) => {
        lastEvent = e;
    }), {
        capture: true,
        passive:true
    }
})

console.log(lastEvent)
export default function () {
    return lastEvent;
} 