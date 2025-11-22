'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types';
import { Building2, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ClientCardProps {
  client: Client;
  index?: number;
}

export function ClientCard({ client, index = 0 }: ClientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/clients/${client.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full group">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
              {client.name}
            </CardTitle>
            {client.company && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3 w-3" />
                {client.company}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3 w-3" />
              {client.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3 w-3" />
              {client.phone}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
