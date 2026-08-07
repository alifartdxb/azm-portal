import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminLayout.tsx', 'utf8');

const oldImports = `} from "lucide-react";`;
const newImports = `  Layers,
  Sliders,
  LayoutGrid,
  PenTool,
  Image,
  Video,
  MessageSquare,
  HelpCircle,
  Download,
  FileSignature,
  Calendar,
  Store,
  UserCog,
  Mail,
  MenuSquare,
  Plug,
  History,
  Database,
  LinkIcon,
  BarChart,
} from "lucide-react";`;

content = content.replace(oldImports, newImports);

// Fix MenuSquare which might not exist in older versions, use Menu if so.
// Let's just try this first.
fs.writeFileSync('src/pages/admin/AdminLayout.tsx', content);
