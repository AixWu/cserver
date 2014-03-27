var defined_classes=new Array();
var defined_tests=new Array();
function create_test(obj) {
 defined_tests.push(obj);
}
var _prototype_id_gen=1;
function test_inherit_multiple() {
 function z() {
 }
 create_prototype(z);
 a = Array;
 a.prototype.test = function() {
  console.log("a", this.constructor.name);
 }
 function b() {
 }
 inherit_multiple(b, [a]);
 b.prototype.test = function() {
  console.log("b", this.constructor.name);
 }
 function c() {
 }
 inherit_multiple(c, [a]);
 c.prototype.test = function() {
  console.log("c", this.constructor.name);
 }
 function d() {
 }
 inherit_multiple(d, [b, c]);
 d.prototype.test1 = function() {
  console.log("d", this.constructor.name);
 }
 console.log("------------");
 var iof=__instance_of;
 var A=new a(), B=new b(), C=new c(), D=new d();
 console.log(iof(D, a), iof(D, b), iof(D, c), iof(D, z));
 new d().test();
 return [d, b, c, a];
}
function init_native_type(obj) {
 obj.__subclass_map__ = {}
 obj.__prototypeid__ = _prototype_id_gen++;
 obj.__subclass_map__[obj.__prototypeid__] = obj;
 obj.__clsorder__ = [];
 obj.__parents__ = [];
 obj.__statics__ = {}
 obj.prototype.__class__ = obj.name;
 obj.prototype.__prototypeid__ = obj.__prototypeid__;
}
init_native_type(Function);
init_native_type(Array);
init_native_type(Number);
init_native_type(String);
init_native_type(Boolean);
init_native_type(Error);
function inherit_multiple(obj, parents) {
 defined_classes.push(obj);
 parents.reverse();
 function merge(ps, lsts) {
  var lst=[];
  lsts.push(ps);
  for (var u=0; u<2000; u++) {
    if (lsts.length==0)
     break;
    for (var i=0; i<lsts.length; i++) {
      if (lsts[i].length==0)
       continue;
      var p=lsts[i][0];
      var bad=false;
      if (0) {
        for (var j=0; j<lst.length; j++) {
          if (lst[j].__prototypeid__==p.__prototypeid__) {
            bad = true;
            break;
          }
        }
      }
      for (var j=0; !bad&&j<lsts.length; j++) {
        if (i==j)
         continue;
        var l=lsts[j];
        for (var k=1; k<l.length; k++) {
          if (l[k].__prototypeid__==p.__prototypeid__) {
            bad = true;
            break;
          }
        }
      }
      if (!bad) {
        lst.push(p);
        lsts[i].splice(lsts[i].indexOf(p), 1);
        for (var j=0; j<lsts.length; j++) {
          var l=lsts[j];
          for (var k=0; k<l.length; k++) {
            if (l[k].__prototypeid__==p.__prototypeid__) {
              l.splice(l[k], 1);
              break;
            }
          }
        }
        if (lsts[i].length>0) {
          i-=1;
        }
        else {
         lsts[i].splice(i, 1);
         i-=1;
        }
      }
    }
  }
  var tot=0;
  for (var i=0; i<lsts.length; i++) {
    tot+=lsts[i].length;
  }
  if (tot>0) {
    throw new Error("Could not resolve multiple inheritance");
  }
  return lst;
 }
 if (parents.length==1) {
   var cs=[];
   var p=parents[0];
   if ("__clsorder__" in p) {
     var pcs=p.__clsorder__;
     for (var i=0; i<pcs.length; i++) {
       cs.push(pcs[i]);
     }
   }
   cs.push(p);
   obj.__clsorder__ = cs;
 }
 else {
  var lsts=[];
  for (var i=0; i<parents.length; i++) {
    lsts.push(parents[i].__clsorder__);
  }
  obj.__clsorder__ = merge(parents, lsts);
 }
 function _get_obj_keys(ob) {
  var ks=Object.getOwnPropertyNames(ob);
  if (ob.toString!=undefined)
   ks.push("toString");
  return ks;
 }
 var cs=obj.__clsorder__;
 var cs2=[];
 for (var i=0; i<cs.length; i++) {
   cs2.push(Object.create(Object.prototype));
   var p=cs[i];
   var keys=_get_obj_keys(p.prototype);
   for (var j=0; j<keys.length; j++) {
     var val=p.prototype[keys[j]];
     var bad=false;
     for (var k=0; !bad&&k<i; k++) {
       if (k==i)
        continue;
       var p2=cs[k];
       if (p2.__prototypeid__==p.__prototypeid__)
        continue;
       var keys2=_get_obj_keys(p2.prototype);
       for (var l=0; !bad&&l<keys2.length; l++) {
         if (p2.prototype[keys2[l]]==val) {
           bad = true;
           break;
         }
       }
     }
     if (!bad)
      cs2[i][keys[j]] = val;
   }
 }
 var exclude=["__prototypeid__", "__class__", "priors", "prototype", "constructor"];
 var eset={}
 for (var i=0; i<exclude.length; i++) {
   eset[exclude[i]] = exclude[i];
 }
 exclude = eset;
 delete exclude["toString"];
 function excluded(k) {
  return exclude.hasOwnProperty(k)&&k!="toString";
 }
 proto = Object.create(Object.prototype);
 delete proto.toString;
 for (var i=0; i<cs2.length; i++) {
   cs2[i].__prototypeid__ = cs[i].__prototypeid__;
   cs2[i].constructor = cs[i];
   cs2[i].__class__ = cs[i].name;
   var p=cs2[i];
   var keys=_get_obj_keys(p);
   for (var j=0; j<keys.length; j++) {
     if (excluded(keys[j]))
      continue;
     if (p[keys[j]]==Object.prototype.toString)
      continue;
     proto[keys[j]] = p[keys[j]];
   }
   if (i>0) {
     var keys2=_get_obj_keys(cs2[i-1]);
     for (var j=0; j<keys2.length; j++) {
       if (excluded(keys2[j]))
        continue;
       if (cs2[i][keys2[j]]!=undefined)
        continue;
       cs2[i][keys2[j]] = cs2[i-1][keys2[j]];
     }
     cs2[i].prototype==cs2[i-1];
   }
 }
 if (cs2.length>0)
  proto.prototype = cs2[cs2.length-1];
 proto.priors = obj.__clsorder__;
 proto.constructor = obj;
 proto.__prototypeid__ = _prototype_id_gen++;
 proto.__class__ = obj.name;
 obj.prototype = proto;
 obj.__prototypeid__ = proto.__prototypeid__;
 obj.__parents__ = parents;
 obj.__subclass_map__ = {}
 obj.__subclass_map__[obj.__prototypeid__] = obj;
 var name=obj.name;
 obj.__hash__ = function() {
  return name;
 }
 for (var i=0; i<cs2.length; i++) {
   if (!("__subclass_map__" in cs[i])) {
     if (!("__prototypeid__" in cs[i])) {
       cs[i].__prototypeid__ = _prototype_id_gen++;
       cs[i].prototype.__prototypeid__ = cs[i].__prototypeid__;
     }
     cs[i].__subclass_map__ = {}
     cs[i].__subclass_map__[cs[i].__prototypeid__] = cs[i];
   }
   cs[i].__subclass_map__[obj.__prototypeid__] = obj;
 }
 obj.__statics__ = {}
 for (var i=0; i<cs.length; i++) {
   if (!("__statics__" in cs[i]))
    continue;
   var keys=_get_obj_keys(cs[i].__statics__);
   for (var j=0; j<keys.length; j++) {
     var k=keys[j];
     if (k=="__proto__"||excluded(k))
      continue;
     obj.__statics__[k] = k;
     obj[k] = cs[i][k];
   }
 }
}
function __instance_of(child, parent) {
 if (parent==undefined)
  return child==undefined;
 if (typeof child!="object")
  return typeof child==typeof (parent);
 if ("__subclass_map__" in parent&&"__prototypeid__" in child) {
   return child.__prototypeid__ in parent.__subclass_map__;
 }
 else {
  return child instanceof parent;
 }
}
var instance_of=__instance_of;
function inherit(obj, parent) {
 inherit_multiple(obj, [parent]);
}
function inherit_old(obj, parent) {
 defined_classes.push(obj);
 obj.prototype = Object.create(parent.prototype);
 obj.prototype.prior = parent.prototype;
 obj.prototype.constructor = obj;
 obj.prototype.__prototypeid__ = _prototype_id_gen++;
 obj.prototype.__class__ = obj.name;
 obj.prototype.prototype = obj.prototype;
 var slist;
 if (parent.__statics__!=undefined) {
   slist = new Array(parent.__statics__.length);
   for (var i=0; i<slist.length; i++) {
     slist[i] = parent.__statics__[i];
   }
 }
 else {
  slist = [];
 }
 obj.__statics__ = slist;
 for (var i=0; i<slist.length; i++) {
   var st=slist[i];
   obj[st] = parent[st];
 }
}
function create_prototype(obj) {
 defined_classes.push(obj);
 obj.prototype.constructor = obj;
 obj.prototype.__prototypeid__ = _prototype_id_gen++;
 obj.prototype.__class__ = obj.name;
 obj.__prototypeid__ = obj.prototype.__prototypeid__;
 obj.__statics__ = [];
 obj.__clsorder__ = [];
 obj.__parents__ = [];
 obj.__subclass_map__ = {}
 obj.__subclass_map__[obj.__prototypeid__] = obj;
 var name=obj.name;
 obj.__hash__ = function() {
  return name;
 }
}
function define_static(obj, name, val) {
 obj[name] = val;
 obj.__statics__[name] = name;
}
function prior(thisproto, obj) {
 var proto=obj.constructor.prototype;
 while (proto.__prototypeid__!=thisproto.__prototypeid__) {
  proto = proto.prototype;
 }
 return proto.prototype;
}
function arr_iter(keys) {
 this.keys = keys;
 this.cur = 0;
 this.__iterator__ = function() {
  return this;
 }
 this.next = function() {
  if (this.cur>=this.keys.length) {
    return {value: undefined, done: true}
  }
  return {value: this.keys[this.cur++], done: false}
 }
}
function __get_iter(obj) {
 if (obj==undefined) {
   console.trace();
   print_stack();
   throw new Error("Invalid iteration over undefined value");
 }
 if ("__iterator__" in obj) {
   return obj.__iterator__();
 }
 else {
  var keys=[];
  for (var k in obj) {
    keys.push(k);
  }
  return new arr_iter(keys);
 }
}
var arr_iter=function(keys) {
 this.ret = {done: false, value: undefined}
 this.keys = keys;
 this.cur = 0;
 this.__iterator__ = function() {
  return this;
 }
 this.next = function() {
  if (this.cur>=this.keys.length) {
    this.ret.done = true;
    return this.ret;
  }
  this.ret.value = this.keys[this.cur++];
  return this.ret;
 }
}
function _KeyValIterator(obj) {
 this.ret = {done: false, value: [undefined, undefined]}
 this.i = 0;
 this.obj = obj;
 this.keys = Object.keys(obj);
}
create_prototype(_KeyValIterator);
_KeyValIterator.prototype.__iterator__ = function() {
 return this;
}
_KeyValIterator.prototype.next = function() {
 if (this.i>=this.keys.length) {
   this.ret.done = true;
   this.ret.value = undefined;
   return this.ret;
 }
 var k=this.keys[this.i];
 var v=this.obj[k];
 this.ret.value[0] = k;
 this.ret.value[1] = v;
 this.i++;
 return this.ret;
}
var Iterator=function(obj) {
 if ("__iterator__" in obj) {
   return obj.__iterator__();
 }
 else {
  return new _KeyValIterator(obj);
 }
}
function define_docstring(func, docstr) {
 func.__doc__ = docstr;
 return func;
}

