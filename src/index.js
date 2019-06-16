import aesjs from './aes-js.3.1.2.js';
import QRCode from './QRCode.js';
import {setDate,getDate} from './pngMap'


function el(id){return document.getElementById(id);} // Get elem by ID

function form256bytes(key) {
    var key = aesjs.utils.utf8.toBytes(key)
    var key_256_array = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31]);
    var key_256 = []
    for (var i = 0; i < key_256_array.length; i++) {
        if (key[i] == undefined) {
            key_256.push(key_256_array[i])
        } else {
            key_256.push(key[i])
        }
    }
    return key_256
}

function ecrypte_fn(key, encryptedText) {
    // Convert text to bytes
    //var encryptedText = 'Text may be any length you wish, no padding is required.';
    var textBytes = aesjs.utils.utf8.toBytes(encryptedText);

    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(form256bytes(key), new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    //console.log(encryptedHex);
    // "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
    //  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"
    return encryptedHex
}

function decrypte_fn(key, encryptedHex) {
    // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
    //var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(form256bytes(key), new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    //console.log(decryptedText);
    // "Text may be any length you wish, no padding is required."
    return decryptedText
}

function encrypte_text() {
    var key = el("key").value;
    var source = el("source").value;
    if(key.toString().length ==0 || source.toString().length ==0){
        console.error("empty");
    }else{
        try {
            var result = ecrypte_fn(key, source)
            if(result.toString().length >= 2048){
                throw "out of the max length of limitation"
            }
            el("source").value = result
            window.location.hash = result
        }catch(error) {
            console.error(error);
        }
    }
}
function decrypte_text() {
    var key = el("key").value;
    var source = el("source").value;
    if(key.toString().length ==0 || source.toString().length ==0){
        console.error("empty");
    }else{
        try {
            if(source.toString().length < 2){
                throw "fewer than the min length of ecrypte text"
            }
            var result = decrypte_fn(key, source)
            el("source").value = result
            window.location.hash = result
        }catch(error) {
            console.error(error);
        }
    }
}
function encrypte_image() {
    var key = el("key").value;
    var source = uploadFile;
    if(key.toString().length ==0 || source.toString().length ==0){
        console.error("empty");
    }else{
        try {
            var result = ecrypte_fn(key, source)
            if(result.toString().length >= 20480000){
                throw "out of the max length of limitation"
            }
            el("img").src = setDate(icon,"1111",result)
        }catch(error) {
            console.error(error);
        }
    }
}
function decrypte_image() {
    var key = el("key").value;
    var source = el("img").src;
    if(key.toString().length ==0 || source.toString().length ==0){
        console.error("empty");
    }else{
        try {
            if(source.toString().length < 2){
                throw "fewer than the min length of encrypte text"
            }
            var result = getDate(el("img").src,"1111")
            result = decrypte_fn(key, result)
            el("img").src = result
        }catch(error) {
            console.error(error);
        }
    }
}

/**
 * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
 * by testing for a 'synthetic=true' property on the event object
 * @param {HTMLNode} node The node to fire the event handler on.
 * @param {String} eventName The name of the event without the "on" (e.g., "focus")
 */
function fireEvent(node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9){
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

    if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
                eventClass = "MouseEvents";
                break;

            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                break;
        }
        var event = doc.createEvent(eventClass);
        event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

        event.synthetic = true; // allow detection of synthetic events
        // The second parameter says go ahead with the default action
        node.dispatchEvent(event, true);
    } else  if (node.fireEvent) {
        // IE-old school style, you can drop this if you don't need to support IE8 and lower
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
};

el("image_button").addEventListener("click", function () {
    fireEvent(el("upload"),"click")
})

el("x").addEventListener("click", function () {
    var result = "";
    el("source").value = result
    window.location.hash = result
})

el("encrypte").addEventListener("click", function () {
    encrypte_text()
    encrypte_image()
})

el("decrypte").addEventListener("click", function () {
    decrypte_text()
    decrypte_image()
})

var icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAoklEQVR4Ad2QMQ6CMBhG/8QVb4CXkHMY8CTi8M4hnkQOopeQxTLK2gT7Lzbkj2lHA29ovuQ9IJW1PBxxzAlGaoQgK2ldcTHQ2TD8VJ/Uei4DoaDDG9lzoUBs0FMiVDwW+p09wo7eBIGJlk2gZUL3mxO6z7pN8H1jhVDSc7NftIHi6fSfA1uuYc2pQBlo7K3ZwLDuYMzSXzGocRn6IQaZ/GnwAWkF9f1nWgYGAAAAAElFTkSuQmCC";
var uploadFile = null;

window.addEventListener("load", function () {
    if(window.location.hash) {
        el("source").value = window.location.hash.substr(1)
    } else {
        // Fragment doesn't exist
    }
});

el("qrcode_button").addEventListener("click", function () {
    window.location.hash = el("source").value
    if(window.location.hash) {
        var e_qrcode = el("qrcode");
        if(window.qrcode_object == undefined){
            window.qrcode_object = new QRCode(e_qrcode, {
                width : window.innerWidth/2,
                height : window.innerWidth/2
            });
        }
        window.qrcode_object.clear()
        window.qrcode_object.makeCode(window.location.href);
        el("qrcode").style.visibility = "visible";
    } else {
        // Fragment doesn't exist
    }
});


el("upload").addEventListener("change", function() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
            uploadFile = e.target.result
            el("img").src = uploadFile
        };
        FR.readAsDataURL( this.files[0] );
    }
}, false);

// https://stuk.github.io/jszip/documentation/examples/read-local-file-api.html
// https://github.com/gildas-lormeau/zip.js
// http://www.libpng.org/pub/png/spec/1.2/PNG-Structure.html