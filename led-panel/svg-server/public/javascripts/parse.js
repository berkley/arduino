
function quote(s) {
  /*
   * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
   * string literal except for the closing quote character, backslash,
   * carriage return, line separator, paragraph separator, and line feed.
   * Any character may appear in the form of an escape sequence.
   *
   * For portability, we also escape escape all control and non-ASCII
   * characters. Note that "\0" and "\v" escape sequences are not used
   * because JSHint does not like the first and IE the second.
   */
   return '"' + s
    .replace(/\\/g, '\\\\')  // backslash
    .replace(/"/g, '\\"')    // closing quote character
    .replace(/\x08/g, '\\b') // backspace
    .replace(/\t/g, '\\t')   // horizontal tab
    .replace(/\n/g, '\\n')   // line feed
    .replace(/\f/g, '\\f')   // form feed
    .replace(/\r/g, '\\r')   // carriage return
    .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
    + '"';
}

var svgParser = {
  /*
   * Parses the input with a generated parser. If the parsing is successfull,
   * returns a value explicitly or implicitly specified by the grammar from
   * which the parser was generated (see |PEG.buildParser|). If the parsing is
   * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
   */
  parse: function(input, startRule) {
    var parseFunctions = {
      "svg_path": parse_svg_path,
      "moveTo_drawTo_commandGroups": parse_moveTo_drawTo_commandGroups,
      "moveTo_drawTo_commandGroup": parse_moveTo_drawTo_commandGroup,
      "drawto_commands": parse_drawto_commands,
      "drawto_command": parse_drawto_command,
      "moveto": parse_moveto,
      "moveto_argument_sequence": parse_moveto_argument_sequence,
      "closepath": parse_closepath,
      "lineto": parse_lineto,
      "lineto_argument_sequence": parse_lineto_argument_sequence,
      "horizontal_lineto": parse_horizontal_lineto,
      "coordinate_sequence": parse_coordinate_sequence,
      "vertical_lineto": parse_vertical_lineto,
      "curveto": parse_curveto,
      "curveto_argument_sequence": parse_curveto_argument_sequence,
      "curveto_argument": parse_curveto_argument,
      "smooth_curveto": parse_smooth_curveto,
      "smooth_curveto_argument_sequence": parse_smooth_curveto_argument_sequence,
      "smooth_curveto_argument": parse_smooth_curveto_argument,
      "quadratic_bezier_curveto": parse_quadratic_bezier_curveto,
      "quadratic_bezier_curveto_argument_sequence": parse_quadratic_bezier_curveto_argument_sequence,
      "quadratic_bezier_curveto_argument": parse_quadratic_bezier_curveto_argument,
      "smooth_quadratic_bezier_curveto": parse_smooth_quadratic_bezier_curveto,
      "smooth_quadratic_bezier_curveto_argument_sequence": parse_smooth_quadratic_bezier_curveto_argument_sequence,
      "elliptical_arc": parse_elliptical_arc,
      "elliptical_arc_argument_sequence": parse_elliptical_arc_argument_sequence,
      "elliptical_arc_argument": parse_elliptical_arc_argument,
      "coordinate_pair": parse_coordinate_pair,
      "coordinate": parse_coordinate,
      "nonnegative_number": parse_nonnegative_number,
      "number": parse_number,
      "flag": parse_flag,
      "comma_wsp": parse_comma_wsp,
      "comma": parse_comma,
      "floating_point_constant": parse_floating_point_constant,
      "fractional_constant": parse_fractional_constant,
      "exponent": parse_exponent,
      "sign": parse_sign,
      "digit_sequence": parse_digit_sequence,
      "wsp": parse_wsp
    };
    
    if (startRule !== undefined) {
      if (parseFunctions[startRule] === undefined) {
        throw new Error("Invalid rule name: " + quote(startRule) + ".");
      }
    } else {
      startRule = "svg_path";
    }
    
    var pos = 0;
    var reportFailures = 0;
    var rightmostFailuresPos = 0;
    var rightmostFailuresExpected = [];
    
    function padLeft(input, padding, length) {
      var result = input;
      
      var padLength = length - input.length;
      for (var i = 0; i < padLength; i++) {
        result = padding + result;
      }
      
      return result;
    }
    
    function escape(ch) {
      var charCode = ch.charCodeAt(0);
      var escapeChar;
      var length;
      
      if (charCode <= 0xFF) {
        escapeChar = 'x';
        length = 2;
      } else {
        escapeChar = 'u';
        length = 4;
      }
      
      return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
    }
    
    function matchFailed(failure) {
      if (pos < rightmostFailuresPos) {
        return;
      }
      
      if (pos > rightmostFailuresPos) {
        rightmostFailuresPos = pos;
        rightmostFailuresExpected = [];
      }
      
      rightmostFailuresExpected.push(failure);
    }
    
    function parse_svg_path() {
      var result0, result1, result2, result3;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      result0 = [];
      result1 = parse_wsp();
      while (result1 !== null) {
        result0.push(result1);
        result1 = parse_wsp();
      }
      if (result0 !== null) {
        result1 = parse_moveTo_drawTo_commandGroups();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = [];
          result3 = parse_wsp();
          while (result3 !== null) {
            result2.push(result3);
            result3 = parse_wsp();
          }
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, data) {
          var result = [];
          function flatten(a){
            for (var i=0,l=a.length;i<l;++i){
              var o=a[i];
              if (o.constructor==Array) flatten(o);
              else if (o && o!=" ") result.push(o);
            }
          }
          flatten(data);
          return result;
        })(pos0, result0[1]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_moveTo_drawTo_commandGroups() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      result0 = parse_moveTo_drawTo_commandGroup();
      if (result0 !== null) {
        pos1 = pos;
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_moveTo_drawTo_commandGroups();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos1;
          }
        } else {
          result1 = null;
          pos = pos1;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos0;
        }
      } else {
        result0 = null;
        pos = pos0;
      }
      return result0;
    }
    
    function parse_moveTo_drawTo_commandGroup() {
      var result0, result1, result2;
      var pos0;
      
      pos0 = pos;
      result0 = parse_moveto();
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_drawto_commands();
          result2 = result2 !== null ? result2 : "";
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
      } else {
        result0 = null;
        pos = pos0;
      }
      return result0;
    }
    
    function parse_drawto_commands() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      result0 = parse_drawto_command();
      if (result0 !== null) {
        pos1 = pos;
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_drawto_commands();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos1;
          }
        } else {
          result1 = null;
          pos = pos1;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos0;
        }
      } else {
        result0 = null;
        pos = pos0;
      }
      return result0;
    }
    
    function parse_drawto_command() {
      var result0;
      
      result0 = parse_closepath();
      if (result0 === null) {
        result0 = parse_lineto();
        if (result0 === null) {
          result0 = parse_horizontal_lineto();
          if (result0 === null) {
            result0 = parse_vertical_lineto();
            if (result0 === null) {
              result0 = parse_curveto();
              if (result0 === null) {
                result0 = parse_smooth_curveto();
                if (result0 === null) {
                  result0 = parse_quadratic_bezier_curveto();
                  if (result0 === null) {
                    result0 = parse_smooth_quadratic_bezier_curveto();
                    if (result0 === null) {
                      result0 = parse_elliptical_arc();
                    }
                  }
                }
              }
            }
          }
        }
      }
      return result0;
    }
    
    function parse_moveto() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      if (/^[Mm]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Mm]");
        }
      }
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_moveto_argument_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, c, wsp, seq) { return {command:"moveto", relative:c=='m', args:seq} })(pos0, result0[0], result0[1], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_moveto_argument_sequence() {
      var result0, result1, result2;
      var pos0, pos1, pos2;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_coordinate_pair();
      if (result0 !== null) {
        pos2 = pos;
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_lineto_argument_sequence();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos2;
          }
        } else {
          result1 = null;
          pos = pos2;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, first, more) { for (var a=[first],i=1,len=more.length;i<len;++i){ a[i]=more[i][0] }; return a; })(pos0, result0[0], result0[1]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_closepath() {
      var result0;
      var pos0;
      
      pos0 = pos;
      if (/^[Zz]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Zz]");
        }
      }
      if (result0 !== null) {
        result0 = (function(offset) { return {command:"closepath" } })(pos0);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_lineto() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      if (/^[Ll]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Ll]");
        }
      }
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_lineto_argument_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, c, args) { return {command:"lineto", relative:c=='l', args:args} })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_lineto_argument_sequence() {
      var result0, result1, result2;
      var pos0, pos1, pos2;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_coordinate_pair();
      if (result0 !== null) {
        pos2 = pos;
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_lineto_argument_sequence();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos2;
          }
        } else {
          result1 = null;
          pos = pos2;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, first, more) { for (var a=[first],i=1,len=more.length;i<len;++i){ a[i]=more[i][0] }; return a; })(pos0, result0[0], result0[1]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_horizontal_lineto() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      if (/^[Hh]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Hh]");
        }
      }
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_coordinate_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, c, args) { return {command:"horizontal lineto", relative:c=='h', args:args} })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_coordinate_sequence() {
      var result0, result1, result2;
      var pos0, pos1, pos2;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_coordinate();
      if (result0 !== null) {
        pos2 = pos;
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_coordinate_sequence();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos2;
          }
        } else {
          result1 = null;
          pos = pos2;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, first, more) { for (var a=[first],i=1,len=more.length;i<len;++i){ a[i]=more[i][0] }; return a; })(pos0, result0[0], result0[1]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_vertical_lineto() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      if (/^[Vv]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Vv]");
        }
      }
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_coordinate_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, c, args) { return {command:"vertical lineto", relative:c=='v', args:args} })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_curveto() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      if (/^[Cc]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Cc]");
        }
      }
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_curveto_argument_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, c, args) { return {command:"curveto", relative:c=='c', args:args} })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_curveto_argument_sequence() {
      var result0, result1, result2;
      var pos0, pos1, pos2;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_curveto_argument();
      if (result0 !== null) {
        pos2 = pos;
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_curveto_argument_sequence();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos2;
          }
        } else {
          result1 = null;
          pos = pos2;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, first, more) { for (var a=[first],i=1,len=more.length;i<len;++i){ a[i]=more[i][0] }; return a; })(pos0, result0[0], result0[1]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_curveto_argument() {
      var result0, result1, result2, result3, result4;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_coordinate_pair();
      if (result0 !== null) {
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_coordinate_pair();
          if (result2 !== null) {
            result3 = parse_comma_wsp();
            result3 = result3 !== null ? result3 : "";
            if (result3 !== null) {
              result4 = parse_coordinate_pair();
              if (result4 !== null) {
                result0 = [result0, result1, result2, result3, result4];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, a, b, c) { return { x1:a.x, y1:a.y, x2:b.x, y2:b.y, x:c.x, y:c.y } })(pos0, result0[0], result0[2], result0[4]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_smooth_curveto() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      if (/^[Ss]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Ss]");
        }
      }
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_smooth_curveto_argument_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, c, args) { return {command:"smooth curveto", relative:c=='s', args:args} })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_smooth_curveto_argument_sequence() {
      var result0, result1, result2;
      var pos0, pos1, pos2;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_smooth_curveto_argument();
      if (result0 !== null) {
        pos2 = pos;
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_smooth_curveto_argument_sequence();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos2;
          }
        } else {
          result1 = null;
          pos = pos2;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, first, more) { for (var a=[first],i=1,len=more.length;i<len;++i){ a[i]=more[i][0] }; return a; })(pos0, result0[0], result0[1]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_smooth_curveto_argument() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_coordinate_pair();
      if (result0 !== null) {
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_coordinate_pair();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, b, c) { return { x2:b.x, y2:b.y, x:c.x, y:c.y } })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_quadratic_bezier_curveto() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      if (/^[Qq]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Qq]");
        }
      }
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_quadratic_bezier_curveto_argument_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, c, args) { return {command:"quadratic curveto", relative:c=='q', args:args} })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_quadratic_bezier_curveto_argument_sequence() {
      var result0, result1, result2;
      var pos0, pos1, pos2;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_quadratic_bezier_curveto_argument();
      if (result0 !== null) {
        pos2 = pos;
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_quadratic_bezier_curveto_argument_sequence();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos2;
          }
        } else {
          result1 = null;
          pos = pos2;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, first, more) { for (var a=[first],i=1,len=more.length;i<len;++i){ a[i]=more[i][0] }; return a; })(pos0, result0[0], result0[1]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_quadratic_bezier_curveto_argument() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_coordinate_pair();
      if (result0 !== null) {
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_coordinate_pair();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, a, b) { return { x1:a.x, y1:a.y, x:b.x, y:b.y } })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_smooth_quadratic_bezier_curveto() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      if (/^[Tt]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Tt]");
        }
      }
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_smooth_quadratic_bezier_curveto_argument_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, c, args) { return {command:"smooth quadratic curveto", relative:c=='t', args:args} })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_smooth_quadratic_bezier_curveto_argument_sequence() {
      var result0, result1, result2;
      var pos0, pos1, pos2;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_coordinate_pair();
      if (result0 !== null) {
        pos2 = pos;
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_smooth_quadratic_bezier_curveto_argument_sequence();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos2;
          }
        } else {
          result1 = null;
          pos = pos2;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, first, more) { for (var a=[first],i=1,len=more.length;i<len;++i){ a[i]=more[i][0] }; return a; })(pos0, result0[0], result0[1]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_elliptical_arc() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      if (/^[Aa]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[Aa]");
        }
      }
      if (result0 !== null) {
        result1 = [];
        result2 = parse_wsp();
        while (result2 !== null) {
          result1.push(result2);
          result2 = parse_wsp();
        }
        if (result1 !== null) {
          result2 = parse_elliptical_arc_argument_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, c, args) { return {command:"elliptical arc", relative:c=='a', args:args} })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_elliptical_arc_argument_sequence() {
      var result0, result1, result2;
      var pos0, pos1, pos2;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_elliptical_arc_argument();
      if (result0 !== null) {
        pos2 = pos;
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_elliptical_arc_argument_sequence();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos2;
          }
        } else {
          result1 = null;
          pos = pos2;
        }
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, first, more) { for (var a=[first],i=1,len=more.length;i<len;++i){ a[i]=more[i][0] }; return a; })(pos0, result0[0], result0[1]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_elliptical_arc_argument() {
      var result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_nonnegative_number();
      if (result0 !== null) {
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_nonnegative_number();
          if (result2 !== null) {
            result3 = parse_comma_wsp();
            result3 = result3 !== null ? result3 : "";
            if (result3 !== null) {
              result4 = parse_number();
              if (result4 !== null) {
                result5 = parse_comma_wsp();
                if (result5 !== null) {
                  result6 = parse_flag();
                  if (result6 !== null) {
                    result7 = parse_comma_wsp();
                    result7 = result7 !== null ? result7 : "";
                    if (result7 !== null) {
                      result8 = parse_flag();
                      if (result8 !== null) {
                        result9 = parse_comma_wsp();
                        result9 = result9 !== null ? result9 : "";
                        if (result9 !== null) {
                          result10 = parse_coordinate_pair();
                          if (result10 !== null) {
                            result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10];
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, rx, ry, xrot, large, sweep, xy) { return { rx:rx, ry:ry, xAxisRotation:xrot.join('')*1, largeArc:large=='1', sweep:sweep=='1', x:xy.x, y:xy.y } })(pos0, result0[0], result0[2], result0[4], result0[6], result0[8], result0[10]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_coordinate_pair() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      pos1 = pos;
      result0 = parse_coordinate();
      if (result0 !== null) {
        result1 = parse_comma_wsp();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_coordinate();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
      } else {
        result0 = null;
        pos = pos1;
      }
      if (result0 !== null) {
        result0 = (function(offset, x, y) { return { x:x, y:y } })(pos0, result0[0], result0[2]);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_coordinate() {
      var result0;
      var pos0;
      
      pos0 = pos;
      result0 = parse_number();
      if (result0 !== null) {
        result0 = (function(offset, n) { return n.join('')*1 })(pos0, result0);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_nonnegative_number() {
      var result0;
      
      result0 = parse_floating_point_constant();
      if (result0 === null) {
        result0 = parse_digit_sequence();
      }
      return result0;
    }
    
    function parse_number() {
      var result0, result1;
      var pos0;
      
      pos0 = pos;
      result0 = parse_sign();
      result0 = result0 !== null ? result0 : "";
      if (result0 !== null) {
        result1 = parse_floating_point_constant();
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos0;
        }
      } else {
        result0 = null;
        pos = pos0;
      }
      if (result0 === null) {
        pos0 = pos;
        result0 = parse_sign();
        result0 = result0 !== null ? result0 : "";
        if (result0 !== null) {
          result1 = parse_digit_sequence();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
      }
      return result0;
    }
    
    function parse_flag() {
      var result0;
      
      if (input.charCodeAt(pos) === 48) {
        result0 = "0";
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("\"0\"");
        }
      }
      if (result0 === null) {
        if (input.charCodeAt(pos) === 49) {
          result0 = "1";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"1\"");
          }
        }
      }
      return result0;
    }
    
    function parse_comma_wsp() {
      var result0, result1, result2, result3;
      var pos0;
      
      pos0 = pos;
      result1 = parse_wsp();
      if (result1 !== null) {
        result0 = [];
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_wsp();
        }
      } else {
        result0 = null;
      }
      if (result0 !== null) {
        result1 = parse_comma();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = [];
          result3 = parse_wsp();
          while (result3 !== null) {
            result2.push(result3);
            result3 = parse_wsp();
          }
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
      } else {
        result0 = null;
        pos = pos0;
      }
      if (result0 === null) {
        pos0 = pos;
        result0 = parse_comma();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_wsp();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_wsp();
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
      }
      return result0;
    }
    
    function parse_comma() {
      var result0;
      
      if (input.charCodeAt(pos) === 44) {
        result0 = ",";
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("\",\"");
        }
      }
      return result0;
    }
    
    function parse_floating_point_constant() {
      var result0, result1;
      var pos0;
      
      pos0 = pos;
      result0 = parse_fractional_constant();
      if (result0 !== null) {
        result1 = parse_exponent();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result0 = [result0, result1];
        } else {
          result0 = null;
          pos = pos0;
        }
      } else {
        result0 = null;
        pos = pos0;
      }
      if (result0 === null) {
        pos0 = pos;
        result0 = parse_digit_sequence();
        if (result0 !== null) {
          result1 = parse_exponent();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
      }
      return result0;
    }
    
    function parse_fractional_constant() {
      var result0, result1, result2;
      var pos0, pos1;
      
      pos0 = pos;
      result0 = parse_digit_sequence();
      result0 = result0 !== null ? result0 : "";
      if (result0 !== null) {
        if (input.charCodeAt(pos) === 46) {
          result1 = ".";
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("\".\"");
          }
        }
        if (result1 !== null) {
          result2 = parse_digit_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
      } else {
        result0 = null;
        pos = pos0;
      }
      if (result0 === null) {
        pos0 = pos;
        pos1 = pos;
        result0 = parse_digit_sequence();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 46) {
            result1 = ".";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\".\"");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "hi" })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
      }
      return result0;
    }
    
    function parse_exponent() {
      var result0, result1, result2;
      var pos0;
      
      pos0 = pos;
      if (/^[eE]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[eE]");
        }
      }
      if (result0 !== null) {
        result1 = parse_sign();
        result1 = result1 !== null ? result1 : "";
        if (result1 !== null) {
          result2 = parse_digit_sequence();
          if (result2 !== null) {
            result0 = [result0, result1, result2];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
      } else {
        result0 = null;
        pos = pos0;
      }
      return result0;
    }
    
    function parse_sign() {
      var result0;
      
      if (input.charCodeAt(pos) === 43) {
        result0 = "+";
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("\"+\"");
        }
      }
      if (result0 === null) {
        if (input.charCodeAt(pos) === 45) {
          result0 = "-";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"-\"");
          }
        }
      }
      return result0;
    }
    
    function parse_digit_sequence() {
      var result0, result1;
      var pos0;
      
      pos0 = pos;
      if (/^[0-9]/.test(input.charAt(pos))) {
        result1 = input.charAt(pos);
        pos++;
      } else {
        result1 = null;
        if (reportFailures === 0) {
          matchFailed("[0-9]");
        }
      }
      if (result1 !== null) {
        result0 = [];
        while (result1 !== null) {
          result0.push(result1);
          if (/^[0-9]/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[0-9]");
            }
          }
        }
      } else {
        result0 = null;
      }
      if (result0 !== null) {
        result0 = (function(offset, digits) { return digits.join("")*1 })(pos0, result0);
      }
      if (result0 === null) {
        pos = pos0;
      }
      return result0;
    }
    
    function parse_wsp() {
      var result0;
      
      if (/^[ \t\n\r]/.test(input.charAt(pos))) {
        result0 = input.charAt(pos);
        pos++;
      } else {
        result0 = null;
        if (reportFailures === 0) {
          matchFailed("[ \\t\\n\\r]");
        }
      }
      return result0;
    }
    
    
    function cleanupExpected(expected) {
      expected.sort();
      
      var lastExpected = null;
      var cleanExpected = [];
      for (var i = 0; i < expected.length; i++) {
        if (expected[i] !== lastExpected) {
          cleanExpected.push(expected[i]);
          lastExpected = expected[i];
        }
      }
      return cleanExpected;
    }
    
    function computeErrorPosition() {
      /*
       * The first idea was to use |String.split| to break the input up to the
       * error position along newlines and derive the line and column from
       * there. However IE's |split| implementation is so broken that it was
       * enough to prevent it.
       */
      
      var line = 1;
      var column = 1;
      var seenCR = false;
      
      for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
        var ch = input.charAt(i);
        if (ch === "\n") {
          if (!seenCR) { line++; }
          column = 1;
          seenCR = false;
        } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
          line++;
          column = 1;
          seenCR = true;
        } else {
          column++;
          seenCR = false;
        }
      }
      
      return { line: line, column: column };
    }
    
    
    var result = parseFunctions[startRule]();
    
    /*
     * The parser is now in one of the following three states:
     *
     * 1. The parser successfully parsed the whole input.
     *
     *    - |result !== null|
     *    - |pos === input.length|
     *    - |rightmostFailuresExpected| may or may not contain something
     *
     * 2. The parser successfully parsed only a part of the input.
     *
     *    - |result !== null|
     *    - |pos < input.length|
     *    - |rightmostFailuresExpected| may or may not contain something
     *
     * 3. The parser did not successfully parse any part of the input.
     *
     *   - |result === null|
     *   - |pos === 0|
     *   - |rightmostFailuresExpected| contains at least one failure
     *
     * All code following this comment (including called functions) must
     * handle these states.
     */
    if (result === null || pos !== input.length) {
      var offset = Math.max(pos, rightmostFailuresPos);
      var found = offset < input.length ? input.charAt(offset) : null;
      var errorPosition = computeErrorPosition();
      
      throw new this.SyntaxError(
        cleanupExpected(rightmostFailuresExpected),
        found,
        offset,
        errorPosition.line,
        errorPosition.column
      );
    }
    
    return result;
  },
  
  /* Returns the parser source code. */
  toSource: function() { return this._source; }
};

/* Thrown when a parser encounters a syntax error. */

svgParser.SyntaxError = function(expected, found, offset, line, column) {
  function buildMessage(expected, found) {
    var expectedHumanized, foundHumanized;
    
    switch (expected.length) {
      case 0:
        expectedHumanized = "end of input";
        break;
      case 1:
        expectedHumanized = expected[0];
        break;
      default:
        expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
          + " or "
          + expected[expected.length - 1];
    }
    
    foundHumanized = found ? quote(found) : "end of input";
    
    return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
  }
  
  this.name = "SyntaxError";
  this.expected = expected;
  this.found = found;
  this.message = buildMessage(expected, found);
  this.offset = offset;
  this.line = line;
  this.column = column;
};

svgParser.SyntaxError.prototype = Error.prototype;