"use strict";
function Iter() {
}
create_prototype(Iter);
Iter.prototype.reset = function() {
}
Iter.prototype.next = function() {
}
function CanIter() {
}
create_prototype(CanIter);
CanIter.prototype.__iterator__ = function() {
}
var debug_int_1=0;
function GArray(input) {
 Array.call(this);
 if (input!=undefined) {
   for (var i=0; i<input.length; i++) {
     this.push(input[i]);
   }
 }
}
inherit_multiple(GArray, [Array]);
GArray.prototype.pack = function(data) {
 pack_int(data, this.length);
 for (var i=0; i<this.length; i++) {
   this[i].pack(data);
 }
}
GArray.prototype.has = function(item) {
 return this.indexOf(item)>=0;
}
GArray.prototype.__iterator__ = function() {
 return new GArrayIter(this);
}
GArray.prototype.toJSON = function() {
 var arr=new Array(this.length);
 var i=0;
 for (var i=0; i<this.length; i++) {
   arr[i] = this[i];
 }
 return arr;
}
GArray.prototype.insert = function(index, item) {
 for (var i=this.length; i>index; i--) {
   this[i] = this[i-1];
 }
 this[index] = item;
 this.length++;
}
GArray.prototype.prepend = function(item) {
 this.insert(0, item);
}
GArray.prototype.remove = function(item, ignore_existence) {
 var idx=this.indexOf(item);
 if (ignore_existence==undefined)
  ignore_existence = false;
 if (idx<0||idx==undefined) {
   console.log("Yeek! Item "+item+" not in array");
   console.trace();
   if (!ignore_existence) {
     console.trace();
     throw "Yeek! Item "+item+" not in array";
   }
   return ;
 }
 for (var i=idx; i<this.length-1; i++) {
   this[i] = this[i+1];
 }
 this.length-=1;
}
GArray.prototype.replace = function(olditem, newitem) {
 var idx=this.indexOf(olditem);
 if (idx<0||idx==undefined) {
   console.log("Yeek! Item "+olditem+" not in array");
   console.trace();
   if (!ignore_existence)
    throw "Yeek! Item "+olditem+" not in array";
   return ;
 }
 this[idx] = newitem;
}
GArray.prototype.toSource = function() {
 var s="new GArray"+this.length+"([";
 for (var i=0; i<this.length; i++) {
   s+=this[i];
   if (i!=this.length-1)
    s+=", ";
 }
 s+="])";
 return s;
}
GArray.prototype.toString = function() {
 var s="[GArray: ";
 for (var i=0; i<this.length; i++) {
   s+=this[i];
   if (i!=this.length-1)
    s+=", ";
 }
 s+="])";
 return s;
}
var defined_classes=new GArray(defined_classes);
function obj_value_iter(obj) {
 this.ret = {done: false, value: undefined}
 this.obj = obj;
 this.iter = Iterator(obj);
 this.next = function() {
  var reti=this.ret;
  var ret=this.iter.next();
  if (ret.done)
   return ret;
  reti.value = ret.value[1];
  return reti;
 }
 this.__iterator__ = function() {
  return this;
 }
}
function list(iter) {
 var lst=new GArray();
 var i=0;
 var __iter_item=__get_iter(iter);
 var item;
 while (1) {
  var __ival_item=__iter_item.next();
  if (__ival_item.done) {
    break;
  }
  item = __ival_item.value;
  lst.push(item);
  i++;
 }
 lst.length = i;
 return lst;
}
var g_list=list;
function eid_list(iter) {
 GArray.call(this);
 var __iter_item=__get_iter(iter);
 var item;
 while (1) {
  var __ival_item=__iter_item.next();
  if (__ival_item.done) {
    break;
  }
  item = __ival_item.value;
  this.push([item.type, item.eid]);
 }
 return lst;
}
inherit_multiple(eid_list, [GArray]);
Number.prototype.__hash__ = function() {
 return this;
}
String.prototype.__hash__ = function() {
 return this;
}
Array.prototype.__hash__ = function() {
 var s="";
 for (var i=0; i<this.length; i++) {
   s+=this[i].__hash__()+"|";
 }
 return s;
}
function SafeSetIter(set1) {
 this.ret = {done: false, value: undefined}
 this.set = set1;
 this.iter = new SetIter(set1);
 this.nextitem = undefined;
}
create_prototype(SafeSetIter);
SafeSetIter.prototype.__iterator__ = function() {
 return this;
}
SafeSetIter.prototype.next = function() {
 throw new Error("Fix this before using");
 var reti=this.ret;
 var iter=this.iter;
 if (this.nextitem==undefined) {
   this.nextitem = iter.next();
 }
 var ret=this.nextitem;
 this.nextitem = iter.next();
 return ret;
}
function SetIter(set1) {
 this.ret = {done: false, value: undefined}
 this.set = set1;
 this.iter = Iterator(set1.items);
}
create_prototype(SetIter);
SetIter.prototype.next = function() {
 var reti=this.ret;
 var iter=this.iter;
 var items=this.set.items;
 var item=iter.next();
 if (item.done)
  return item;
 while (!items.hasOwnProperty(item.value[0])) {
  item = iter.next();
  if (item.done)
   return item;
 }
 reti.value = item.value[1];
 return reti;
}
function set(input) {
 this.items = {}
 this.length = 0;
 if (input!=undefined) {
   if (__instance_of(input, Array)||__instance_of(input, String)) {
     for (var i=0; i<input.length; i++) {
       this.add(input[i]);
     }
   }
   else {
    var __iter_item=__get_iter(input);
    var item;
    while (1) {
     var __ival_item=__iter_item.next();
     if (__ival_item.done) {
       break;
     }
     item = __ival_item.value;
     this.add(item);
    }
   }
 }
}
create_prototype(set);
set.prototype.pack = function(data) {
 pack_int(data, this.length);
 var __iter_item=__get_iter(this);
 var item;
 while (1) {
  var __ival_item=__iter_item.next();
  if (__ival_item.done) {
    break;
  }
  item = __ival_item.value;
  item.pack(data);
 }
}
set.prototype.toJSON = function() {
 var arr=new Array(this.length);
 var i=0;
 var __iter_item=__get_iter(this.items);
 var item;
 while (1) {
  var __ival_item=__iter_item.next();
  if (__ival_item.done) {
    break;
  }
  item = __ival_item.value;
  arr[i] = this.items[item];
  i+=1;
 }
 return arr;
}
set.prototype.toSource = function() {
 return "new set("+list(this).toSource()+")";
}
set.prototype.toString = function() {
 return "new set("+list(this).toString()+")";
}
set.prototype.add = function(item) {
 if (!(item.__hash__() in this.items)) {
   this.length+=1;
   this.items[item.__hash__()] = item;
 }
}
set.prototype.remove = function(item) {
 delete this.items[item.__hash__()];
 this.length-=1;
}
set.prototype.safe_iter = function() {
 return new SafeSetIter(this);
}
set.prototype.__iterator__ = function() {
 return new SetIter(this);
}
set.prototype.union = function(b) {
 var newset=new set(this);
 var __iter_item=__get_iter(b);
 var item;
 while (1) {
  var __ival_item=__iter_item.next();
  if (__ival_item.done) {
    break;
  }
  item = __ival_item.value;
  newset.add(item);
 }
 return newset;
}
set.prototype.has = function(item) {
 if (item==undefined) {
   console.trace();
 }
 return this.items.hasOwnProperty(item.__hash__());
}
function GArrayIter(arr) {
 this.ret = {done: false, value: undefined}
 this.arr = arr;
 this.cur = 0;
}
create_prototype(GArrayIter);
GArrayIter.prototype.next = function() {
 var reti=this.ret;
 if (this.cur>=this.arr.length) {
   this.cur = 0;
   this.ret = {done: false, value: undefined}
   reti.done = true;
   return reti;
 }
 else {
  reti.value = this.arr[this.cur++];
  return reti;
 }
}
GArrayIter.prototype.reset = function() {
 this.ret = {done: false, value: undefined}
 this.cur = 0;
}
function HashKeyIter(hash) {
 this.ret = {done: false, value: undefined}
 this.hash = hash;
 this.iter = Iterator(hash.items);
}
create_prototype(HashKeyIter);
HashKeyIter.prototype.next = function() {
 var reti=this.ret;
 var iter=this.iter;
 var items=this.hash.items;
 var item=iter.next();
 if (item.done)
  return item;
 while (!items.hasOwnProperty(item.value[0])) {
  if (item.done)
   return item;
  item = iter.next();
 }
 reti.value = this.hash.keymap[item.value[0]];
 return reti;
}
function hashtable() {
 this.items = {}
 this.keymap = {}
 this.length = 0;
}
create_prototype(hashtable);
hashtable.prototype.add = function(key, item) {
 if (!this.items.hasOwnProperty(key.__hash__()))
  this.length++;
 this.items[key.__hash__()] = item;
 this.keymap[key.__hash__()] = key;
}
hashtable.prototype.remove = function(key) {
 delete this.items[key.__hash__()];
 delete this.keymap[key.__hash__()];
 this.length-=1;
}
hashtable.prototype.__iterator__ = function() {
 return new HashKeyIter(this);
}
hashtable.prototype.values = function() {
 var ret=new GArray();
 var __iter_k=__get_iter(this);
 var k;
 while (1) {
  var __ival_k=__iter_k.next();
  if (__ival_k.done) {
    break;
  }
  k = __ival_k.value;
  ret.push(this.items[k]);
 }
 return ret;
}
hashtable.prototype.keys = function() {
 return list(this);
}
hashtable.prototype.get = function(key) {
 return this.items[key.__hash__()];
}
hashtable.prototype.set = function(key, item) {
 if (!this.has(key)) {
   this.length++;
 }
 this.items[key.__hash__()] = item;
 this.keymap[key.__hash__()] = key;
}
hashtable.prototype.union = function(b) {
 var newhash=new hashtable(this);
 var __iter_item=__get_iter(b);
 var item;
 while (1) {
  var __ival_item=__iter_item.next();
  if (__ival_item.done) {
    break;
  }
  item = __ival_item.value;
  newhash.add(item, b.get[item]);
 }
 return newhash;
}
hashtable.prototype.has = function(item) {
 if (item==undefined)
  console.trace();
 return this.items.hasOwnProperty(item.__hash__());
}
function validate_mesh_intern(m) {
 var eidmap={}
 var __iter_f=__get_iter(m.faces);
 var f;
 while (1) {
  var __ival_f=__iter_f.next();
  if (__ival_f.done) {
    break;
  }
  f = __ival_f.value;
  var lset=new set();
  var eset=new set();
  var vset=new set();
  var __iter_v=__get_iter(f.verts);
  var v;
  while (1) {
   var __ival_v=__iter_v.next();
   if (__ival_v.done) {
     break;
   }
   v = __ival_v.value;
   if (vset.has(v)) {
     console.trace();
     console.log("Warning: found same vert multiple times in a face");
   }
   vset.add(v);
  }
  var __iter_e=__get_iter(f.edges);
  var e;
  while (1) {
   var __ival_e=__iter_e.next();
   if (__ival_e.done) {
     break;
   }
   e = __ival_e.value;
   if (eset.has(e)) {
     console.trace();
     console.log("Warning: found same edge multiple times in a face");
   }
   eset.add(e);
  }
  var __iter_loops=__get_iter(f.looplists);
  var loops;
  while (1) {
   var __ival_loops=__iter_loops.next();
   if (__ival_loops.done) {
     break;
   }
   loops = __ival_loops.value;
   var __iter_l=__get_iter(loops);
   var l;
   while (1) {
    var __ival_l=__iter_l.next();
    if (__ival_l.done) {
      break;
    }
    l = __ival_l.value;
    if (lset.has(l)) {
      console.trace();
      return false;
    }
    lset.add(l);
   }
  }
 }
 var __iter_v=__get_iter(m.verts);
 var v;
 while (1) {
  var __ival_v=__iter_v.next();
  if (__ival_v.done) {
    break;
  }
  v = __ival_v.value;
  if (v._gindex==-1) {
    console.trace();
    return false;
  }
  if (v.loop!=null&&v.loop.f._gindex==-1) {
    console.trace();
    return false;
  }
  var __iter_e=__get_iter(v.edges);
  var e;
  while (1) {
   var __ival_e=__iter_e.next();
   if (__ival_e.done) {
     break;
   }
   e = __ival_e.value;
   if (e._gindex==-1) {
     console.trace();
     return false;
   }
   if (!e.vert_in_edge(v)) {
     console.trace();
     return false;
   }
  }
 }
 var __iter_e=__get_iter(m.edges);
 var e;
 while (1) {
  var __ival_e=__iter_e.next();
  if (__ival_e.done) {
    break;
  }
  e = __ival_e.value;
  if (e._gindex==-1) {
    console.trace();
    return false;
  }
  var i=0;
  var lset=new set();
  var fset=new set();
  if (e.loop==null)
   continue;
  var l=e.loop;
  do {
   if (lset.has(l)) {
     console.trace();
     return false;
   }
   lset.add(l);
   if (fset.has(l.f)) {
     console.trace();
     console.log("Warning: found the same face multiple times in an edge's radial list");
   }
   fset.add(l.f);
   i++;
   if (i==10000) {
     console.trace();
     return false;
   }
   if (l.f._gindex==-1) {
     console.trace();
     console.log("error with edge "+e.eid);
     return false;
   }
   l = l.radial_next;
  } while (l!=e.loop);
  
 }
 var __iter_v=__get_iter(m.verts);
 var v;
 while (1) {
  var __ival_v=__iter_v.next();
  if (__ival_v.done) {
    break;
  }
  v = __ival_v.value;
  eidmap[v.eid] = v;
 }
 var __iter_e=__get_iter(m.edges);
 var e;
 while (1) {
  var __ival_e=__iter_e.next();
  if (__ival_e.done) {
    break;
  }
  e = __ival_e.value;
  eidmap[e.eid] = v;
 }
 var __iter_f=__get_iter(m.faces);
 var f;
 while (1) {
  var __ival_f=__iter_f.next();
  if (__ival_f.done) {
    break;
  }
  f = __ival_f.value;
  eidmap[f.eid] = v;
 }
 var __iter_k=__get_iter(m.eidmap);
 var k;
 while (1) {
  var __ival_k=__iter_k.next();
  if (__ival_k.done) {
    break;
  }
  k = __ival_k.value;
  if (!(k in eidmap)) {
    console.trace();
    return true;
  }
 }
 var __iter_k=__get_iter(eidmap);
 var k;
 while (1) {
  var __ival_k=__iter_k.next();
  if (__ival_k.done) {
    break;
  }
  k = __ival_k.value;
  if (!(k in m.eidmap)) {
    console.trace();
    return true;
  }
 }
 return true;
}
function validate_mesh(m) {
 if (!validate_mesh_intern(m)) {
   console.log("Mesh validation error.");
   throw "Mesh validation error.";
 }
}
function concat_array(a1, a2) {
 var ret=new GArray();
 for (var i=0; i<a1.length; i++) {
   ret.push(a1[i]);
 }
 for (var i=0; i<a2.length; i++) {
   ret.push(a2[i]);
 }
 return ret;
}
function get_callstack(err) {
 var callstack=[];
 var isCallstackPopulated=false;
 var err_was_undefined=err==undefined;
 if (err==undefined) {
   try {
    _idontexist.idontexist+=0;
   }
   catch (err1) {
     err = err1;
   }
 }
 if (err!=undefined) {
   if (err.stack) {
     var lines=err.stack.split('\n');
     var len=lines.length;
     for (var i=0; i<len; i++) {
       if (1) {
         lines[i] = lines[i].replace(/@http\:\/\/.*\//, "|");
         var l=lines[i].split("|");
         lines[i] = l[1]+": "+l[0];
         lines[i] = lines[i].trim();
         callstack.push(lines[i]);
       }
     }
     if (err_was_undefined) {
     }
     isCallstackPopulated = true;
   }
   else 
    if (window.opera&&e.message) {
     var lines=err.message.split('\n');
     var len=lines.length;
     for (var i=0; i<len; i++) {
       if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
         var entry=lines[i];
         if (lines[i+1]) {
           entry+=' at '+lines[i+1];
           i++;
         }
         callstack.push(entry);
       }
     }
     if (err_was_undefined) {
       callstack.shift();
     }
     isCallstackPopulated = true;
   }
 }
 var limit=24;
 if (!isCallstackPopulated) {
   var currentFunction=arguments.callee.caller;
   var i=0;
   while (currentFunction&&i<24) {
    var fn=currentFunction.toString();
    var fname=fn.substring(fn.indexOf("function")+8, fn.indexOf(''))||'anonymous';
    callstack.push(fname);
    currentFunction = currentFunction.caller;
    i++;
   }
 }
 return callstack;
}
function print_stack(err) {
 try {
  var cs=get_callstack(err);
 }
 catch (err2) {
   console.log("Could not fetch call stack.");
   return ;
 }
 console.log("Callstack:");
 for (var i=0; i<cs.length; i++) {
   console.log(cs[i]);
 }
}
function time_ms() {
 if (window.performance)
  return window.performance.now();
 else 
  return new Date().getMilliseconds();
}
function movavg(length) {
 this.len = length;
 this.value = 0;
 this.arr = [];
}
create_prototype(movavg);
movavg.prototype._recalc = function() {
 if (this.arr.length==0)
  return ;
 var avg=0.0;
 for (var i=0; i<this.arr.length; i++) {
   avg+=this.arr[i];
 }
 avg/=this.arr.length;
 this.value = avg;
}
movavg.prototype.update = function(val) {
 if (this.arr.length<this.len) {
   this.arr.push(val);
 }
 else {
  this.arr.shift();
  this.arr.push(val);
 }
 this._recalc();
 return this.value;
}
movavg.prototype.valueOf = function() {
 return this.value;
}
function Timer(interval_ms) {
 this.ival = interval_ms;
 this.normval = 0.0;
 this.last_ms = time_ms();
}
create_prototype(Timer);
Timer.prototype.ready = function() {
 this.normval = (time_ms()-this.last_ms)/this.ival;
 if (time_ms()-this.last_ms>this.ival) {
   this.last_ms = time_ms();
   return true;
 }
 return false;
}
function other_tri_vert(e, f) {
 var __iter_v=__get_iter(f.verts);
 var v;
 while (1) {
  var __ival_v=__iter_v.next();
  if (__ival_v.done) {
    break;
  }
  v = __ival_v.value;
  if (v!=e.v1&&v!=e.v2)
   return v;
 }
 return null;
}
var _sran_tab=[0.42858355099189227, 0.5574386030715371, 0.9436109711290556, 0.11901816474442506, 0.05494319267999703, 0.4089598843412747, 0.9617377622975879, 0.6144736752713642, 0.4779527665160106, 0.5358937375859902, 0.6392009453796094, 0.24893232630444684, 0.33278166078571036, 0.23623349009987882, 0.6007015401310062, 0.3705022651967115, 0.0225052050200355, 0.35908220770197297, 0.6762962413645864, 0.7286584766550781, 0.19885076794257972, 0.6066651236611478, 0.23594878250486895, 0.9559806203614414, 0.37878311003873877, 0.14489505173573436, 0.6853451367228348, 0.778201767931336, 0.9629591508405009, 0.10159174495809686, 0.9956652458055149, 0.27241630290235785, 0.4657146086929548, 0.7459995799823305, 0.30955785437169314, 0.7594519036966647, 0.9003876360971134, 0.14415784566467216, 0.13837285006138467, 0.5708662986155526, 0.04911823375362412, 0.5182157396751097, 0.24535476698939818, 0.4755762294863617, 0.6241760808125321, 0.05480018253112229, 0.8345698022607818, 0.26287656274013016, 0.1025239144443526];
function StupidRandom(seed) {
 if (seed==undefined)
  seed = 0;
 this._seed = seed+1;
 this.i = 1;
}
create_prototype(StupidRandom);
StupidRandom.prototype.seed = function(seed) {
 this._seed = seed+1;
 this.i = 1;
}
StupidRandom.prototype.random = function() {
 
 var tab=_sran_tab;
 var i=this.i;
 if (i<0)
  i = Math.abs(i)-1;
 i = Math.max(i, 1);
 var i1=Math.max(i, 0)+this._seed;
 var i2=Math.ceil(i/4+this._seed);
 var r1=Math.sqrt(tab[i1%tab.length]*tab[i2%tab.length]);
 this.i++;
 return r1;
}
var seedrand=new StupidRandom();
function get_nor_zmatrix(no) {
 var axis=new Vector3();
 var cross=new Vector3();
 axis.zero();
 axis[2] = 1.0;
 cross.load(no);
 cross.cross(axis);
 cross.normalize();
 var sign=axis.dot(no)>0.0 ? 1.0 : -1.0;
 var a=Math.acos(Math.abs(no.dot(axis)));
 var q=new Quat();
 q.axisAngleToQuat(cross, sign*a);
 var mat=q.toMatrix();
 return mat;
}
var _o_basic_types={"String": 0, "Number": 0, "Array": 0, "Function": 0}
function is_obj_lit(obj) {
 if (obj.constructor.name in _o_basic_types)
  return false;
 if (obj.constructor.name=="Object")
  return true;
 if (obj.prototype==undefined)
  return true;
 return false;
}
function UnitTestError(msg) {
 Error.call(this, msg);
 this.msg = msg;
}
inherit(UnitTestError, Error);
function utest(func) {
 try {
  func();
 }
 catch (err) {
   if (__instance_of(err, UnitTestError)) {
     console.log("---------------");
     console.log("Error: Unit Test Failure");
     console.log("  "+func.name+": "+err.msg);
     console.log("---------------");
     return false;
   }
   else {
    print_stack(err);
    throw err;
   }
   return false;
 }
 console.log(func.name+" succeeded.");
 return true;
}
function do_unit_tests() {
 console.log("-----Unit testing-----");
 console.log("Total number of tests: ", defined_tests.length);
 console.log(" ");
 var totok=0, toterr=0;
 console.log("Defined tests:");
 for (var i=0; i<defined_tests.length; i++) {
   var test=defined_tests[i];
   console.log("  "+test.name);
 }
 console.log(" ");
 for (var i=0; i<defined_tests.length; i++) {
   var test=defined_tests[i];
   if (!utest(test))
    toterr++;
   else 
    totok++;
 }
 console.log("OK: ", totok);
 console.log("FAILED: ", toterr);
 console.log("-------------------");
 return toterr==0;
}
function EIDGen() {
 this.cur_eid = 1;
}
create_prototype(EIDGen);
define_static(EIDGen, "fromSTRUCT", function(unpacker) {
 var g=new EIDGen();
 unpacker(g);
 return g;
});
EIDGen.prototype.set_cur = function(cur) {
 this.cur_eid = Math.ceil(cur);
}
EIDGen.prototype.max_cur = function(cur) {
 this.cur_eid = Math.max(Math.ceil(cur)+1, this.cur_eid);
}
EIDGen.prototype.get_cur = function(cur) {
 return this.cur_eid;
}
EIDGen.prototype.gen_eid = function() {
 return this.cur_eid++;
}
EIDGen.prototype.gen_id = function() {
 return this.gen_eid();
}
EIDGen.prototype.toJSON = function() {
 return {cur_eid: this.cur_eid}
}
define_static(EIDGen, "fromJSON", function(obj) {
 var idgen=new EIDGen();
 idgen.cur_eid = obj.cur_eid;
 return idgen;
});
EIDGen.STRUCT = "\n  EIDGen {\n    cur_eid : int;\n  }";
function copy_into(dst, src) {
 console.log(dst);
 var keys2=list(obj_get_keys(src));
 for (var i=0; i<keys2.length; i++) {
   var k=keys2[i];
   dst[k] = src[k];
 }
 console.log(dst);
 return dst;
}
var __v3d_g_s=[];
function get_spiral(size) {
 if (__v3d_g_s.length==size*size)
  return __v3d_g_s;
 var arr=__v3d_g_s;
 var x=Math.floor((size-1)/2);
 var y=Math.floor((size-1)/2);
 var c;
 var i;
 if (size%2==0) {
   arr.push([x, y+1]);
   arr.push([x, y]);
   arr.push([x+1, y]);
   arr.push([x+1, y+1]);
   arr.push([x+1, y+2]);
   c = 5;
   i = 2;
   y+=2;
   x+=1;
 }
 else {
  arr.push([x, y]);
  arr.push([x+1, y]);
  arr.push([x+1, y+1]);
  c = 3;
  i = 2;
  x++;
  y++;
 }
 while (c<size*size-1) {
  var sign=(Math.floor(i/2)%2)==1;
  sign = sign ? -1.0 : 1.0;
  for (var j=0; j<i; j++) {
    if ((i%2==0)) {
      if (x+sign<0||x+sign>=size)
       break;
      x+=sign;
    }
    else {
     if (y+sign<0||y+sign>=size)
      break;
     y+=sign;
    }
    if (c==size*size)
     break;
    arr.push([x, y]);
    c++;
  }
  if (c==size*size)
   break;
  i++;
 }
 for (var j=0; j<arr.length; j++) {
   arr[j][0] = Math.floor(arr[j][0]);
   arr[j][1] = Math.floor(arr[j][1]);
 }
 return __v3d_g_s;
}
var _bt_h={"String": "string", "RegExp": "regexp", "Number": "number", "Function": "function", "Array": "array", "Boolean": "boolean", "Error": "error"}
function btypeof(obj) {
 if (typeof obj=="object") {
   if (obj.constructor.name in _bt_h)
    return _bt_h[obj.constructor.name];
   else 
    return "object";
 }
 else {
  return typeof obj;
 }
}

