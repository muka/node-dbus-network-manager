/**
 * @source https://github.com/JumpLink/node-networkmanager/blob/master/index.js
 * @author https://github.com/JumpLink
 * @license MIT
 */

var converter = exports
var Netmask = require('netmask').Netmask

var arrayOfBytesToString = function (ArrayOfBytes) {
  var SsidString = ""; // map D-Bus type "ab" (Array of bytes) to String
  ArrayOfBytes.forEach(function (code) {
    SsidString += String.fromCharCode(code);
  });
  return SsidString;
};
converter.arrayOfBytesToString = arrayOfBytesToString

// undo arrayOfBytesToString
var stringToArrayOfBytes = function (str) {
  var bytes = [];
  for(var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
};
converter.stringToArrayOfBytes = stringToArrayOfBytes

// http://javascript.about.com/library/blipconvert.htm
var numToIP = function (num) {
  var d = num % 256;
  for(var i = 3; i > 0; i--) {
    num = Math.floor(num / 256);
    d = d + '.' + num % 256;
  }
  return d;
}
converter.numToIP = numToIP


// undo numToIP
var ipToNum = function (dot) {
  var d = dot.split('.');
  return((((((+d[3]) * 256) + (+d[2])) * 256) + (+d[1])) * 256) + (+d[0]);
}
converter.ipToNum = ipToNum

// http://jsperf.com/convert-byte-array-to-hex-string
var arrayOfBytesToMac = function (byteArrayData) {
  var ret = "",
    i = 0,
    len = byteArrayData.length;
  while(i < len) {
    var h = byteArrayData[i].toString(16);
    if(h.length < 2) {
      h = "0" + h;
    }
    ret += h.toUpperCase();
    if(i + 1 != len)
      ret += ":";
    i++;
  }
  return ret;
}
converter.arrayOfBytesToMac = arrayOfBytesToMac

// undo arrayOfBytesToMac
function MacToArrayOfBytes(str) {
  var result = [];
  var hexArray = str.split(':');
  hexArray.forEach(function (hex) {
    result.push(parseInt(hex, 16));
  });
  return result;
}
converter.MacToArrayOfBytes = MacToArrayOfBytes

function ShortIPv6(value) {
  return value;
}
converter.ShortIPv6 = ShortIPv6

var arrayOfBytesToIPv6 = function (byteArrayData) {
  var ret = "",
    i = 0,
    len = byteArrayData.length;
  while(i < len) {
    var h = parseInt(byteArrayData[i]).toString(16);

    if(h.length < 2) {
      h = "0" + h;
    }
    ret += h;
    if(i % 2 != 0 && i + 1 != len) { // number odd and not last
      ret += ":";
    }
    i++;
  }
  return ShortIPv6(ret);
}
converter.arrayOfBytesToIPv6 = arrayOfBytesToIPv6

// Addresses is Array of tuples of IPv4 address/prefix/gateway.
// All 3 elements of each tuple are in network byte order.
// Essentially: [(addr, prefix, gateway), (addr, prefix, gateway), ...]
// See
//   https://developer.gnome.org/NetworkManager/0.9/spec.html#org.freedesktop.NetworkManager.IP4Config
//   https://github.com/rs/node-netmask
var AddressTupleToIPBlock = function (AddressTuple) {

  var ip = numToIP(AddressTuple[0]);
  var bitmask = AddressTuple[1];
  var gateway = numToIP(AddressTuple[2]);
  var block = new Netmask(ip, bitmask);
  block.ip = ip;
  block.gateway = gateway;
  return block;
};
converter.AddressTupleToIPBlock = AddressTupleToIPBlock

// undo AddressTupleToIPBlock
var IPBlockToAddressTuple = function (IpBLock) {
  var ip = ipToNum(IpBLock.ip);
  var bitmask = IpBLock.bitmask;
  var gateway = ipToNum(IpBLock.gateway);
  return [ip, bitmask, gateway];
}
converter.IPBlockToAddressTuple = IPBlockToAddressTuple

var AddressTupleToIPv6Block = function (AddressTuple) {
  var result = {};

  var buf1 = AddressTuple[0]
  result.address = arrayOfBytesToIPv6(buf1.data)

  result.netmask = AddressTuple[1]

  var buf2 = AddressTuple[2]
  result.gateway = arrayOfBytesToIPv6(buf2.data)

  return result;
};
converter.AddressTupleToIPv6Block = AddressTupleToIPv6Block
