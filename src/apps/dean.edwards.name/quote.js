
var ATTRIBUTE = /(\w+)=([^"'\s]+)/g;
var QUOTE = '<blockquote cite="#%1">\n%3\n<address>' +
  '<a href="#%1" rel="bookmark">%2</a></address>\n</blockquote>';
var TIDY = new RegGrp({
  "(<\\/?)(\\w+)([^>]*)": function($, lt, tagName, attributes) {
    return lt + tagName.toLowerCase() + attributes.replace(ATTRIBUTE, function($, attribute, value) {
      return attribute.toLowerCase() + '"' + value + '"';
    });
  },
  "&nbsp;": " "
});

bindings.add("li.comment:not(.disabled)", {
  ondocumentready: function() {
    // create the <button> element
    var comment = this;
    var button = document.createElement("button");
    Traversal.setTextContent(button, "Quote");
    comment.appendChild(button);
    button.onclick = function() {
      var textarea = document.querySelector("textarea");
      var id = comment.id;
      var cite = comment.querySelector("cite:last-child");
      var author = Traversal.getTextContent(cite) || "comment #" + id;
      // tidy the WordPress formatted text
      author = author.replace(/(^\s*comment(\s+by)?\s)|(\s\W\s.*$)/gi, "");
      // grab text text selection (if any)
      var selectedText = "";
      if (window.getSelection) {
        selectedText = String(window.getSelection());
      } else if (document.selection) {
        selectedText = document.selection.createRange().text;
      }
      if (selectedText) {
        // use the selected text
        var quote = "<p>" + trim(selectedText) + "</p>";
      } else {
        // grab the entire comment's html
        var text = comment.querySelector("div.comment-text").cloneNode(true);
        // strip syntax-highlighting
        forEach (Element.querySelectorAll(text, "pre"), function(pre) {
          Traversal.setTextContent(pre, pre.getAttribute("originalText"));
          pre.removeAttribute("originalText");
          pre.removeAttribute("style");
          pre.removeAttribute("base2ID");
        });
        // remove smilies
        forEach (Element.querySelectorAll(text, "img"), function(img) {
          img.parentNode.replaceChild(document.createTextNode(img.alt), img);
        });
        // tidy the html
        quote = trim(TIDY.exec(text.innerHTML));
      }
      // create <blockquote> html
      var html = format(QUOTE, id, author, quote);
      // update the comment form
      textarea.value = trim(textarea.value + "\n" + html);
      textarea.focus();
    };
  },
  
  onmouseover: function() {
    this.querySelector("button").style.visibility = "visible";
  },
  
  onmouseout: function() {
    this.querySelector("button").style.visibility = "";
  }
});
