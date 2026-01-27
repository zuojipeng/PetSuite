import crypto from 'crypto';

/**
 * Generate hash for AI reasoning tree
 * Used for on-chain verification
 */
export function hashReasoningTree(tree: any): string {
  const treeString = JSON.stringify(tree, null, 0);
  return crypto.createHash('sha256').update(treeString).digest('hex');
}

/**
 * Generate unique agent ID
 */
export function generateAgentId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}
