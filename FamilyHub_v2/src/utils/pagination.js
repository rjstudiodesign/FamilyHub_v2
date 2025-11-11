// src/utils/pagination.js
/**
 * Pagination-Helper für Firestore-Queries
 */

import { query, orderBy, limit, startAfter, getDocs } from '../firebase.js';

export class PaginationManager {
  constructor(baseQuery, pageSize = 20) {
    this.baseQuery = baseQuery;
    this.pageSize = pageSize;
    this.lastVisible = null;
    this.hasMore = true;
  }

  async getFirstPage() {
    const q = query(this.baseQuery, limit(this.pageSize));
    const snapshot = await getDocs(q);
    
    this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
    this.hasMore = snapshot.docs.length === this.pageSize;
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getNextPage() {
    if (!this.hasMore || !this.lastVisible) {
      return [];
    }

    const q = query(
      this.baseQuery,
      startAfter(this.lastVisible),
      limit(this.pageSize)
    );
    
    const snapshot = await getDocs(q);
    
    this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
    this.hasMore = snapshot.docs.length === this.pageSize;
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  reset() {
    this.lastVisible = null;
    this.hasMore = true;
  }
}
