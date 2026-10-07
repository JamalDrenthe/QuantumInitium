import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, beforeEach, test } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';

const testEnv = await initializeTestEnvironment({
  projectId: 'demo-quantum-initium-rules',
  firestore: {
    rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8')
  }
});

const investor = {
  id: 'inv_investor-a',
  authUserId: 'investor-a',
  name: 'Test Investor',
  email: 'investor@example.com',
  role: 'investor',
  requestedShares: 300,
  sharesOwned: 0,
  purchasePrice: 8.2,
  currentPrice: 8.2,
  certificateId: 'QI-TEST',
  joinDate: '2026-09-30',
  cashBalance: 0,
  authorizedPersons: [],
  notifications: {
    emailTransactions: true,
    emailDividends: true,
    emailReports: true,
    priceAlerts: true,
    twoFactorEnabled: false,
    smsAlerts: false
  },
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
};

beforeEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  await testEnv.cleanup();
});

test('an investor can create and read their own account profile', async () => {
  const db = testEnv.authenticatedContext('investor-a', {
    email: 'investor@example.com'
  }).firestore();
  const ref = doc(db, 'user_accounts', 'investor-a');

  await assertSucceeds(setDoc(ref, investor));
  const snapshot = await assertSucceeds(getDoc(ref));
  assert.equal(snapshot.data()?.email, 'investor@example.com');
});

test('an investor cannot read another account profile', async () => {
  await seedAccount();
  const db = testEnv.authenticatedContext('investor-b', {
    email: 'other@example.com'
  }).firestore();

  await assertFails(getDoc(doc(db, 'user_accounts', 'investor-a')));
});

test('an investor cannot list accounts or change protected fields', async () => {
  await seedAccount();
  const db = testEnv.authenticatedContext('investor-a', {
    email: 'investor@example.com'
  }).firestore();
  const ref = doc(db, 'user_accounts', 'investor-a');

  await assertFails(getDocs(collection(db, 'user_accounts')));
  await assertFails(updateDoc(ref, { role: 'admin', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(ref, { sharesOwned: 100, updatedAt: serverTimestamp() }));
  await assertFails(deleteDoc(ref));
});

test('an investor can update profile fields without changing account identity', async () => {
  await seedAccount();
  const db = testEnv.authenticatedContext('investor-a', {
    email: 'investor@example.com'
  }).firestore();
  const ref = doc(db, 'user_accounts', 'investor-a');

  await assertSucceeds(updateDoc(ref, {
    phone: '+31 6 12345678',
    updatedAt: serverTimestamp()
  }));
});

test('a client cannot create an admin account or add unapproved fields', async () => {
  const db = testEnv.authenticatedContext('investor-a', {
    email: 'investor@example.com'
  }).firestore();
  const ref = doc(db, 'user_accounts', 'investor-a');

  await assertFails(setDoc(ref, { ...investor, role: 'admin' }));
  await assertFails(setDoc(ref, { ...investor, pinCode: '1234' }));
});

test('an admin custom claim can list and update account profiles', async () => {
  await seedAccount();
  const db = testEnv.authenticatedContext('admin-a', {
    email: 'admin@example.com',
    admin: true
  }).firestore();

  await assertSucceeds(getDocs(collection(db, 'user_accounts')));
  await assertSucceeds(updateDoc(doc(db, 'user_accounts', 'investor-a'), {
    role: 'shareholder',
    updatedAt: serverTimestamp()
  }));
});

async function seedAccount() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'user_accounts', 'investor-a'), {
      ...investor,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
}
