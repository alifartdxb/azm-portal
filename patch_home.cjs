const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Fix Product type errors
content = content.replace(/product\.mainImage/g, "(product.images?.[0] || product.thumbnail || 'https://placehold.co/400')");
content = content.replace(/product\.brand/g, "(BRANDS_DATA.find(b => b.id === product.brandId)?.name || 'Unknown Brand')");
content = content.replace(/import \{ ArrowRight, Download, Droplet, CheckCircle, MapPin, Beaker, ShieldCheck, Mail, ArrowUpRight, ChevronLeft, ChevronRight, Quote, MessageCircle, FileText, Settings, Layers, Zap, User, Search, Play, Pause, Search as SearchIcon, Plus, Minus, Users, Phone \} from "lucide-react";/, 'import { ArrowRight, Download, Droplet, CheckCircle, MapPin, Beaker, ShieldCheck, Mail, ArrowUpRight, ChevronLeft, ChevronRight, Quote, MessageCircle, FileText, Settings, Layers, Zap, User, Search, Play, Pause, Search as SearchIcon, Plus, Minus, Users, Phone } from "lucide-react";');

fs.writeFileSync('src/pages/Home.tsx', content);
