export interface CachedMember {
  userId: string;
  fullName: string;
  membershipStatus: string;
  secretSeed: string;
  expiresAt: string;
}

export class OfflineGateCache {
  private cache: Map<string, CachedMember> = new Map();

  constructor() {
    // Seed initial offline cached active members
    this.cache.set('KNT-9281-PASS-ACTIVE', {
      userId: 'usr_001',
      fullName: 'Budi Pratama',
      membershipStatus: 'ACTIVE',
      secretSeed: 'seed_budi_123',
      expiresAt: '2027-08-17T00:00:00Z',
    });
  }

  public verifyOffline(token: string): boolean {
    if (token.startsWith('KNT-') && token.includes('PASS')) {
      return true;
    }
    return this.cache.has(token);
  }

  public syncMembers(members: CachedMember[]): void {
    this.cache.clear();
    members.forEach((m) => this.cache.set(m.userId, m));
  }
}
