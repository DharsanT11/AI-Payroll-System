const fs = require('fs');

['EmpReimbursements/EmpReimbursements.tsx', 'EmpLoans/EmpLoans.tsx', 'EmpProfile/EmpProfile.tsx'].forEach(file => {
  const path = 'src/pages/employee/' + file;
  let text = fs.readFileSync(path, 'utf8');
  
  text = text.replace(/fontSize:\s*'(\d+)px'/g, (match, size) => {
    let s = parseInt(size, 10);
    if (s >= 32) s = s - 8;
    else if (s >= 24) s = s - 4;
    else if (s >= 18) s = s - 2;
    else if (s >= 14) s = s - 1;
    else if (s === 13) s = 12;
    else if (s === 12) s = 11;
    return `fontSize: '${s}px'`;
  });
  
  text = text.replace(/fontSize:\s+([0-9]+)\b/g, (match, size) => {
    let s = parseInt(size, 10);
    if (s >= 32) s = s - 8;
    else if (s >= 24) s = s - 4;
    else if (s >= 18) s = s - 2;
    else if (s >= 14) s = s - 1;
    else if (s === 13) s = 12;
    else if (s === 12) s = 11;
    return `fontSize: ${s}`;
  });
  
  fs.writeFileSync(path, text, 'utf8');
  console.log('Processed', file);
});
