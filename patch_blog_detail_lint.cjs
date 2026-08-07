const fs = require('fs');
let code = fs.readFileSync('src/pages/BlogDetail.tsx', 'utf8');

// Move post declaration up
const postDecl = code.match(/const post = {[\s\S]*?};\n/)[0];
code = code.replace(postDecl, '');
code = code.replace("const activePost = dbPost || post;", postDecl + "\n  const activePost = dbPost || post;");
code = code.replace("b.slug", "(b as any).slug");

fs.writeFileSync('src/pages/BlogDetail.tsx', code);
