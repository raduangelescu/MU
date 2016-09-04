
static_text_div  ="nochange"
draw_text_canvas = "draw"
button_area      = "buttons"

alphabet =['M','I','U']
rules = [
  {start:"xI", end:"xIU"},
  {start:"Mx", end:"Mxx"},
  {start:"xIIIy", end:"xUy"},
  {start:"xUUy", end:"xy"},
]

levels = [{start:"MUI", end:"MUIU"},
  {start:"MU", end:"MUU"},
  {start:"MUIIIU", end:"MUUU"},
  {start:"MUU", end:"M"},
  {start:"MIII", end:"MIUIIU"},
  {start:"MUI", end:"MUIUIIUIIUIIUIIUIIUIIUIIUIU"},
  {start:"MI", end:"MIU"},
  {start:"MI", end:"MU"},
]

currentLevelIdx = 0;

guiItemsText    = []
selectedText    = ""
selectedBegin   = 0
selectedEnd     = 0

animation_units = 0

function PrepareRules()
{
    var dmp = new diff_match_patch();
    for(var i = 0; i< rules.length; i++)
    {
        rules[i].diff = dmp.patch_make(rules[i].start,rules[i].end)
        rules[i].isStaticLeft  = IsInAlphabet(rules[i].start[0])
        rules[i].isStaticRight = IsInAlphabet(rules[i].start[rules[i].start.length - 1])
        rules[i].selection = (!rules[i].isStaticRight && !rules[i].isStaticLeft)
        rules[i].valid = false
    }

}

PrepareRules()

function IsInAlphabet(c)
{
  return alphabet.indexOf(c) != -1;
}


function ApplyStartRule(string, ruleObject)
{
  rulestring   = ruleObject.start

  ruleIdxLeft   = 0
  stringIdxLeft = 0

  ruleIdxRight   = rulestring.length -1
  stringIdxRight = string.length -1

  ruleObject.split = {}

  if(ruleObject.isStaticLeft)
  {
    for(;ruleIdxLeft<rulestring.length && stringIdxLeft < string.length && IsInAlphabet(rulestring[ruleIdxLeft]); stringIdxLeft++,ruleIdxLeft++ )
    {
        if(rulestring[ruleIdxLeft] != string[stringIdxLeft])
        {
          return false
        }
    }
  }

  if(ruleObject.isStaticRight)
  {
    for(;ruleIdxRight>=0 && stringIdxRight >= 0 && IsInAlphabet(rulestring[ruleIdxRight]); stringIdxRight--,ruleIdxRight-- )
    {
        if(rulestring[ruleIdxRight] != string[stringIdxRight])
        {
          return false
        }
    }
  }

  if(ruleObject.isStaticRight || ruleObject.isStaticLeft)
  {
    ruleObject.split[rulestring[ruleIdxRight]] = string.substring(stringIdxLeft, stringIdxRight + 1)
  }
  else
  {
    ruleFixed = rulestring.substring(1,rulestring.length-1)
    indexmiddle = string.indexOf(ruleFixed);
    if(indexmiddle == -1)
      return false
    ruleObject.split[rulestring[0]]                 = string.substring(0, indexmiddle)
    ruleObject.split[rulestring[rulestring.length-1]]= string.substring(indexmiddle + ruleFixed.length, string.length)
  }

  return true
}


function AddTextSpan(cname)
{
  element = $('<span/>', {className: cname });
  $("#"+draw_text_canvas).append(element)
  guiItemsText.push(element)
  return element
}