"use strict";
function define_worker_interface(workers) {
 return function(event) {
 }
}

"use strict";
var _b64str='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var _b64_map={}
for (var i=0; i<64; i++) {
  _b64_map[_b64str[i]] = i;
}
_b64_map["="] = 65;
var _b64_arr=[0, 1, 2, 3];
function b64encode(arr, add_newlines, collimit) {
 if (add_newlines==undefined) {
   add_newlines = false;
 }
 if (collimit==undefined) {
   collimit = 76;
 }
 
 var s="";
 var is_str=btypeof(arr)=="string";
 var ci=0;
 for (var i=0; i<arr.length-2; i+=3) {
   if (arr[i]<0||arr[i]>255) {
     console.log("Invalid input ", arr[i], " at index ", i, " passed to B64Encode");
     throw new Error("Invalid input "+arr[i]+" at index "+i+" passed to B64Encode");
   }
   var a=arr[i], b=arr[i+1], c=arr[i+2];
   if (is_str) {
     a = a.charCodeAt(0);
     b = b.charCodeAt(0);
     c = c.charCodeAt(0);
   }
   var n=a|(b<<8)|(c<<16);
   var b1=n&63;
   var b2=(n>>6)&63;
   var b3=(n>>12)&63;
   var b4=(n>>18)&63;
   _b64_arr[0] = b1;
   _b64_arr[1] = b2;
   _b64_arr[2] = b3;
   _b64_arr[3] = b4;
   for (var j=0; j<4; j++) {
     if (ci>=collimit&&add_newlines) {
       ci = 0;
       s+="\n";
     }
     s+=_b64str.charAt(_b64_arr[j]);
     ci++;
   }
 }
 if ((arr.length%3)!=0) {
   i = arr.length%3;
   if (i==1) {
     var n=arr[arr.length-1];
     if (is_str)
      n = n.charCodeAt(0);
     var b1=n&63;
     var b2=(n>>6)&63;
     s+=_b64str.charAt(b1)+_b64str.charAt(b2)+"==";
   }
   else {
    var n;
    if (is_str)
     n = arr[arr.length-2].charCodeAt(0)|(arr[arr.length-1].charCodeAt(0)<<8);
    else 
     n = arr[arr.length-2]|(arr[arr.length-1]<<8);
    var b1=n&63;
    var b2=(n>>6)&63;
    var b3=(n>>12)&63;
    s+=_b64str.charAt(b1)+_b64str.charAt(b2)+_b64str.charAt(b3)+"=";
   }
 }
 return s;
}
function b64decode(s, gen_str, gen_uint8arr) {
 if (gen_str==undefined) {
   gen_str = false;
 }
 if (gen_uint8arr==undefined) {
   gen_uint8arr = true;
 }
 var s2="";
 for (var i=0; i<s.length; i++) {
   if (s[i]!="\n"&&s[i]!="\r"&&s[i]!=" "&&s[i]!="\t")
    s2+=s[i];
 }
 s = s2;
 s2 = gen_str ? "" : [];
 for (var i=0; i<s.length; i+=4) {
   var a=_b64_map[s[i]], b=_b64_map[s[i+1]], c=_b64_map[s[i+2]], d=_b64_map[s[i+3]];
   var n=a|(b<<6)|(c<<12)|(d<<18);
   if (c==65) {
     a = n&255;
     if (gen_str)
      s2+=String.fromCharCode(a);
     else 
      s2.push(a);
     continue;
   }
   else 
    if (d==65) {
     a = n&255;
     b = (n>>8)&255;
     if (gen_str) {
       s2+=String.fromCharCode(a)+String.fromCharCode(b);
     }
     else {
      s2.push(a);
      s2.push(b);
     }
     continue;
   }
   a = n&255;
   b = (n>>8)&255;
   c = (n>>16)&255;
   if (gen_str) {
     s2+=String.fromCharCode(a)+String.fromCharCode(b);
     if (d!="=")
      s2+=String.fromCharCode(c);
   }
   else {
    s2.push(a);
    s2.push(b);
    if (d!="=")
     s2.push(c);
   }
 }
 if (!gen_str&&gen_uint8arr)
  s2 = new Uint8Array(s2);
 return s2;
}
function limit_line(s, limit) {
 if (limit==undefined) {
   limit = 80;
 }
 var s2="";
 var ci=0;
 for (var i=0; i<s.length; i++) {
   if (ci>limit) {
     s2+="\n";
     ci = 0;
   }
   if (s2=="\n")
    ci = 0;
   s2+=s.charAt(i);
   ci++;
 }
 return s2;
}

