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
