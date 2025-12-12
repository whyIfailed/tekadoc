// document$.subscribe(function() {
//   if (typeof lunr !== 'undefined') {
//     var normalize = function (token) {
//       // Create a map of special character replacements
//       const replacements = {
//         'đ': 'd', 
//         'Đ': 'D',
//         'ă':'a',
//         'á':'a',
//         'à':'a',
//         'â':'a',
//         'ã':'a',
//         'ả':'a',
//         'ặ':'a',
//         'ắ':'a',
//         // This is the core replacement. NFD splits compound characters,
//         // and the regex removes the combining diacritics.
//         // It's already doing most of the heavy lifting.
//       };

//       // Perform a function that handles normalization for all characters
//       return token.toString()
//         .replace(/./g, function(char) {
//           // Check if the character is a special case (like 'đ') and replace it
//           return replacements[char] || char;
//         })
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "");
//     };

//     // Ensure the normalization function is only added once to the pipeline
//     if (lunr.trimmer.pipeline.indexOf(normalize) === -1) {
//       lunr.Pipeline.registerFunction(normalize, 'normalize');
//       lunr.trimmer.pipeline.unshift(normalize);
//       console.log("Lunr.js normalization pipeline updated for Vietnamese.");
//     }
//   }
// });

// docs/javascripts/custom.js
(function() {
  // Ensure we wait for the Material for MkDocs document initialization
  document$.subscribe(function() {
    if (typeof lunr !== 'undefined') {
      // Define the Vietnamese normalization function
      var normalizeVietnamese = function(token) {
        const replacements = {
          'đ': 'd', 'Đ': 'D',
          
          'ă':'a','ắ':'a','ằ':'a','ẵ':'a','ẳ':'a','ặ':'a',
          'á':'a','à':'a','ã':'a','ả':'a','ạ':'a',
          'â':'a', 'ấ':'a','ầ':'a','ẫ':'a','ẩ':'a','ậ':'a',
          'é':'e','è':'e','ẽ':'e','ẻ':'e','ẹ':'e',
        'ê':'e','ế':'e','ề':'e','ễ':'e','ể':'e','ệ':'e',
        'í':'i','ì':'i','ĩ':'i','ỉ':'i','ị':'i',
        'ó':'o','ò':'o','õ':'o','ỏ':'o','ọ':'o',
        'ớ':'o','ờ':'o','ỡ':'o','ở':'o','ợ':'o',
        'ố':'o','ồ':'o','ỗ':'o','ổ':'o','ộ':'o',
        'ú':'u','ù':'u','ũ':'u','ủ':'u','ụ':'u',
        'ứ':'u','ừ':'u','ữ':'u','ử':'u','ự':'u',
        'ý':'y','ỳ':'y','ỹ':'y','ỷ':'y','ỵ':'y',

        };
        let result = token.toString().toLowerCase();
        for (const [key, value] of Object.entries(replacements)) {
          result = result.replace(new RegExp(key, 'g'), value);
        }
        result = result.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
        return new lunr.Token(result);
      };

      // Define a custom tokenizer that uses our normalization function
      var vietnameseTokenizer = function(obj) {
        if (obj == null || obj == undefined) {
          return []
        }
        var str = obj.toString()
        var tokens = str.split(/[\s-]+/) // Split by spaces and hyphens
        return tokens.map(function (token) {
          return normalizeVietnamese(new lunr.Token(token));
        })
      };

      // Check if our custom function is already in the pipeline
      if (lunr.trimmer.pipeline.indexOf(normalizeVietnamese) === -1) {
        lunr.Pipeline.registerFunction(normalizeVietnamese, 'normalizeVietnamese');
        
        // This is the key change: override the main tokenizer
        // used by the search index build process.
        lunr.tokenizer = vietnameseTokenizer;

        console.log("Lunr.js tokenizer replaced for Vietnamese normalization.");
      }
    }
  });
})();