"use strict";
var DEFL_NAMELEN=64;
if (typeof String.prototype.toUTF8!="function") {
  String.prototype.toUTF8 = function() {
   var input=String(this);
   var b=[], i, unicode;
   for (var i=0; i<input.length; i++) {
     unicode = input.charCodeAt(i);
     if (unicode<=0x7f) {
       b.push(unicode);
     }
     else 
      if (unicode<=0x7ff) {
       b.push((unicode>>6)|0xc0);
       b.push((unicode&0x3f)|0x80);
     }
     else 
      if (unicode<=0xffff) {
       b.push((unicode>>12)|0xe0);
       b.push(((unicode>>6)&0x3f)|0x80);
       b.push((unicode&0x3f)|0x80);
     }
     else {
      b.push((unicode>>18)|0xf0);
      b.push(((unicode>>12)&0x3f)|0x80);
      b.push(((unicode>>6)&0x3f)|0x80);
      b.push((unicode&0x3f)|0x80);
     }
   }
   return b;
  }
}
Number.prototype.pack = function(data) {
 if (Number(Math.ceil(this))==Number(this)) {
   pack_int(data, this);
 }
 else {
  pack_float(data, this);
 }
}
String.prototype.pack = function(data) {
 pack_string(data, this);
}
Array.prototype.pack = function(data) {
 pack_int(data, this.length);
 for (var i=0; i<this.length; i++) {
   this[i].pack(data);
 }
}
function get_endian() {
 var d=[1, 0, 0, 0];
 d = new Int32Array((new Uint8Array(d)).buffer)[0];
 return d==1;
}
var little_endian=get_endian();
function str_to_uint8(str) {
 var uint8=[];
 for (var i=0; i<str.length; i++) {
   uint8.push(str.charCodeAt(i));
 }
 return new Uint8Array(uint8);
}
var _pack_stack=[];
var _rec_pack=false;
function rec_pack_struct(name) {
 _pack_rec(SchmTypes.OBJECT, name);
}
function push_pack_stack() {
 _pack_stack.push([]);
}
function pop_pack_stack() {
 return _pack_stack.pop(_pack_stack.length-1);
}
function pack_record_start() {
 _rec_pack = true;
 _pack_stack = [[]];
}
function pack_record_end() {
 _rec_pack = false;
}
function _pack_rec(type, data) {
 _pack_stack[_pack_stack.length-1].push([type, data]);
}
var _static_byte=new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var _static_view=new DataView(_static_byte.buffer);
function pack_int(data, i) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.INT);
 }
 _static_view.setInt32(0, i);
 for (var j=0; j<4; j++) {
   data.push(_static_byte[j]);
 }
}
function pack_byte(data, i) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.BYTE);
 }
 data.push(i);
}
function pack_float(data, f) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.FLOAT);
 }
 _static_view.setFloat32(0, f);
 for (var j=0; j<4; j++) {
   data.push(_static_byte[j]);
 }
}
function pack_double(data, f) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.DOUBLE);
 }
 _static_view.setFloat64(0, f);
 for (var j=0; j<8; j++) {
   data.push(_static_byte[j]);
 }
}
function pack_vec2(data, vec) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.VEC2);
   push_pack_stack();
 }
 pack_float(data, vec[0]);
 pack_float(data, vec[1]);
 if (_rec_pack) {
   pop_pack_stack();
 }
}
function pack_vec3(data, vec) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.VEC3);
   push_pack_stack();
 }
 pack_float(data, vec[0]);
 pack_float(data, vec[1]);
 pack_float(data, vec[2]);
 if (_rec_pack) {
   pop_pack_stack();
 }
}
function pack_vec4(data, vec) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.VEC4);
   push_pack_stack();
 }
 pack_float(data, vec[0]);
 pack_float(data, vec[1]);
 pack_float(data, vec[2]);
 pack_float(data, vec[3]);
 if (_rec_pack) {
   pop_pack_stack();
 }
}
function pack_quat(data, vec) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.VEC4);
   push_pack_stack();
 }
 pack_float(data, vec[0]);
 pack_float(data, vec[1]);
 pack_float(data, vec[2]);
 pack_float(data, vec[3]);
 if (_rec_pack) {
   pop_pack_stack();
 }
}
function pack_mat4(data, mat) {
 var m=mat.getAsArray();
 for (var i=0; i<16; i++) {
   pack_float(data, m[i]);
 }
}
function pack_dataref(data, b) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.DATAREF);
   push_pack_stack();
 }
 if (b!=undefined) {
   pack_int(data, b.lib_id);
   if (b.lib_lib!=undefined)
    pack_int(data, b.lib_lib.id);
   else 
    pack_int(data, -1);
 }
 else {
  pack_int(data, -1);
  pack_int(data, -1);
 }
 if (_rec_pack) {
   pop_pack_stack();
 }
}
function truncate_utf8(arr, maxlen) {
 var len=Math.min(arr.length, maxlen);
 var last_codepoint=0;
 var last2=0;
 var incode=false;
 var i=0;
 var code=0;
 while (i<len) {
  incode = arr[i]&128;
  if (!incode) {
    last2 = last_codepoint+1;
    last_codepoint = i+1;
  }
  i++;
 }
 if (last_codepoint<maxlen)
  arr.length = last_codepoint;
 else 
  arr.length = last2;
 return arr;
}
var _static_sbuf_ss=new Array(32);
function pack_static_string(data, str, length) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.STATICSTRING, length);
   push_pack_stack();
 }
 if (length==undefined)
  throw new Error("'length' paremter is not optional for pack_static_string()");
 var arr=length<2048 ? _static_sbuf_ss : new Array();
 arr.length = 0;
 encode_utf8(arr, str);
 truncate_utf8(arr, length);
 for (var i=0; i<length; i++) {
   if (i>=arr.length) {
     data.push(0);
   }
   else {
    data.push(arr[i]);
   }
 }
 if (_rec_pack) {
   pop_pack_stack();
 }
}
function test_str_packers() {
 function static_string_test() {
  var arr=[];
  var teststr="12345678"+String.fromCharCode(8800);
  console.log(teststr);
  var arr2=[];
  encode_utf8(arr2, teststr);
  console.log(arr2.length);
  pack_static_string(arr, teststr, 9);
  if (arr.length!=9)
   throw new UnitTestError("Bad length "+arr.length.toString());
  arr = new DataView(new Uint8Array(arr).buffer);
  var str2=unpack_static_string(arr, new unpack_ctx(), 9);
  console.log(teststr, str2);
  console.log("'12345678'", "'"+str2+"'");
  if (str2!="12345678")
   throw new UnitTestError("Bad truncation");
 }
 static_string_test();
 return true;
}
create_test(test_str_packers);
var _static_sbuf=new Array(32);
function pack_string(data, str) {
 if (_rec_pack) {
   _pack_rec(SchmTypes.STRING);
   push_pack_stack();
 }
 _static_sbuf.length = 0;
 encode_utf8(_static_sbuf, str);
 pack_int(data, _static_sbuf.length);
 for (var i=0; i<_static_sbuf.length; i++) {
   data.push(_static_sbuf[i]);
 }
 if (_rec_pack) {
   pop_pack_stack();
 }
}
function unpack_bytes(data, uctx, len) {
 var ret=new DataView(data.buffer.slice(uctx.i, uctx.i+len));
 uctx.i+=len;
 return ret;
}
function unpack_array(data, uctx, unpacker) {
 var len=unpack_int(data, uctx);
 var list=new Array(len);
 for (var i=0; i<len; i++) {
   list[i] = unpacker(data, uctx);
 }
 return list;
}
function unpack_garray(data, uctx, unpacker) {
 var len=unpack_int(data, uctx);
 var list=new GArray();
 for (var i=0; i<len; i++) {
   list.push(unpacker(data, uctx));
 }
 return list;
}
function unpack_dataref(data, uctx) {
 var block_id=unpack_int(data, uctx);
 var lib_id=unpack_int(data, uctx);
 return new DataRef(block_id, lib_id);
}
function unpack_byte(data, uctx) {
 var ret=data.getInt8(uctx.i);
 uctx.i+=1;
 return ret;
}
function unpack_int(data, uctx) {
 var ret=data.getInt32(uctx.i);
 uctx.i+=4;
 return ret;
}
function unpack_float(data, uctx) {
 var ret=data.getFloat32(uctx.i);
 uctx.i+=4;
 return ret;
}
function unpack_vec2(data, uctx) {
 var x=unpack_float(data, uctx);
 var y=unpack_float(data, uctx);
 return new Vector2([x, y]);
}
function unpack_vec3(data, uctx) {
 var vec=new Vector3();
 var x=unpack_float(data, uctx);
 var y=unpack_float(data, uctx);
 var z=unpack_float(data, uctx);
 vec[0] = x;
 vec[1] = y;
 vec[2] = z;
 return vec;
}
function unpack_vec4(data, uctx) {
 var x=unpack_float(data, uctx);
 var y=unpack_float(data, uctx);
 var z=unpack_float(data, uctx);
 var w=unpack_float(data, uctx);
 return new Vector4([x, y, z, w]);
}
function unpack_quat(data, uctx) {
 var x=unpack_float(data, uctx);
 var y=unpack_float(data, uctx);
 var z=unpack_float(data, uctx);
 var w=unpack_float(data, uctx);
 return new Quat([x, y, z, w]);
}
function unpack_mat4(data, uctx) {
 var m=new Array(16);
 for (var i=0; i<16; i++) {
   m[i] = unpack_float(data, uctx);
 }
 return new Matrix4(m);
}
function encode_utf8(arr, str) {
 for (var i=0; i<str.length; i++) {
   var c=str.charCodeAt(i);
   while (c!=0) {
    var uc=c&127;
    c = c>>7;
    if (c!=0)
     uc|=128;
    arr.push(uc);
   }
 }
}
function decode_utf8(arr) {
 var str="";
 var i=0;
 while (i<arr.length) {
  var c=arr[i];
  var sum=c&127;
  var j=0;
  var lasti=i;
  while (i<arr.length&&(c&128)) {
   j+=7;
   i++;
   c = arr[i];
   c = (c&127)<<j;
   sum|=c;
  }
  if (sum==0)
   break;
  str+=String.fromCharCode(sum);
  i++;
 }
 return str;
}
function test_utf8() {
 var s="a"+String.fromCharCode(8800)+"b";
 var arr=[];
 encode_utf8(arr, s);
 var s2=decode_utf8(arr);
 if (s!=s2) {
   throw new Error("UTF-8 encoding/decoding test failed");
 }
 return true;
}
var _static_arr_uss=new Array(32);
function unpack_static_string(data, uctx, length) {
 var str="";
 if (length==undefined)
  throw new Error("'length' cannot be undefined in unpack_static_string()");
 var arr=length<2048 ? _static_arr_uss : new Array(length);
 arr.length = 0;
 var done=false;
 for (var i=0; i<length; i++) {
   var c=unpack_byte(data, uctx);
   if (c==0) {
     done = true;
   }
   if (!done&&c!=0) {
     arr.push(c);
   }
 }
 truncate_utf8(arr, length);
 return decode_utf8(arr);
}
var _static_arr_us=new Array(32);
function unpack_string(data, uctx) {
 var str="";
 var slen=unpack_int(data, uctx);
 var arr=slen<2048 ? _static_arr_us : new Array(slen);
 arr.length = slen;
 for (var i=0; i<slen; i++) {
   arr[i] = unpack_byte(data, uctx);
 }
 return decode_utf8(arr);
}
function unpack_ctx() {
 this.i = 0;
}
create_prototype(unpack_ctx);
function send_mesh(mesh) {
 var buf=new ArrayBuffer(2);
 var uint=new Uint8Array(buf);
 uint[0] = 35;
 uint[1] = 36;
 var data=[];
 mesh.pack(data);
 console.log(data);
 localStorage.mesh_bytes = data;
}



