// formatHTML.js
import prettier from 'prettier';

// Function to format HTML
export function formatHTML(htmlString) {
  return prettier.format(htmlString, {
    parser: "html",
    tabWidth: 2,
    useTabs: false,
    printWidth: 80,
    htmlWhitespaceSensitivity: "ignore",
  });
}
