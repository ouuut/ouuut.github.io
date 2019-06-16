
var Png = {};
Png.PNG_SIG = String.fromCharCode(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
// check PNG signature
Png.isPNG = function (s) {
    var sig = s.substr(0, 8);
    return (sig == Png.PNG_SIG);
};
Png.splitChunk= function (s) {
    // read signature
    var sig = s.substr(0, 8);
    if (!Png.isPNG(sig)) return false;
    s = s.substr(8); // chomp sig
    var chunklist = [];
    // read chunk list
    while (s != '') {
        var chunk = {};
        // read chunk size
        var size = stoi(s.substr(0, 4));
        if (size < 0) {
            // If the size is negative, the data is likely corrupt, but we'll let
            // the caller decide if any of the returned chunks are usable.
            // We'll move forward in the file with the minimum chunk length (12 bytes).
            size = 0;
        }
        var buf = s.substr(0, size + 12);
        s = s.substr(size + 12); // delete this chunk
        // read chunk data
        chunk.size = size;
        chunk.type = buf.substr(4, 4);
        chunk.data = buf.substr(8, size);
        chunk.crc  = stoi(buf.substr(8 + size, 4));
        // add chunk
        chunklist.push(chunk);
    }
    return chunklist;
};
Png.joinChunk = function (chunklist) {
    var pf = Png.PNG_SIG;
    for (var i in chunklist) {
        var chunk = chunklist[i];
        // check size
        // chunk.size = chunk.data.length;
        // calc crc
        // var crc_v = crc32(chunk.type + chunk.data);
        //
        var buf = "";
        buf += itos(chunk.size, 4);
        buf += chunk.type;
        buf += chunk.data;
        buf += itos(chunk.crc, 4);
        // console.log("w", chunk.size, chunk.type, ToUInt32(chunk.crc));
        pf += buf;
    }
    return pf;
};
Png.createChunk = function (type, data) {
    var c = {};
    c.type = type;
    c.data = data;
    c.size = data.length;
    c.crc  = crc32(type+data);
    return c;
};
Png.itos = itos;
function itos(v, size) {
    var a = [];
    var t = size - 1;
    while (t >= 0) {
        var c = v & 0xFF;
        a[t--] = c;
        v = v >> 8;
    }
    a = a.map(function(v) {
        return String.fromCharCode(v);
    });
    return a.join('');
}
Png.stoi = stoi;
function stoi(s) {
    var v = 0;
    for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i);
        v = (v << 8) | (c & 0xFF);
    }
    return v;
}
function ToInt32(x) {
    return x | 0;
}
function ToUInt32(x) {
    return x >>> 0;
}
function crc32(str) {
    var hexTable = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D]
    var crc = 0 ^ (-1);
    for (var i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ hexTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}



export function setDate(base64image,key,value){
    var key = key+"";
    if(key.length!==4){
        throw "key's length must be 4"
    }
    var value = value+"";
    if(value.length==0){
        throw "value's length must > 0"
    }
    var strs = base64image.toString().split(";base64,")
    if(strs.length!=2){
        throw "not a png image"
    }
    var pre = strs[0]+";base64,";
    var base64Code = strs[1];
    var list = Png.splitChunk(atob(base64Code));
    //remove the exist chunk and replace the new chunk
    for(var i in list){
        if(key == list[i].type){
            list[i] = Png.createChunk(key,value);
            var newPng = Png.joinChunk(list);
            return pre + btoa(newPng);
        }
    }
    //add the chunk to the end of list
    var iEnd = list.pop();
    var newChunk = Png.createChunk(key,value);
    list.push(newChunk);
    list.push(iEnd);
    var newPng = Png.joinChunk(list);
    return pre + btoa(newPng);
}
export function getDate(base64image,key){
    var key = key+"";
    if(key.length!=4){
        throw "key's length must be 4"
    }
    var strs = base64image.toString().split(";base64,")
    if(strs.length!=2){
        throw "not a png image"
    }
    var base64Code = strs[1];
    var list = Png.splitChunk(atob(base64Code));
    for(var i in list){
        if(key == list[i].type){
            return list[i].data;
        }
    }
    return null;
}

// var data = "data:image/png;base64,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"
// var newData = setDate(data,"abcd","abcd")
// console.log("getDate(data,a)="+getDate(newData,"abcd"))
// newData = setDate(data,"abcd","abcd1")
// console.log("getDate(data,abcd)="+getDate(newData,"abcd"))
// newData = setDate(data,"aaaa","aaaa")
// console.log("getDate(data,aaaa)="+getDate(newData,"aaaa"))