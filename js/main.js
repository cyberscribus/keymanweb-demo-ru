// JavaScript Document main.js: Keyboard management for KeymanWeb demonstration pages

/* 
    The keyboard name and/or BCP-47 language code must be specified for each keyboard that is to be available.
    If the same keyboard is used for several languages, it must be listed for each
    language, but the keyboard itself will only be loaded once. 
    If two (or more) keyboards are to be available for a given language, both must be listed.
    Any number of keyboards may be specified in one or more calls. 
    Keyboard paths may be absolute (with respect to the server root) or relative to the keyboards option path. 
    The actual keyboard object will be downloaded asynchronously when first selected for use.
  
    Each argument to addKeyboards() is a string, for example:
      european2         loads the current version of the Eurolatin 2 keyboard (for its default language)
      european2@fr      loads the current version of the Eurolatin 2 keyboard for French
      european2@fr@1.2  loads version 1.2 of the Eurolatin 2 keyboard for French
      
    Argument syntax also supports the following extensions:
      @fr               load the current version of the default keyboard for French
      @fr$              load all available keyboards (current version) for French
          
    Each call to addKeyboards() requires a single call to the remote server, 
    (unless all keyboards listed are local and fully specified) so it is better
    to use multiple arguments rather than separate function calls. 
    
    Calling addKeyboards() with no arguments returns a list of *all* available keyboards. 
    The Toolbar (desktop browser) UI is best suited for allowing users to select 
    the appropriate language and keyboard in this case.

    Keyboards may also be specified by language name using addKeyboardsForLanguage()
    for example:
      keymanweb.addKeyboardsForLanguage('Burmese');
    
    Appending $ to the language name will again cause all available keyboards for that
    language to be loaded rather than the default keyboard.
        
    The first call to addKeyboardsForLanguage() makes an additional call to the 
    keyman API to load the current list of keyboard/language associations.

    In this example, the following function loads the indicated keyboards,
    and is called when the page loads. 
*/

  function loadKeyboards() 
  { 
	var kmw=keyman;
    
	// The first keyboard added will be the default keyboard for touch devices.
    // For faster loading, it may be best for the default keyboard to be
    // locally sourced.
    //kmw.addKeyboards({id:'us',name:'English',languages:{id:'en',name:'English'},
    //  filename:'./us-1.0.js'});
      
    // Add more keyboards to the language menu, by keyboard name,
    // keyboard name and language code, or just the BCP-47 language code.  
    //kmw.addKeyboards('french', 'sil_euro_latin@no,sv', '@he'); // Loads all from uniquely-identifying strings.
	kmw.addKeyboards('basic_kbdusx');
  
    // Add a keyboard by language name.  Note that the name must be spelled
    // correctly, or the keyboard will not be found.  (Using BCP-47 codes is
    // usually easier.)
    //kmw.addKeyboardsForLanguage('Dzongkha');
    
    // Add a fully-specified, locally-sourced, keyboard with custom font  
    kmw.addKeyboards({
	  id: 'basic_kbdrum',
	  name: 'Russian Mnemonic',
	  languages:{
		id:	'ru',
		name: 'Russian',
		region: 'Asia',
		// A font can be specified here if its files are available.
      },
	  filename:'https://github.com/dotland/mnemonic-kb-ru/releases/latest/download/rum.js'
    });

    // The following two optional calls should be delayed until language menus are fully loaded:
    //  (a) a specific mapped input element input is focused, to ensure that the OSK appears
    //  (b) a specific keyboard is loaded, rather than the keyboard last used.         
    //window.setTimeout(function(){kmw.setActiveElement('ta1',true);},2500);
    //window.setTimeout(function(){kmw.setActiveKeyboard('Keyboard_french','fr');},3000);
  
    // Note that locally specified keyboards will be listed before keyboards 
    // requested from the remote server by user interfaces that do not order
    // keyboards alphabetically by language.
  }
  
  // Script to allow a user to add any keyboard to the keyboard menu 
  function addKeyboard(n)
  { 
    var sKbd,kmw=keyman;
    switch(n)
    {
      case 1:
        sKbd=document.getElementById('kbd_id1').value;
        kmw.addKeyboards(sKbd);
        break;
      case 2:
        sKbd=document.getElementById('kbd_id2').value.toLowerCase();
        kmw.addKeyboards('@'+sKbd);
        break;
      case 3:
        sKbd=document.getElementById('kbd_id3').value;
        kmw.addKeyboardsForLanguage(sKbd);
        break;
    }
  }
  
  // Add keyboard on Enter (as well as pressing button)
  function clickOnEnter(e,id)
  {
    e = e || window.event;
    if(e.keyCode == 13) addKeyboard(id); 
  }
  
  function SetupDocument()
  {
    var kmw=window.keyman;
    kmw.init({
      attachType:'auto',
      resources:''
    }).then(function() {
      loadKeyboards();
    });

    var ta1 = document.getElementById('ta1');
    var charGrid = document.getElementById('character-grid');
    var lastContent = null;

    if(keyman.util.isTouchDevice()) {
      document.body.className += ' touch-device';
      if(keyman.util.device.OS == 'iOS') {
        document.body.className += ' touch-device-ios';
      } else if(keyman.util.device.OS == 'Android') {
        document.body.className += ' touch-device-android';
      }
    } else {
      document.body.className += ' desktop-device';
    }

    function removeChildNodes(node) {
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }
    }

    function addCharElements(text, code) {
      var ebox = document.createElement('div'), echar = document.createElement('div'), ecode = document.createElement('div');
      echar.textContent = text;
      echar.className = 'char-char keymanweb-font';
      ecode.textContent = code;
      ecode.className = 'char-code';
      ebox.appendChild(echar);
      ebox.appendChild(ecode);
      charGrid.appendChild(ebox);
    }

    function logContent() {
      if(lastContent === ta1.value) {
        updateLogCursor();
        return;
      }
      removeChildNodes(charGrid);
      if(ta1.value.length == 0) {
        addCharElements('-','empty');
      } else {
        for(var i = 0; i < ta1.value.length; i++) {
          //
          var code = ta1.value.charCodeAt(i);
          var text = ta1.value.charAt(i);
          var slice = 4;
          // Test for SMP
          if(code >= 0xD800 && code < 0xDC00) {
            if(i < ta1.value.length) {
              var code2 = ta1.value.charCodeAt(i+1);
              if(code2 >= 0xDC00 && code < 0xE000) {
                code = (code - 0xD800) * 0x400 + (code2 - 0xDC00) + 0x10000;
                text += ta1.value.charAt(i+1);
                slice = 6;
                i++;
              }
            }
          }
          addCharElements(text, ('000000'+(code).toString(16)).slice(-slice));
        }
      }
      updateLogCursor();
      lastContent = ta1.value;
    }

    var lastSelStart = -1;

    function calculateLengthByCodepoint(text, base, x)  {
      var stop = base + x;
      while(base < stop - 1) {
        if(text.charCodeAt(base) >= 0xD800 && text.charCodeAt(base) < 0xDC00 &&
           text.charCodeAt(base+1) >= 0xDC00 && text.charCodeAt(base+1) < 0xE000) {
          // Decrement position by one for each surrogate pair
          x--;
        }
        base++;
      }
      return x;
    }

    function updateLogCursor() {
      var i, selStart, selLength, selDirection;

      if(keyman.isPositionSynthesized()) { // this is an internal function
        // For touch devices, we need to ask KMW
        selStart = ta1.kmw_ip ? ta1.kmw_ip.getTextBeforeCaret().length : 0;
        selLength = 0;
        selDirection = 'forward';
      } else {
        // For desktop devices, we use the position reported by the textarea control
        selStart = ta1.selectionStart;
        selLength = ta1.selectionEnd - ta1.selectionStart;
        selDirection = ta1.selectionDirection;
      }

      selLength = calculateLengthByCodepoint(ta1.value, selStart, selLength);
      selStart = calculateLengthByCodepoint(ta1.value, 0, selStart);

      //console.log('selStart='+selStart+', selLength='+selLength);
      if(lastSelStart != selStart || lastSelLength != selLength) {
        for(i = 0; i < charGrid.childNodes.length; i++) {
          charGrid.childNodes[i].className = '';
        }

        var x = selDirection == 'backward' ? selStart-1 : selStart+selLength - 1;

        if(x < 0) {
          charGrid.className = 'cursor';
        } else {
          charGrid.className = '';
          if(x >= 0 && x < charGrid.childNodes.length) {
            charGrid.childNodes[x].className = 'cursor';
          }
          charGrid.childNodes[x].scrollIntoView();
        }

        for(i = selStart; i < selStart+selLength; i++) {
          charGrid.childNodes[i].className += ' cursor-selected';
        }
        lastSelStart = selStart;
        lastSelLength = selLength;
      }
    }

    logContent();
    window.setInterval(logContent, 100);

    /* TODO: once KeymanWeb supports oninput signalling
    document.getElementById('ta1').addEventListener('input', logContent, false);
    */

    window.onload = function() {
      window.setTimeout(
        function () {
          //document.getElementById('ta1').focus();
          keyman.moveToElement('ta1');
        }, 10);

        document.getElementById('model-link').addEventListener('click', modelLinkClick);
    }

    /* Lexical models */

    var firstModel = true;

    /**
     * Register a model for debugging. Called by keyboards.js. The
     * first model registered will be activated automatically.
     */
    function registerModel(model, src) {
      var list = document.getElementById('model-list-inner');
      var a = document.createElement('a');
      a.href = '#';
      a.innerText = model;
      a.addEventListener('click', function(ev) {
        ev.returnValue = false;

        var lastModel = keyman.modelManager.activeModel;
        if(lastModel)
          keyman.modelManager.deregister(lastModel.id);
        keyman.modelManager.register({
          id: model,
          languages: ['en'],
          path: 'http://'+location.host+'/model/'+src
        });
      });
      list.appendChild(a);

      if(firstModel) {
        keyman.modelManager.register({
          id: model,
          languages: ['en'],
          path: 'http://'+location.host+'/model/'+src
        });
        document.getElementById('model-list-empty').style.display = 'none';
        firstModel = false;
      }
    }

    /**
     * Toggle visibility of the model menu
     */
    function modelLinkClick(e) {
      var elem = document.getElementById('model-list');
      elem.className = elem.className == '' ? 'model-list-visible' : '';
      e.returnValue = false;
      return false;
    }
  }
