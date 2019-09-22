window.onload = function(){
    tmspans=document.getElementsByTagName("span");
	//if(tmspans.length==0)
	//   tmspans=getElementsByName_iefix("span", "tmtext");
    var i=0;

    while(i<tmspans.length)
    {
       if(tmspans[i].className == "tmNode")
       {
            tmspans[i].onmouseover=function(i){__tmHighlight(this);};
            tmspans[i].onmouseout=function(i){__tmLowlight(this);};
       }
       i++;
    }
    tmimages=document.getElementsByName("tmImage");
	if(tmimages.length==0)
	   tmimages=getElementsByName_iefix("img", "tmImage");
    i=0;
    while(i<tmimages.length)
    {
       tmimages[i].onmouseover=function(){__tmHighlight(this);};
       tmimages[i].onmouseout=function(){__tmLowlight(this);};
       i++;
    }
}

function getElementsByName_iefix(tag, name)
{
   var elem = document.getElementsByTagName(tag);
   var arr = new Array();
   for(i = 0,iarr = 0; i < elem.length; i++) {
      att = elem[i].getAttribute("name");
      if(att == name) {
         arr[iarr] = elem[i];
         iarr++;
      }
   }
   return arr;
}

function jTMenu(id)
{
	return document.getElementById(id);
}
function __tmGetParentId(id)
{
    return id.substr(0,id.indexOf("_"));
}
function __tmGetDirectParentId(id)
{
    return id.substr(0,id.lastIndexOf("_"));
}

