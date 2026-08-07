const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const roleLogic = `
        try {
          if (currentUser.email === 'alifartdxb@gmail.com') {
            setRole('super_admin');
            setStatus('active');
          } else {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setRole(data.role);
              setStatus(data.status || 'active');
            } else {
              setRole('viewer'); // default role
              setStatus('active');
            }
          }
`;

code = code.replace(`
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role);
            setStatus(data.status || 'active');
          } else {
            setRole('viewer'); // default role
            setStatus('active');
          }
`, roleLogic.trim());

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