function ApplyEndRule(ruleObject)
{
  split = ruleObject.split
  rule  = ruleObject.end
  text  = ""
  rulediffs = ruleObject.diff[0].diffs
  prevmode  = 0

  prefix =""
  suffix =""

  if(ruleObject.selection == true)
  {
    fulltext = $("#"+static_text_div).text()
    prefix = fulltext.slice(0,selectedBegin)
    suffix = fulltext.slice(selectedEnd,fulltext.length)
  }

  prefixelement = AddTextSpan("static")
  prefixelement.text(prefix);

  for(var i = 0 ; i<rulediffs.length; i++)
  {
    diffobj = rulediffs[i]
    str     = diffobj[1]
    mode    = diffobj[0] + 1

    var item = ""
    for(var j = 0; j<str.length; j++)
    {
        item = item + ((IsInAlphabet(str[j]))? str[j]: split[str[j]])
    }
    types = [{anim:"bounceOutUp",cname:"dynamic_remove"},{anim:"none",cname:"static"},{anim:"bounceIn",cname:"dynamic_add"}]
    element = AddTextSpan(types[mode].cname)
    if(mode == 2 || mode == 0)
    {
      element.text(item+","+item);
    }
    else
    {
      element.text(item);
    }
    DoAnim(types[mode].anim,element)
  }

  suffixelement = AddTextSpan("static")
  suffixelement.text(suffix);

  $("#"+static_text_div).text("")

}


function fgetSelection()
{
    var t = null;
    if (window.getSelection){t = window.getSelection();}
    else if (document.selection){t = document.selection.createRange();}
    return t;
}

function ElementAnimationComplete()
{
  if(this.index != 1)
   return

  this.stop();

  animation_units--

  if(animation_units != 0)
    return

  text = ""
  guiItemsText.map(function (currentelement){
    classname = currentelement.attr('classname')
    if(classname == "dynamic_add")
    {
      text = text + currentelement.text().split(",")[0]
    }
    if(classname == "static")
    {
      text = text + currentelement.text()
    }
    currentelement.remove()
  })
 guiItemsText=[]
 $("#"+static_text_div).text(text)

 selectedText = ""
 checkValid()
 isLevelFinished()

}

function isLevelFinished()
{
  if(levels[currentLevelIdx].end == $("#"+static_text_div).text())
  {
    congrats = "CONGRATULATIONS! Finished level "+(currentLevelIdx+1)
    $("#levelend").text(congrats + "," +congrats+ "," +congrats+ "," +congrats)
    DONextLevelAnim()
  }
}

function DONextLevelAnim()
{
    rules.map(function (currentelement){currentelement.button.hide()})
    $("#levelend").unbind().removeData();
    $("#levelend").Morphext({
            speed:2000,
            animation: "bounceIn",
            complete: function()
            {
              if(this.index == 1)
              {
                this.stop();
                currentLevelIdx++;
                if(currentLevelIdx >= levels.length)
                {
                  currentLevelIdx = 0
                }
                PopulateLevelInfo();
                checkValid();
              }
            }
        });
}

function DoAnim(animationname,element)
{
  if(animationname == "none")
    return;

  animation_units++;

  rules.map(function (currentelement){currentelement.button.hide()})
  element.unbind().removeData();
  element.Morphext({
            speed:500,
            animation: animationname,
            complete: ElementAnimationComplete
        });
}

function checkValid()
{
  rules.map(function (currentelement){
    text = (currentelement.selection) ? selectedText :  $("#"+static_text_div).text()
    if( ApplyStartRule(text,currentelement))
    {
      currentelement.button.show()
    }
    else
    {
      currentelement.button.hide()
    }
  })
}

function PopulateLevelInfo()
{
    $("#levelend").text("Get to "+levels[currentLevelIdx].end)
    $("#"+static_text_div).text(levels[currentLevelIdx].start)
}

$(document).ready(function() {
  PopulateLevelInfo()
  rules.map(function (currentelement,i)
            {
              element = $("<a class=\"btn\"  onclick=\"ApplyEndRule(rules["+i+"])\" href=\"#\">"+currentelement.start +"->"+currentelement.end+"</a>");
              $("#"+button_area).append(element)
              currentelement.button = element
            })

    checkValid()
    $(document).bind("mouseup", function() {
      sel = fgetSelection()
      selectedText = ""
      if(sel != null && sel.rangeCount > 0)
      {
        selectedBegin = sel.getRangeAt(0).startOffset
        selectedEnd   = sel.getRangeAt(0).endOffset
        selectedText  = sel.toString();
      }

      checkValid()
    });
});