function NetStatus() {
 this.progress = 0;
 this.status_msg = "";
}
function NetJob(owner, iter, finish, error, status) {
 this.iter = iter;
 this.finish = finish;
 this.error = error;
 this.status = status;
 this.status_data = new NetStatus();
 this.value = undefined;
}
create_prototype(NetJob);
function parse_headers(headers) {
 var ret={}
 if (headers==undefined)
  return ret;
 var in_name=true;
 var key="";
 var value="";
 for (var i=0; i<headers.length; i++) {
   var c=headers[i];
   if (c=="\n") {
     ret[key.trim()] = value.trim();
     key = "";
     value = "";
     in_name = true;
     continue;
   }
   else 
    if (c=="\r") {
     continue;
   }
   if (in_name) {
     if (c==" "||c=="\t") {
       continue;
     }
     else 
      if (c==":") {
       in_name = false;
     }
     else {
      key+=c;
     }
   }
   else {
    value+=c;
   }
 }
 if (key.trim().length!=0) {
   ret[key.trim()] = value.trim();
 }
 return ret;
}
function api_exec(path, netjob, mode, data, mime, extra_headers, responseType) {
 var owner=netjob.owner;
 var iter=netjob.iter;
 if (mode==undefined)
  mode = "GET";
 if (mime==undefined)
  mime = "application/octet-stream";
 if (data==undefined) {
   data = "";
 }
 var error=netjob.error;
 if (error==undefined) {
   error = function(netjob, owner, msg) {
    console.log("Network Error: "+msg);
   }
 }
 var req=new XMLHttpRequest();
 req.open(mode, path, true);
 if (mode!="GET")
  req.setRequestHeader("Content-type", mime);
 if (extra_headers!=undefined) {
   var __iter_k=__get_iter(extra_headers);
   var k;
   while (1) {
    var __ival_k=__iter_k.next();
    if (__ival_k.done) {
      break;
    }
    k = __ival_k.value;
    req.setRequestHeader(k, extra_headers[k]);
   }
 }
 if (responseType==undefined)
  responseType = "text";
 req.responseType = responseType;
 req.onreadystatechange = function() {
  if (req.readyState==4&&(req.status>=200&&req.status<=300)) {
    var obj;
    netjob.headers = parse_headers(req.getAllResponseHeaders());
    console.log(netjob.headers);
    if (netjob.headers["Content-Type"]=="application/x-javascript") {
      try {
       obj = JSON.parse(req.response);
      }
      catch (_error) {
        error(netjob, owner, "JSON parse error");
        obj = {}
        return ;
      }
      netjob.value = obj;
    }
    else {
     netjob.value = req.response;
    }
    var reti=iter.next();
    if (reti.done) {
      if (netjob.finish) {
        netjob.finish(netjob, owner);
      }
    }
  }
  else 
   if (req.status>=400) {
    error(netjob, netjob.owner, req.responseText);
    console.log(req.readyState, req.status, req.responseText);
  }
 }
 req.send(data);
}
function AuthSessionGen(job, user, password, refresh_token) {
 this.scope = {access_token_7: undefined, user_0: user, job_0: job, password_0: password, refresh_token_0: refresh_token}
 this.ret = {done: false, value: undefined}
 this.state = 1;
 this.trystack = [];
 this.next = function() {
  var ret;
  var stack=this.trystack;
  try {
   ret = this._next();
  }
  catch (err) {
    if (stack.length>0) {
      var item=stack.pop(stack.length-1);
      this.state = item[0];
      this.scope[item[1]] = err;
      return this.next();
    }
    else {
     throw err;
    }
  }
  return ret;
 }
 this.push_trystack = function(catchstate, catchvar) {
  this.trystack.push([catchstate, catchvar]);
 }
 this.pop_trystack = function() {
  this.trystack.pop(this.trystack.length-1);
 }
 this._next = function() {
  var $__ret=undefined;
  var $__state=this.state;
  var scope=this.scope;
  while ($__state<10) {
   switch ($__state) {
    case 0:
     break;
    case 1:
     $__state = (scope.refresh_token_0==undefined) ? 2 : 5;
     break;
    case 2:
     scope.sha1pwd_2="{SHA}"+CryptoJS.enc.Base64.stringify(CryptoJS.SHA1(scope.password_0));
     api_exec("/api/auth?user="+scope.user_0+"&password="+scope.sha1pwd_2, scope.job_0);
     
     $__state = 3;
     break;
    case 3:
     $__ret = this.ret;
     $__ret.value = 1;
     
     $__state = 4;
     break;
    case 4:
     console.log("job.value: ", scope.job_0.value);
     scope.refresh_token_0 = scope.job_0.value["refresh_token"];
     
     $__state = 5;
     break;
    case 5:
     api_exec("/api/auth/session?refreshToken="+scope.refresh_token_0, scope.job_0);
     
     $__state = 6;
     break;
    case 6:
     $__ret = this.ret;
     $__ret.value = 1;
     
     $__state = 7;
     break;
    case 7:
     scope.access_token_7=scope.job_0.value["access_token"];
     scope.job_0.value = {refresh: scope.refresh_token_0, access: scope.access_token_7}
     
     $__state = 8;
     break;
    case 8:
     $__state = (scope.job_0.finish!=undefined) ? 9 : 10;
     break;
    case 9:
     scope.job_0.finish(scope.job_0, scope.job_0.owner);
     
     $__state = 10;
     break;
    case 10:
     break;
    default:
     console.log("Generator state error");
     console.trace();
     break;
   }
   if ($__ret!=undefined) {
     break;
   }
  }
  if ($__ret!=undefined) {
    this.ret.value = $__ret.value;
  }
  else {
   this.ret.done = true;
   this.ret.value = undefined;
  }
  this.state = $__state;
  return this.ret;
 }
}
function auth_session(user, password, finish, error, status) {
 var obj={}
 obj.job = new NetJob(obj, undefined, finish, error, status);
 obj.job.finish = finish;
 obj.iter = new AuthSessionGen(obj.job, user, password);
 obj.job.iter = obj.iter;
 obj.iter.next();
 return obj;
}
function call_api(iternew, args, finish, error, status) {
 var obj={}
 obj.job = new NetJob(obj, undefined, finish, error, status);
 var iter=new iternew(obj.job, args);
 iter.job = obj.job;
 obj.iter = obj.job.iter = iter;
 obj.iter.next();
 return obj;
}
function get_user_info(job, args) {
 this.scope = {job_0: job, args_0: args, token_1: undefined}
 this.ret = {done: false, value: undefined}
 this.state = 1;
 this.trystack = [];
 this.next = function() {
  var ret;
  var stack=this.trystack;
  try {
   ret = this._next();
  }
  catch (err) {
    if (stack.length>0) {
      var item=stack.pop(stack.length-1);
      this.state = item[0];
      this.scope[item[1]] = err;
      return this.next();
    }
    else {
     throw err;
    }
  }
  return ret;
 }
 this.push_trystack = function(catchstate, catchvar) {
  this.trystack.push([catchstate, catchvar]);
 }
 this.pop_trystack = function() {
  this.trystack.pop(this.trystack.length-1);
 }
 this._next = function() {
  var $__ret=undefined;
  var $__state=this.state;
  var scope=this.scope;
  while ($__state<3) {
   switch ($__state) {
    case 0:
     break;
    case 1:
     scope.token_1=g_app_state.session.tokens.access;
     api_exec("/api/auth/userinfo?accessToken="+scope.token_1, scope.job_0);
     
     $__state = 2;
     break;
    case 2:
     $__ret = this.ret;
     $__ret.value = undefined;
     
     $__state = 3;
     break;
    case 3:
     break;
    default:
     console.log("Generator state error");
     console.trace();
     break;
   }
   if ($__ret!=undefined) {
     break;
   }
  }
  if ($__ret!=undefined) {
    this.ret.value = $__ret.value;
  }
  else {
   this.ret.done = true;
   this.ret.value = undefined;
  }
  this.state = $__state;
  return this.ret;
 }
}
function get_dir_files(job, args) {
 this.scope = {path_1: undefined, job_0: job, args_0: args, token_1: undefined}
 this.ret = {done: false, value: undefined}
 this.state = 1;
 this.trystack = [];
 this.next = function() {
  var ret;
  var stack=this.trystack;
  try {
   ret = this._next();
  }
  catch (err) {
    if (stack.length>0) {
      var item=stack.pop(stack.length-1);
      this.state = item[0];
      this.scope[item[1]] = err;
      return this.next();
    }
    else {
     throw err;
    }
  }
  return ret;
 }
 this.push_trystack = function(catchstate, catchvar) {
  this.trystack.push([catchstate, catchvar]);
 }
 this.pop_trystack = function() {
  this.trystack.pop(this.trystack.length-1);
 }
 this._next = function() {
  var $__ret=undefined;
  var $__state=this.state;
  var scope=this.scope;
  while ($__state<7) {
   switch ($__state) {
    case 0:
     break;
    case 1:
     scope.token_1=g_app_state.session.tokens.access;
     scope.path_1=scope.args_0.path;
     
     $__state = 2;
     break;
    case 2:
     $__state = (scope.path_1==undefined) ? 3 : 4;
     break;
    case 3:
     api_exec("/api/files/dir/list?accessToken="+scope.token_1+"&id="+scope.args_0.id, scope.job_0);
     
     $__state = 6;
     break;
    case 4:
     
     $__state = 5;
     break;
    case 5:
     api_exec("/api/files/dir/list?accessToken="+scope.token_1+"&path="+scope.path_1, scope.job_0);
     
     $__state = 6;
     break;
    case 6:
     $__ret = this.ret;
     $__ret.value = undefined;
     
     $__state = 7;
     break;
    case 7:
     break;
    default:
     console.log("Generator state error");
     console.trace();
     break;
   }
   if ($__ret!=undefined) {
     break;
   }
  }
  if ($__ret!=undefined) {
    this.ret.value = $__ret.value;
  }
  else {
   this.ret.done = true;
   this.ret.value = undefined;
  }
  this.state = $__state;
  return this.ret;
 }
}
function upload_file(job, args) {
 this.scope = {url2_1: undefined, i_3: undefined, suffix_1: undefined, csize_3: undefined, job_0: job, c_3: undefined, upload_token_3: undefined, data_3: undefined, args_0: args, url_1: undefined, ilen_3: undefined, len_3: undefined}
 this.ret = {done: false, value: undefined}
 this.state = 1;
 this.trystack = [];
 this.next = function() {
  var ret;
  var stack=this.trystack;
  try {
   ret = this._next();
  }
  catch (err) {
    if (stack.length>0) {
      var item=stack.pop(stack.length-1);
      this.state = item[0];
      this.scope[item[1]] = err;
      return this.next();
    }
    else {
     throw err;
    }
  }
  return ret;
 }
 this.push_trystack = function(catchstate, catchvar) {
  this.trystack.push([catchstate, catchvar]);
 }
 this.pop_trystack = function() {
  this.trystack.pop(this.trystack.length-1);
 }
 this._next = function() {
  var $__ret=undefined;
  var $__state=this.state;
  var scope=this.scope;
  while ($__state<8) {
   switch ($__state) {
    case 0:
     break;
    case 1:
     scope.suffix_1;
     scope.url_1=scope.args_0.url;
     scope.url2_1=scope.args_0.chunk_url;
     api_exec(scope.url_1, scope.job_0);
     
     $__state = 2;
     break;
    case 2:
     $__ret = this.ret;
     $__ret.value = 1;
     
     $__state = 3;
     break;
    case 3:
     console.log(scope.job_0.value);
     scope.upload_token_3=scope.job_0.value.uploadToken;
     scope.data_3=scope.args_0.data;
     scope.len_3=scope.data_3.byteLength;
     scope.csize_3=1024*256;
     scope.c_3=0;
     scope.ilen_3=Math.ceil(scope.len_3/scope.csize_3);
     console.log("beginning upload", scope.ilen_3);
     scope.i_3=0;
     
     $__state = 4;
     break;
    case 4:
     $__state = (scope.i_3<scope.ilen_3) ? 5 : 8;
     break;
    case 5:
     console.log("Uploading chunk "+(scope.i_3+1)+" of "+scope.ilen_3);
     scope.url_1=scope.url2_1+"&uploadToken="+scope.upload_token_3;
     scope.size_5=scope.i_3==scope.ilen_3-1 ? scope.len_3%(scope.csize_3) : scope.csize_3;
     console.log(scope.i_3*scope.csize_3, scope.size_5, scope.data_3);
     scope.chunk_5=new DataView(scope.data_3, scope.i_3*scope.csize_3, scope.size_5);
     scope.last_5=scope.i_3*scope.csize_3+scope.size_5-1;
     scope.headers_5={"Content-Range": "bytes "+scope.c_3+"-"+(scope.c_3+scope.size_5-1)+"/"+scope.len_3}
     console.log(scope.headers_5["Content-Range"], scope.size_5, scope.c_3, scope.chunk_5);
     api_exec(scope.url_1, scope.job_0, "PUT", scope.chunk_5, undefined, scope.headers_5);
     
     $__state = 6;
     break;
    case 6:
     $__ret = this.ret;
     $__ret.value = undefined;
     
     $__state = 7;
     break;
    case 7:
     scope.c_3+=scope.size_5;
     scope.i_3++;
     
     $__state = 4;
     break;
    case 8:
     break;
    default:
     console.log("Generator state error");
     console.trace();
     break;
   }
   if ($__ret!=undefined) {
     break;
   }
  }
  if ($__ret!=undefined) {
    this.ret.value = $__ret.value;
  }
  else {
   this.ret.done = true;
   this.ret.value = undefined;
  }
  this.state = $__state;
  return this.ret;
 }
}
function get_file_data(job, args) {
 this.scope = {path_1: undefined, url_1: undefined, job_0: job, args_0: args, token_1: undefined}
 this.ret = {done: false, value: undefined}
 this.state = 1;
 this.trystack = [];
 this.next = function() {
  var ret;
  var stack=this.trystack;
  try {
   ret = this._next();
  }
  catch (err) {
    if (stack.length>0) {
      var item=stack.pop(stack.length-1);
      this.state = item[0];
      this.scope[item[1]] = err;
      return this.next();
    }
    else {
     throw err;
    }
  }
  return ret;
 }
 this.push_trystack = function(catchstate, catchvar) {
  this.trystack.push([catchstate, catchvar]);
 }
 this.pop_trystack = function() {
  this.trystack.pop(this.trystack.length-1);
 }
 this._next = function() {
  var $__ret=undefined;
  var $__state=this.state;
  var scope=this.scope;
  while ($__state<9) {
   switch ($__state) {
    case 0:
     break;
    case 1:
     scope.token_1=g_app_state.session.tokens.access;
     scope.path_1=scope.args_0.path;
     scope.url_1;
     
     $__state = 2;
     break;
    case 2:
     $__state = (scope.path_1==undefined) ? 3 : 4;
     break;
    case 3:
     scope.url_1 = "/api/files/get?accessToken="+scope.token_1+"&id="+scope.args_0.id;
     
     $__state = 6;
     break;
    case 4:
     
     $__state = 5;
     break;
    case 5:
     scope.url_1 = "/api/files/get?accessToken="+scope.token_1+"&path="+scope.path_1;
     
     $__state = 6;
     break;
    case 6:
     api_exec(scope.url_1, scope.job_0, undefined, undefined, undefined, undefined, "arraybuffer");
     
     $__state = 7;
     break;
    case 7:
     $__ret = this.ret;
     $__ret.value = undefined;
     
     $__state = 8;
     break;
    case 8:
     console.log(scope.job_0.value);
     
     $__state = 9;
     break;
    case 9:
     break;
    default:
     console.log("Generator state error");
     console.trace();
     break;
   }
   if ($__ret!=undefined) {
     break;
   }
  }
  if ($__ret!=undefined) {
    this.ret.value = $__ret.value;
  }
  else {
   this.ret.done = true;
   this.ret.value = undefined;
  }
  this.state = $__state;
  return this.ret;
 }
}
function BJSON() {
}
BJSON.UNDEFINED = 0;
BJSON.NULL = 1;
BJSON.STRING = 2;
BJSON.INT32 = 3;
BJSON.FLOAT32 = 4;
BJSON.BOOLEAN = 5;
BJSON.OBJECT = 6;
BJSON.ARRAY = 7;
BJSON.stringify = function(obj) {
 function clean(ob) {
  if (ob==undefined)
   return undefined;
  if (ob.hasOwnProperty("toJSON")) {
    return clean(ob.toJSON());
  }
  if (__instance_of(ob, String)||typeof ob=="string") {
    return new String(ob);
  }
  else 
   if (__instance_of(ob, Array)) {
    var a2=[];
    for (var i=0; i<ob.length; i++) {
      a2.push(clean(ob[i]));
    }
    return a2;
  }
  else 
   if (ob==undefined) {
    return undefined;
  }
  else 
   if (ob==null) {
    return null;
  }
  else 
   if (__instance_of(ob, Number)||__instance_of(ob, Boolean)||typeof ob=="number"||typeof ob=="boolean") {
    if (__instance_of(ob, Boolean)||typeof (ob)=="boolean")
     return new Boolean(ob);
    else 
     return new Number(ob);
  }
  else {
   var keys=obj_get_keys(ob);
   var ob2={}
   for (var i=0; i<keys.length; i++) {
     var k=keys[i];
     var val=clean(ob[k]);
     if (val!=undefined||ob[k]==undefined) {
       ob2[k] = val;
     }
   }
   return ob2;
  }
 }
 function serialize(data, ob) {
  if (ob==undefined) {
    pack_byte(data, BJSON.UNDEFINED);
  }
  else 
   if (__instance_of(ob, String)||typeof ob=="string") {
    pack_byte(data, BJSON.STRING);
    pack_string(data, ob);
  }
  else 
   if (__instance_of(ob, Array)) {
    pack_byte(data, BJSON.ARRAY);
    pack_int(data, ob.length);
    for (var i=0; i<ob.length; i++) {
      serialize(data, ob[i]);
    }
  }
  else 
   if (ob==null) {
    pack_byte(data, BJSON.NULL);
  }
  else 
   if (__instance_of(ob, Number)||__instance_of(ob, Boolean)||typeof ob=="number"||typeof ob=="boolean") {
    if (__instance_of(ob, Boolean)||typeof ob=="boolean") {
      pack_byte(data, BJSON.BOOLEAN);
      pack_byte(data, !!ob);
    }
    else 
     if (Math.floor(ob)==ob) {
      pack_byte(data, BJSON.INT32);
      pack_int(data, ob);
    }
    else {
     pack_byte(data, BJSON.FLOAT32);
     pack_float(data, ob);
    }
  }
  else {
   var keys=obj_get_keys(ob);
   pack_byte(data, BJSON.OBJECT);
   pack_int(data, keys.length);
   for (var i=0; i<keys.length; i++) {
     var k=keys[i];
     var val=ob[k];
     pack_string(data, k);
     serialize(data, val);
   }
  }
 }
 var obj=clean(obj);
 var data=[];
 serialize(data, obj);
 data = new DataView(new Uint8Array(data).buffer);
 return data;
}
BJSON.parse = function(data, uc) {
 if (!(__instance_of(data, DataView))) {
   if (__instance_of(data, ArrayView))
    data = DataView(data.buffer);
   else 
    if (__instance_of(data, ArrayBuffer)) {
     data = DataView(data);
   }
   else {
    throw new Error("Binary JSON parse error");
   }
 }
 if (uc==undefined)
  uc = new unpack_ctx();
 var type=unpack_byte(data, uc);
 switch (type) {
  case BJSON.UNDEFINED:
   return undefined;
  case BJSON.NULL:
   return null;
  case BJSON.STRING:
   return unpack_string(data, uc);
  case BJSON.INT32:
   return unpack_int(data, uc);
  case BJSON.FLOAT32:
   return unpack_float(data, uc);
  case BJSON.BOOLEAN:
   return Boolean(unpack_byte(data, uc));
  case BJSON.OBJECT:
   var obj={}
   var totkeys=unpack_int(data, uc);
   for (var i=0; i<totkeys; i++) {
     var k=unpack_string(data, uc);
     var v=BJSON.parse(data, uc);
     obj[k] = v;
   }
   return obj;
  case BJSON.ARRAY:
   var arr=[];
   var len=unpack_int(data, uc);
   for (var i=0; i<len; i++) {
     arr.push(BJSON.parse(data, uc));
   }
   return arr;
  default:
   throw new Error("corrupted binary JSON data");
 }
}
BJSON.UNDEFINED = 0;
BJSON.NULL = 1;
BJSON.STRING = 2;
BJSON.INT32 = 3;
BJSON.FLOAT32 = 4;
BJSON.BOOLEAN = 5;
BJSON.OBJECT = 6;
BJSON.ARRAY = 7;

