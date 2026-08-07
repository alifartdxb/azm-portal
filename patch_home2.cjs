const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  'import { ArrowRight, Download, Droplet, CheckCircle, MapPin, Beaker, ShieldCheck, Mail, ArrowUpRight, ChevronLeft, ChevronRight, Quote, MessageCircle, FileText, Settings, Layers, Zap, User, Search, Play, Pause, Search as SearchIcon, Plus, Minus } from "lucide-react";',
  'import { ArrowRight, Download, Droplet, CheckCircle, MapPin, Beaker, ShieldCheck, Mail, ArrowUpRight, ChevronLeft, ChevronRight, Quote, MessageCircle, FileText, Settings, Layers, Zap, User, Search, Play, Pause, Search as SearchIcon, Plus, Minus, Users, Phone } from "lucide-react";'
);

fs.writeFileSync('src/pages/Home.tsx', content);
