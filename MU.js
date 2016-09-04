
function ApplyRule1()
{
  nchange     = $("#nchange1")
  oldString    = nchange.text()
  stringChange = oldString.substr(0,oldString.length - 1)

  nchange.text(stringChange)
  $("#change").text("I,IU,IU")
  DoAnim("bounceIn")
}

function ApplyRule2()
{
  nchange     = $("#nchange1")
  oldString    = nchange.text()
  stringChange = oldString.substr(1,oldString.length)

  nchange.text("M")
  chg = stringChange+stringChange
  $("#change").text(stringChange+","+chg+","+chg)
  DoAnim("swing")
}

function ApplyRule3()
{
  nchange1     = $("#nchange1")
  nchange2     = $("#nchange2")

  oldString    = nchange1.text()
  offset       = selectedBegin

  x1 = oldString.substr(0,offset);
  y1 = oldString.substr(offset+(""+selectedText).length,oldString.length);

  nchange1.text(x1);
  $("#change").text("III,U,U")
  nchange2.text(y1);

  DoAnim("bounceOutUp")

}


function ApplyRule4()
{
  nchange1     = $("#nchange1")
  nchange2     = $("#nchange2")

  oldString    = $("#nchange1").text()
  offset       = selectedBegin;

  x1 = oldString.substr(0,offset);
  y1 = oldString.substr(offset + (""+selectedText).length,oldString.length);

  nchange1.text(x1);
  $("#change").text("UU,,")
  nchange2.text(y1);

  DoAnim("bounceOutUp")

}

function isRule1Valid()
{
  string = $("#nchange1").text()
  var lastChar = string.charAt(string.length - 1);
  return (lastChar == "I");
}

function isRule2Valid()
{
  string = $("#nchange1").text()
  var firstChar = string.charAt(0);

  return (firstChar == "M");
}

function isRule3Valid()
{
  return (selectedText == "III");
}

function isRule4Valid()
{
  return (selectedText == "UU");
}

var selectedText = ""

if (!window.x) {
    x = {};
}

function fgetSelection()
{
    var t = null;
    if (window.getSelection)
    {
        t = window.getSelection();

    }
    else if (document.selection)
    {
        t = document.selection.createRange();
    }
    return t;
}

function DoAnim(animationname)
{
  var anim  = $("#change")
  anim.unbind().removeData();
  anim.Morphext({
            speed:300,
            animation: animationname,
            complete: function () {
             if(this.index == 2)
             {
               change   = $("#change")
               nchange1 = $("#nchange1")
               nchange2 = $("#nchange2")
               changepart = change.text();
               nchangepart1 = nchange1.text();
               nchangepart2 = nchange2.text();
               nchange1.text(nchangepart1+  changepart + nchangepart2);
               change.text("");
               nchange2.text("");
               this.stop();
               selectedText = "INVALID"
               checkValid()
             }
            }
        });
  disableAll()
}

function disableAll()
{
  oldRule1Valid = false
  oldRule2Valid = false
  oldRule3Valid = false
  oldRule4Valid = false
  $("#buttons").html("")
}

var oldRule1Valid = false
var oldRule2Valid = false
var oldRule3Valid = false
var oldRule4Valid = false

function checkValid()
{
  html1 = ""
  var currentIsRuleValid1 = isRule1Valid()
  var currentIsRuleValid2 = isRule2Valid()
  var currentIsRuleValid3 = isRule3Valid()
  var currentIsRuleValid4 = isRule4Valid()

  if(currentIsRuleValid1)
  {
    html1 = html1 + "     <a class=\"btn\"  onclick=\"ApplyRule1()\" href=\"#\">*I -> *IU</a>"
  }
  if(currentIsRuleValid2)
  {
    html1 = html1 + "     <a class=\"btn\"  onclick=\"ApplyRule2()\" href=\"#\">M* -> M**!</a>"
  }
  if(currentIsRuleValid3)
  {
    html1 = html1 + "     <a class=\"btn\"  onclick=\"ApplyRule3()\" href=\"#\">xIIIy -> xUy</a>"
  }
  if(currentIsRuleValid4)
  {
    html1 = html1 + "     <a class=\"btn\"  onclick=\"ApplyRule4()\" href=\"#\">xUUy -> xy!</a>"
  }

  if(currentIsRuleValid1 != oldRule1Valid ||
     currentIsRuleValid2 != oldRule2Valid ||
     currentIsRuleValid3 != oldRule3Valid ||
     currentIsRuleValid4 != oldRule4Valid)
     {
       $("#buttons").html(html1)
       oldRule1Valid = currentIsRuleValid1
       oldRule2Valid = currentIsRuleValid2
       oldRule3Valid = currentIsRuleValid3
       oldRule4Valid = currentIsRuleValid4
     }
}

$(document).ready(function() {

    checkValid()

    $(document).bind("mouseup", function() {
      sel = fgetSelection()
      if(sel != null && sel.rangeCount > 0)
      {
        selectedBegin = sel.getRangeAt(0).startOffset
        selectedEnd   = sel.getRangeAt(0).endOffset
        selectedText  = sel.toString();

      }
      else {
        selectedText = "INVALID"
      }
      checkValid()


    });
});