"use strict";
function NetStatus() {
}
create_prototype(NetStatus);
NetStatus.prototype.progress = function(perc, msg) {
 if (msg==undefined) {
   msg = "";
 }
}
NetStatus.prototype.error = function(code, msg) {
}
NetStatus.prototype.success = function(code, msg) {
}
function netutils() {
}
create_prototype(netutils);
define_static(netutils, "upload_data", function(path, data, callbacks) {
 var url="/admin/media_upload?filename="+path+"&size="+data.byteLength;
 var chunk_url="/admin/media_upload?filename="+path;
 call_api(upload_file, {data: data, url: url, chunk_url: chunk_url}, callbacks.success, callbacks.error, callbacks.progress);
});
define_static(netutils, "upload_files", function(files, callbacks) {
 if (callbacks==undefined) {
   callbacks = new NetStatus();
 }
 function upload_multiple(job, args) {
  this.scope = {args_0: args, i_1: undefined, job_0: job, files_1: undefined}
  this.ret = {done: false, value: undefined}
  this.state = 1;
  this.trystack = [];
  this.next = function() {
   var ret;
   var stack=this.trystack;
   try {
    ret = this._next();
   }
   catch (err) {
     if (stack.length>0) {
       var item=stack.pop(stack.length-1);
       this.state = item[0];
       this.scope[item[1]] = err;
       return this.next();
     }
     else {
      throw err;
     }
   }
   return ret;
  }
  this.push_trystack = function(catchstate, catchvar) {
   this.trystack.push([catchstate, catchvar]);
  }
  this.pop_trystack = function() {
   this.trystack.pop(this.trystack.length-1);
  }
  this._next = function() {
   var $__ret=undefined;
   var $__state=this.state;
   var scope=this.scope;
   while ($__state<6) {
    switch ($__state) {
     case 0:
      break;
     case 1:
      scope.files_1=scope.args_0.files;
      scope.i_1=0;
      
      $__state = 2;
      break;
     case 2:
      $__state = (scope.i_1<scope.files_1.length) ? 3 : 6;
      break;
     case 3:
      scope.f_3=scope.files_1[scope.i_1];
      console.log(scope.f_3);
      scope.url_3="/admin/media_upload?name="+scope.f_3.name;
      
      $__state = 4;
      break;
     case 4:
      $__ret = this.ret;
      $__ret.value = 1;
      
      $__state = 5;
      break;
     case 5:
      scope.i_1++;
      
      $__state = 2;
      break;
     case 6:
      break;
     default:
      console.log("Generator state error");
      console.trace();
      break;
    }
    if ($__ret!=undefined) {
      break;
    }
   }
   if ($__ret!=undefined) {
     this.ret.value = $__ret.value;
   }
   else {
    this.ret.done = true;
    this.ret.value = undefined;
   }
   this.state = $__state;
   return this.ret;
  }
 }
 var reader=new FileReader();
 for (var i=0; i<files.length; i++) {
   var f=files[i];
   console.log(files, f);
   var reader=new FileReader();
   reader.onload = function(data) {
    console.log("yay, uploading");
    netutils.upload_data(f.name, reader.result, callbacks);
   }
   reader.readAsArrayBuffer(f);
 }
});

