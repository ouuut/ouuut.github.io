import aesjs from './aes-js.3.1.2.js';
import QRCode from './QRCode.js';


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

document.getElementById("ecrypte").addEventListener("click", function () {
    var key = document.getElementById("key").value;
    var source = document.getElementById("source").value;
    if(key.toString().length ==0 || source.toString().length ==0){
        console.error("empty");
    }else{
        try {
            var result = ecrypte_fn(key, source)
            if(result.toString().length >= 2048){
                throw "out of the max length of limitation"
            }
            document.getElementById("source").value = result
            window.location.hash = result
        }catch(error) {
            console.error(error);
        }
    }
})

document.getElementById("decrypte").addEventListener("click", function () {
    var key = document.getElementById("key").value;
    var source = document.getElementById("source").value;
    if(key.toString().length ==0 || source.toString().length ==0){
        console.error("empty");
    }else{
        try {
            if(source.toString().length < 2){
                throw "fewer than the min length of ecrypte text"
            }
            var result = decrypte_fn(key, source)
            document.getElementById("source").value = result
            window.location.hash = result
        }catch(error) {
            console.error(error);
        }
    }
})

window.addEventListener("load", function () {
    if(window.location.hash) {
        document.getElementById("source").value = window.location.hash.substr(1)
    } else {
        // Fragment doesn't exist
    }
});


document.getElementById("qrcode_button").addEventListener("click", function () {
    window.location.hash = document.getElementById("source").value
    if(window.location.hash) {
        var e_qrcode = document.getElementById("qrcode");
        if(window.qrcode_object == undefined){
            window.qrcode_object = new QRCode(e_qrcode, {
                width : window.innerWidth/2,
                height : window.innerWidth/2
            });
        }
        window.qrcode_object.clear()
        window.qrcode_object.makeCode(window.location.href);
        document.getElementById("qrcode").style.visibility = "visible";
    } else {
        // Fragment doesn't exist
    }
});