function __tmExpandAll(parentid)
{
    tmimages=document.getElementsByName("tmImage");
	if(tmimages.length==0)
	   tmimages=getElementsByName_iefix("img", "tmImage");
    i=0;
    var images = new Array();
    while(i<tmimages.length)
    {
       var level = tmimages[i].id.replace(/[^_]/g, "").length;
       if(!(images[level] instanceof Array)) images[level]=new Array();
       images[level].push(tmimages[i]); 
       i++;
    }
    expandNodes(images,1,parentid);
}
function expandNodes(images,level,parentid)
{
    if(images[level] == null || images[level].length == 0)
        return;
    var nodeExpanded = false;
    for(j=0;j<images[level].length;j++)
    {
        if(images[level][j].src.lastIndexOf("plus")!=-1)
        {
            var reg = new RegExp("tmSwitch..(.*).,.(.*)..", "i");
            var myArray = reg.exec(images[level][j].onclick);
            if(myArray.length == 3)
            {
                __tmSwitch(images[level][j].id.substr(4),myArray[2],true);
                nodeExpanded = true;
            }
        }
    }
    if(nodeExpanded)
        setTimeout(function() { expandNodes(images,level+1,parentid) }, getAnimationInterval(jTMenu("animationEffect"+parentid).value)); 
    else expandNodes(images,level+1,parentid);
}
function __tmCollapseAll()
{
   tmimages=document.getElementsByName("tmImage");
	if(tmimages.length==0)
	   tmimages=getElementsByName_iefix("img", "tmImage");
    i=0;
    while(i<tmimages.length)
    {
       if(tmimages[i].src.lastIndexOf("minus")!=-1)
            tmimages[i].onclick();
       i++;
    }
}
function __tmHighlight(span) {
    var id = span.id.substring(4);
    var imgid = "imge" + id;
    var textid = "text" + id;
    if (jTMenu(textid).className == "tmRegular")
        jTMenu(textid).className = "tmHighlighted";
    if(jTMenu(imgid)!= null)
    {
        if(jTMenu(imgid).src.indexOf("plus-sel") == -1)
            jTMenu(imgid).src = jTMenu(imgid).src.replace("plus","plus-sel");
        if(jTMenu(imgid).src.indexOf("minus-sel") == -1)
            jTMenu(imgid).src = jTMenu(imgid).src.replace("minus","minus-sel");
     }
}
function __tmLowlight(span) {

    var id = span.id.substring(4);
    var imgid = "imge" + id;
    var textid = "text" + id;
    if (jTMenu(textid).className == "tmHighlighted")
        jTMenu(textid).className = "tmRegular";
        if(jTMenu(imgid)!= null)
        {
            jTMenu(imgid).src=jTMenu(imgid).src.replace("-sel","");
        }
}
function str_replace(search, replace, subject) {
    return subject.split(search).join(replace);
}

 function __tmPostBack(nodeid)
 {
    if(jTMenu("text" + nodeid).className == "tmSelectedPass") return;
    var parentid = __tmGetParentId(nodeid);
    var i = -1;
    pos=0;
    // Search the string and counts the number of e's
    while (pos != -1) {
        pos = nodeid.indexOf("_", i + 1);
        var currid = (pos != -1) ? nodeid.substring(0,pos) : nodeid;
        if (jTMenu("tm" + currid)!= null && jTMenu("tm" + currid).className == "tmCollapsed") {

            jTMenu("node" + currid).value="e";
        }
        i = pos;
    }
    if(jTMenu("node" + nodeid) != null)
    {
        var oldid = jTMenu('nodeid' + parentid).value;
        if(jTMenu('node' + oldid) != null && jTMenu('node' + oldid).value == "e"
           && __tmGetDirectParentId(nodeid) == __tmGetDirectParentId(oldid))
            jTMenu('node' + oldid).value="c";
    }
    jTMenu('nodeid' + parentid).value = nodeid;
    jTMenu('frmnodes' + parentid).submit();
}
function getAnimationInterval(effect)
{
    if(effect=="none") return 0;
    if(effect=="slow") return 600;
    if(effect=="normal") return 400;
    if(effect=="fast") return 200;
    return parseInt(effect);
}
function __tmSwitch(nodeid, directory, expandAll) {
    var parentid = __tmGetParentId(nodeid);
    icon = jTMenu("pic" + nodeid);
    classNaming = jTMenu("tm" + nodeid).className;
    if (classNaming == "tmExpanded") {
        jTMenu("imge" + nodeid).src = str_replace("minus", "plus", jTMenu("imge" + nodeid).src);
        var effect = getAnimationInterval(jTMenu("animationEffect"+parentid).value);
        if(effect != 0)
        {
            $("#tm"+nodeid).children('ul').hide(effect);
        }
        jTMenu("tm" + nodeid).className = "tmCollapsed";
        if (icon != null)
            icon.src = str_replace("folderopened", "folder", icon.src);
        jTMenu("node" + nodeid).value = "c";
    }
    else if (classNaming == "tmCollapsed") {
        if (directory != "" && directory != "\"\"") {

            jQuery.get(jTMenu("path" + parentid).value + "lib/getfiles.php",
                {
                    directory: directory,
                    style: jTMenu("style" + parentid).value,
                    folderIcons: jTMenu("folderIcons" + parentid).value,
                    fileIcons: jTMenu("fileIcons" + parentid).value,
                    parentId: nodeid,
                    path: jTMenu("path" + parentid).value,
                    password: "apphpmenu",
                    direction: jTMenu("direction" + parentid).value,
                    expandSubfolders: expandAll
                },
                function (data) {
                    //jTMenu("innercontainer" + parentid).innerHTML = data;
                    numNodes = data.substring(0, data.indexOf("<") - 1);
                    if (numNodes == 0)
                    {
                        jTMenu("imge" + nodeid).style.visibility = "hidden";
                    }
                    else
                    {
                        data = data.substring(data.indexOf("<"));
                        if (jTMenu("showNumFiles" + parentid).value == 1) {
                            jTMenu("text" + nodeid).innerHTML += " (" + numNodes + ")";
                        }
                        var effect = getAnimationInterval(jTMenu("animationEffect"+parentid).value);
                        if(effect != 0)
                        {
                            if(expandAll)
                                setTimeout(function() { expandFileNodes(data) }, getAnimationInterval(jTMenu("animationEffect"+parentid).value));
                            jTMenu("tm" + nodeid).className = "tmCollapsed";
                            jTMenu("tm" + nodeid).innerHTML += data;
                            $("#tm"+nodeid).children('ul').show(effect);
                            jTMenu("tm" + nodeid).className = "tmExpanded";
                            
                        }
                        else
                        {
                            jTMenu("tm" + nodeid).innerHTML += data;
                            if(expandAll)
                                expandFileNodes(data);
                        }
                        jTMenu("span" + nodeid).onmouseover = function () {
                            __tmHighlight(this);
                        };
                        jTMenu("span" + nodeid).onmouseout = function () {
                            __tmLowlight(this);
                        };
                        jTMenu("imge" + nodeid).onmouseover = function () {
                            __tmHighlight(this);
                        };
                        jTMenu("imge" + nodeid).onmouseout = function () {
                            __tmLowlight(this);
                        };
                        jTMenu("imge" + nodeid).onclick = function () {
                            __tmSwitch(nodeid, "");
                        };
                    }
                    jTMenu("span" + nodeid).onclick = function () {
                        __tmPostBackAjax(nodeid, "/", "file");
                    };
                    

                });
        }
        jTMenu("imge" + nodeid).src = str_replace("plus", "minus", jTMenu("imge" + nodeid).src);
        var effect = getAnimationInterval(jTMenu("animationEffect"+parentid).value);
        if(effect != 0)
        {
            $("#tm"+nodeid).children('ul').show(effect);
        }
         jTMenu("tm" + nodeid).className = "tmExpanded";
        if (icon != null)
            icon.src = str_replace("folder", "folderopened", icon.src);
        jTMenu("node" + nodeid).value = "e";
    }

}
function expandFileNodes(data)
{
    var reg = new RegExp("tmSwitch..(.*?).,.(.*?)..", "ig");
    while ((myArray = reg.exec(data)) != null) {
        if(myArray.length == 3)
            __tmSwitch(myArray[1],myArray[2],true);
    }
}
function __tmPostBackAjax(newid, filename, mode) {
    if(jTMenu("text" + newid).className == "tmSelectedPass") return;
    var parentid = __tmGetParentId(newid);
    if (mode == "file")
        jTMenu("innercontainer" + parentid).innerHTML = "<img src='" + jTMenu("path" + parentid).value + "styles/ajax_loading.gif' alt='loading' />";
    oldid = jTMenu("nodeid" + parentid).value;
    if (oldid.length != 0) {
        jTMenu("text" + oldid).className = "tmRegular";
    }
    jTMenu("nodeid" + parentid).value = newid;
    // collapsing last selected same-level node
    if (oldid != "" && jTMenu("tm" + oldid).className == "tmExpanded"
        && newid != oldid && __tmGetDirectParentId(newid) == __tmGetDirectParentId(oldid))
        __tmSwitch(oldid);
    var i = -1;
    pos=0;
    while (pos != -1) {
        pos = newid.indexOf("_", i + 1);
        var currid = (pos != -1) ? newid.substring(0,pos) : newid;
        if (jTMenu("tm" + currid)!= null && jTMenu("tm" + currid).className == "tmCollapsed") {
            if (mode == "filesystem") {
                __tmSwitch(currid, filename);
            }
            else __tmSwitch(currid, "");
        }
        i = pos;
    }
    if (jTMenu("refresh"+parentid).value=="1")
        jTMenu("text" + newid).className = "tmSelected";
	else jTMenu("text" + newid).className = "tmSelectedPass";
    if (oldid != null && jTMenu("code" + oldid) != null) {
        jTMenu("code" + oldid).style.display = 'none';
    }
    if (mode == "file") {
        jQuery.get(
            jTMenu("path" + parentid).value + "lib/getcontent.php",
            {
                filename: filename,
                password: "apphpmenu",
                debug: jTMenu("debug" + parentid).value
            },
            function (data) {
                if(data.lastIndexOf("|||") != -1)
                {
                    if(jTMenu("tmTime" + parentid)!=null)
                        jTMenu("tmTime" + parentid).innerHTML = data.substring(data.lastIndexOf("|||")+3);
                    jTMenu("innercontainer" + parentid).innerHTML = data.substring(0, data.lastIndexOf("|||"));
                }
                else
                    jTMenu("innercontainer" + parentid).innerHTML = data;
            }
        );
    }
    else if (mode == "code") {
        jTMenu("code" + newid).style.display = '';
        jTMenu("innercontainer" + parentid).innerHTML = '';
    }
}

function __tmPostBackNewWindow(nodeid,parentid,filename)
{
    if(jTMenu("text" + nodeid).className == "tmSelectedPass") return;
    var previousAction = jTMenu("frmnodes"+parentid).action;
    jTMenu("frmnodes"+parentid).action = filename;
    if(previousAction.indexOf('?') != -1)
      {
         var previousparameters = previousAction.substring(previousAction.indexOf('?')+1);
         if(filename.indexOf('?') != -1)
             jTMenu("frmnodes"+parentid).action += "&" + previousparameters;
         else jTMenu("frmnodes"+parentid).action += "?" + previousparameters;
      }
    __tmPostBack(nodeid,parentid)
}