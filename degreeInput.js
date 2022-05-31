/**
 * @namespace H5PEditor
 */

// Based on Joubel H5PEditor.Timecode 

H5PEditor.widgets.degreeInput = H5PEditor.DegreeInput = (function ($) {

  /**
   * Create 7 input boxes for 7 steps in degree dictation (solfege / hearing theory)
   *
   * @class
   * @param {*} parent
   * @param {Object} field
   * @param {Number} params
   * @param {Function} setValue
   */
  function DegreeInput(parent, field, params, setValue) {
    const self = this;

    // Global elements
    const $item, $input, $errors;

    self.field = field;

    /**
     * Initialize timecode fields.
     *
     * @private
     */
    const init = function () {
      $item = createItem(); //$(createHtml());
      $input = $item.find('input');
      $errors = $item.children('.h5p-errors');
            
      // Validate on change
      $input.change(function () {
        // Validate
        const value = self.validate();
        console.log("Change function: ", value);

        if (value !== false) {
            //console.log("String value: ", value.join(" "));
            setValue(field, value.join(" "));
        }
      });
    };
    
    // degreeInput ------------------------------------
    const validateCell = (userInput) => { // check if allowed degree
      return [-5,-6,-7,1,2,3,4,5,6,7,8].includes(parseInt(userInput));
    }
    
    this.degreeInputCells = []; // array of input elements

    const createDegreeInput = () => { // creates array of 7 inputs
      this.degreeInputCells = [];
      const $degreeInput = $('<div>', {id:"degreeInputDiv"});
      for (let i=0; i<7;i++) {
        const $cell = $('<input>', {
            id: "degreeCell" + i,
            attr: {index: i},
            class: "degreeCell",
            type: "text",
            inputmode: "numeric",
            size: 1,
            keyup: (event) => {
              const index = parseInt(event.target.getAttribute("index"));
              const input = event.target.value;
              //console.log(index, input);event
              console.log("Key: ",event.key);
              let result = true;
              let move = 0;

              if ( /\d/.test(event.key) ) { // if number, validate and move to next
                result =  validateCell(input);
                console.log("is digit. result:", result);
                if (result) {
                  if (index<6) move = 1;
                  if (index==6) self.validate();              
                  // play only in editor! -  not implemented yet.
                  // const midiNote = this.tonicNoteNumber + getSemitones(parseInt(input));
                  // playNote(midiNote, 0, 0.5);
                }
              } else if (event.key==="ArrowRight" && index<6) {
                  move = 1;
              } else if (event.key==="ArrowLeft" && index>0) {
                  move = -1;
              }

              if (move!=0) {
                this.degreeInputCells[index+move].focus();
              }
              if (event.key==='Enter') {
                console.log("Enter");
                self.validate();
              }
            }
          }

        );
        $degreeInput.append($cell);
        this.degreeInputCells.push($cell);
      }

      $('<button>', {
        id: "resetButton",
        class: "h5peditor-button", // h5p-editor button does not exist...
        text: "Reset",
        click: () => {
          for (const $element  of this.degreeInputCells) {
            $element.val("");
          }
        }
      }).appendTo($degreeInput);
      
      $('<button>', {
        id: "validateButton",
        class: "button",
        text: "Validate",
        click: () => { () => self.validate();  }
      }).appendTo($degreeInput);
        
      console.log("Created degreeInput: ", $degreeInput, this.degreeInputCells);
      return $degreeInput; //this.degreeInputCells;
    }

    /**
     * Create the HTML for the field.
     *
     * @private
     */
    const createItem = function () {
      
        const $container = $('<div>', {
        'class': 'field text h5p-degree-input'
        });
    
        // Add header:
        $('<span>', {
        'class': 'h5peditor-label',
        html: self.field.label
        }).appendTo($container);
    
        // Add description:
        $('<span>', {
        'class': 'h5peditor-field-description',
        html: t("fieldDescription")
        }).appendTo(self.$container)
                
            
        //const $degreeInput= createDegreeInput();
        //console.log($degreeInput);
            
        $container.append(createDegreeInput());    
        
        $('<div>', {id: "errorsDiv", class:"h5p-errors"}).appendTo($container);
        return $container;
    };

    

    /**
     * Append field to given wrapper.
     *
     * @public
     * @param {jquery} $wrapper
     */
    self.appendTo = function ($wrapper) {
      $item.appendTo($wrapper);
    };

    self.getDomElement = function () {
      return $item;
    };

    /**
     * Validate field.
     *
     * @return {*} valid value or false
     */
    self.validate = function () {
        // this gets fired every time any of the inputs is changed
 
    $errors.html('');
    // TODO: add condition for optional parameter
      
    let ok = true;
    const valueArray = new Array(7);
    for (let i=0; i< this.degreeInputCells.length; i++) {
        const $cell = this.degreeInputCells[i];
        const value = parseInt($cell.val());
        const result = validateCell(value);
        console.log("Value: ",i, value, result);
        if (!result) {
            ok = false;
            //$cell.addClass('redBorder');
            $cell.css("background", "lightpink");
        } else {
            valueArray[i] = value;
            //$cell.removeClass('redBorder');
            $cell.css("background", "white");
        }
    }
    
    console.log("Result is: ", ok, valueArray);
     if (!ok) {
         console.log("Not OK", ok);
         $errors.append(H5PEditor.createError(t("wrongDegrees")));
         return false;
     } else {
            return valueArray;
     }
    
    return false; // for any case, if arrrives here

    }

    /**
     * Remove field.
     *
     * @public
     */
    self.remove = function () {
      $item.remove();
    };

    init();
  }

  /**
   * Retrieve local translation.
   *
   * @private
   * @param {String} key
   * @param {Object} [placeholders]
   * @returns {String}
   */
  const t = function (key, placeholders) {
    return H5PEditor.t('H5PEditor.DegreeInput', key, placeholders);
  };

  /**
   * Retrieve core translation.
   *
   * @private
   * @param {String} key
   * @param {Object} [placeholders]
   * @returns {String}
   */
  const ct = function (key, placeholders) {
    return H5PEditor.t('core', key, placeholders);
  };

  return Timecode;
})(H5P.jQuery);
