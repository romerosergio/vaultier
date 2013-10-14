/*Copyright (c) 2009 pidder <www.pidder.com>*/
if(typeof(pidCrypt)!="undefined"){pidCrypt.AES=function(a){this.env=(a)?a:new pidCrypt();this.blockSize=16;this.ShiftRowTabInv;this.xtime;this.SBox=new Array(99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22);this.SBoxInv=new Array(82,9,106,213,48,54,165,56,191,64,163,158,129,243,215,251,124,227,57,130,155,47,255,135,52,142,67,68,196,222,233,203,84,123,148,50,166,194,35,61,238,76,149,11,66,250,195,78,8,46,161,102,40,217,36,178,118,91,162,73,109,139,209,37,114,248,246,100,134,104,152,22,212,164,92,204,93,101,182,146,108,112,72,80,253,237,185,218,94,21,70,87,167,141,157,132,144,216,171,0,140,188,211,10,247,228,88,5,184,179,69,6,208,44,30,143,202,63,15,2,193,175,189,3,1,19,138,107,58,145,17,65,79,103,220,234,151,242,207,206,240,180,230,115,150,172,116,34,231,173,53,133,226,249,55,232,28,117,223,110,71,241,26,113,29,41,197,137,111,183,98,14,170,24,190,27,252,86,62,75,198,210,121,32,154,219,192,254,120,205,90,244,31,221,168,51,136,7,199,49,177,18,16,89,39,128,236,95,96,81,127,169,25,181,74,13,45,229,122,159,147,201,156,239,160,224,59,77,174,42,245,176,200,235,187,60,131,83,153,97,23,43,4,126,186,119,214,38,225,105,20,99,85,33,12,125);this.ShiftRowTab=new Array(0,5,10,15,4,9,14,3,8,13,2,7,12,1,6,11)};pidCrypt.AES.prototype.init=function(){this.env.setParams({blockSize:this.blockSize});this.ShiftRowTabInv=new Array(16);for(var a=0;a<16;a++){this.ShiftRowTabInv[this.ShiftRowTab[a]]=a}this.xtime=new Array(256);for(a=0;a<128;a++){this.xtime[a]=a<<1;this.xtime[128+a]=(a<<1)^27}};pidCrypt.AES.prototype.expandKey=function(b){var e=b.slice();var f=e.length,h,g=1;switch(f){case 16:h=16*(10+1);break;case 24:h=16*(12+1);break;case 32:h=16*(14+1);break;default:alert("AESCore.expandKey: Only key lengths of 16, 24 or 32 bytes allowed!")}for(var d=f;d<h;d+=4){var a=e.slice(d-4,d);if(d%f==0){a=new Array(this.SBox[a[1]]^g,this.SBox[a[2]],this.SBox[a[3]],this.SBox[a[0]]);if((g<<=1)>=256){g^=283}}else{if((f>24)&&(d%f==16)){a=new Array(this.SBox[a[0]],this.SBox[a[1]],this.SBox[a[2]],this.SBox[a[3]])}}for(var c=0;c<4;c++){e[d+c]=e[d+c-f]^a[c]}}return e};pidCrypt.AES.prototype.encrypt=function(b,d){var a=d.length;var e=b.slice();this.addRoundKey(e,d.slice(0,16));for(var c=16;c<a-16;c+=16){this.subBytes(e);this.shiftRows(e);this.mixColumns(e);this.addRoundKey(e,d.slice(c,c+16))}this.subBytes(e);this.shiftRows(e);this.addRoundKey(e,d.slice(c,a));return e};pidCrypt.AES.prototype.decrypt=function(b,d){var a=d.length;var e=b.slice();this.addRoundKey(e,d.slice(a-16,a));this.shiftRows(e,1);this.subBytes(e,1);for(var c=a-32;c>=16;c-=16){this.addRoundKey(e,d.slice(c,c+16));this.mixColumns_Inv(e);this.shiftRows(e,1);this.subBytes(e,1)}this.addRoundKey(e,d.slice(0,16));return e};pidCrypt.AES.prototype.subBytes=function(d,a){var c=(typeof(a)=="undefined")?this.SBox.slice():this.SBoxInv.slice();for(var b=0;b<16;b++){d[b]=c[d[b]]}};pidCrypt.AES.prototype.addRoundKey=function(c,a){for(var b=0;b<16;b++){c[b]^=a[b]}};pidCrypt.AES.prototype.shiftRows=function(d,a){var e=(typeof(a)=="undefined")?this.ShiftRowTab.slice():this.ShiftRowTabInv.slice();var c=new Array().concat(d);for(var b=0;b<16;b++){d[b]=c[e[b]]}};pidCrypt.AES.prototype.mixColumns=function(g){for(var d=0;d<16;d+=4){var f=g[d+0],c=g[d+1];var b=g[d+2],a=g[d+3];var e=f^c^b^a;g[d+0]^=e^this.xtime[f^c];g[d+1]^=e^this.xtime[c^b];g[d+2]^=e^this.xtime[b^a];g[d+3]^=e^this.xtime[a^f]}};pidCrypt.AES.prototype.mixColumns_Inv=function(a){for(var b=0;b<16;b+=4){var l=a[b+0],k=a[b+1];var j=a[b+2],g=a[b+3];var c=l^k^j^g;var f=this.xtime[c];var e=this.xtime[this.xtime[f^l^j]]^c;var d=this.xtime[this.xtime[f^k^g]]^c;a[b+0]^=e^this.xtime[l^k];a[b+1]^=d^this.xtime[k^j];a[b+2]^=e^this.xtime[j^g];a[b+3]^=d^this.xtime[g^l]}};pidCrypt.AES.prototype.xOr_Array=function(b,a){var d;var c=Array();for(d=0;d<b.length;d++){c[d]=b[d]^a[d]}return c};pidCrypt.AES.prototype.getCounterBlock=function(){var b=new Array(this.blockSize);var e=(new Date()).getTime();var d=Math.floor(e/1000);var a=e%1000;for(var c=0;c<4;c++){b[c]=(d>>>c*8)&255}for(var c=0;c<4;c++){b[c+4]=a&255}return b.slice()}};