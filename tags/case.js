var Liquid = require('..');
var lexical = Liquid.lexical;
var caseRE = new RegExp(`^\\s*case\\s+(${lexical.value.source})`);
var whenRE = new RegExp(`^\\s*when\\s+(${lexical.value.source})`);

module.exports = function(liquid) {

    liquid.registerTag('case', {
        needClose: true,
        render: function(tokens, scope, token, hash) {
            var match = token.value.match(caseRE);
            var cond = liquid.evaluate(match[1], scope);

            var partialTokens = [],
                matching = false;
            for (var i = 0; i < tokens.length; i++) {
                var tk = tokens[i];
                if (tk.type === 'tag' && tk.name === 'when') {
                    if (matching) break;
                    match = tk.value.match(whenRE);
                    if(!match) continue;

                    var val = liquid.evaluate(match[1], scope);
                    if (val === cond) matching = true;
                } else if (tk.type === 'tag' && tk.name === 'else') {
                    if (matching) break;
                    else matching = true;
                } else if (matching) partialTokens.push(tk);
            }

            return liquid.renderTokens(partialTokens, scope);
        }
    });
};