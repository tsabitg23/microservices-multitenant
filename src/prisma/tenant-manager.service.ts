import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as TenantPrismaClient } from '.prisma/tenant-client'

import { LRUCache } from 'lru-cache'
import { decrypt } from '../utils/crypto';

type TenantRecord = { id: string; slug: string; dbUrl: string };

@Injectable()
export class TenantManager implements OnModuleDestroy {

  private cache = new LRUCache<string, any>({
    max: 50,             
    ttl: 1000 * 60 * 60, 
  });

  async getPrismaForTenant(tenant: TenantRecord) {
    const key = tenant.id; 
    const cached = this.cache.get(key);
    if (cached) return cached;

    const decryptedUrl = decrypt(tenant.dbUrl);

    const client = new TenantPrismaClient({
      datasources: { db: { url: decryptedUrl } },
    });

    try {
      await client.$connect();
    } catch (err) {
      await client.$disconnect();
      throw err; 
    }

    this.cache.set(key, client);
    return client;
  }

  async onModuleDestroy() {
    for (const c of this.cache.values()) {
      try { await c.$disconnect(); } catch (e) { /* do nothing */ }
    }
    this.cache.clear();
  }
}
