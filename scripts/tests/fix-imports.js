const fs = require('fs');
const path = require('path');

const files = [
    'src/app/api/admin/chats/[id]/accept/route.ts',
    'src/app/api/admin/chats/[id]/close/route.ts',
    'src/app/api/admin/chats/[id]/messages/route.ts',
    'src/app/api/admin/chats/[id]/route.ts',
    'src/app/api/admin/chats/route.ts',
    'src/app/api/chat/messages/route.ts',
    'src/app/api/chat/session/[id]/route.ts',
    'src/app/api/leads/route.ts'
];

files.forEach(file => {
    const p = path.join(__dirname, file);
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/import prisma from ["']@\/lib\/prisma["'];/g, 'import { prisma } from "@/lib/prisma";');
        fs.writeFileSync(p, content);
        console.log('Fixed', file);
    } else {
        console.log('Not found', file);
    }
});
