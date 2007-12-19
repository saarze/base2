
var DOM = new base2.Package(this, {
  name:    "DOM",
  version: "1.0 (beta 1)",
  exports:
    "Interface,Binding,Node,Document,Element,AbstractView,HTMLDocument,HTMLElement,"+
    "Selector,Traversal,XPathParser,NodeSelector,DocumentSelector,ElementSelector,"+
    "StaticNodeList,Event,EventTarget,DocumentEvent,ViewCSS,CSSStyleDeclaration",
  
  bind: function(node) {
    // Apply a base2 DOM Binding to a native DOM node.
    if (node && node.nodeType) {
      var uid = assignID(node);
      if (!DOM.bind[uid]) {
        switch (node.nodeType) {
          case 1: // Element
            if (typeof node.className == "string") {
              // It's an HTML element, so use bindings based on tag name.
              (HTMLElement.bindings[node.tagName] || HTMLElement).bind(node);
            } else {
              Element.bind(node);
            }
            break;
          case 9: // Document
            if (node.writeln) {
              HTMLDocument.bind(node);
            } else {
              Document.bind(node);
            }
            break;
          default:
            Node.bind(node);
        }
        DOM.bind[uid] = true;
      }
    }
    return node;
  },
  
  "@MSIE5.+win": {  
    bind: function(node) {
      if (node && node.writeln) {
        node.nodeType = 9;
      }
      return this.base(node);
    }
  }
});

eval(this.imports);

var _MSIE = detect("MSIE");
var _MSIE5 = detect("MSIE5");
