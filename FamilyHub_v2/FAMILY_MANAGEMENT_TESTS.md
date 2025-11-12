# Family Management Test Plan

## Manual Testing Guide

This document outlines the manual testing steps to verify the Family Management application works correctly.

## Prerequisites

1. Firebase project configured
2. At least 2 test user accounts
3. Application running locally (`npm run dev`)

## Test Cases

### 1. Family Creation

**Steps:**
1. Navigate to Menu > Familienverwaltung
2. Click "Neue Familie erstellen"
3. Enter family name: "Test Familie"
4. Enter description: "Dies ist eine Test-Familie"
5. Click "Familie erstellen"

**Expected Result:**
- ✅ Modal closes
- ✅ Success notification appears
- ✅ New family appears in family selector
- ✅ User is set as admin
- ✅ Family details display correctly
- ✅ Statistics show: 1 member, 0 invites, 1 admin, 0 children

### 2. Family Switching

**Steps:**
1. Create a second family
2. Select first family from dropdown
3. Verify data changes
4. Select second family from dropdown
5. Verify data changes again

**Expected Result:**
- ✅ Family selector updates
- ✅ Family details update
- ✅ Members list updates
- ✅ Page reloads automatically
- ✅ Correct family data displays

### 3. Member Invitation

**Steps:**
1. Click "Mitglied hinzufügen"
2. Enter email: "test@example.com"
3. Click "Einladen"

**Expected Result:**
- ✅ Modal closes
- ✅ Success notification appears
- ✅ Pending invites counter increases
- ✅ Email added to pendingInvites array in Firestore

### 4. Child Profile Creation

**Steps:**
1. Click "Kind-Profil erstellen"
2. Enter name: "Max Mustermann"
3. Select birthday: "2020-01-15"
4. Select parent 1 from dropdown
5. Leave parent 2 empty
6. Click "Erstellen"

**Expected Result:**
- ✅ Modal closes
- ✅ Success notification appears
- ✅ Child profile appears in list
- ✅ Child profiles counter increases
- ✅ Age is calculated correctly
- ✅ Parent relationship displayed

### 5. Role Management

**Steps:**
1. Ensure at least 2 members exist
2. Click "Rollen verwalten"
3. Toggle admin status for a member
4. Click "Speichern"

**Expected Result:**
- ✅ Modal closes
- ✅ Success notification appears
- ✅ Admin badge appears/disappears on member
- ✅ Admin counter updates
- ✅ Changes persist on page reload

### 6. Family Settings

**Steps:**
1. Click "Familieneinstellungen"
2. Toggle "Familienprofil öffentlich"
3. Toggle "Einladungen erlauben"
4. Toggle "Neue Mitglieder"
5. Click "Speichern"

**Expected Result:**
- ✅ Modal closes
- ✅ Success notification appears
- ✅ Settings saved to Firestore
- ✅ Settings persist on reload

### 7. Edit Family Details

**Steps:**
1. Click edit button (pencil icon)
2. Change family name to "Geänderte Familie"
3. Update description
4. Click "Speichern"

**Expected Result:**
- ✅ Modal closes
- ✅ Success notification appears
- ✅ Family name updates in header
- ✅ Description updates
- ✅ Changes reflect in family selector

### 8. Delete Child Profile

**Steps:**
1. Create a child profile
2. Click delete button on child card
3. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Child profile removed from list
- ✅ Child profiles counter decreases
- ✅ Document deleted from Firestore

### 9. Leave Family

**Steps:**
1. Create/join a family
2. Click "Familieneinstellungen" > "Gefahrenbereich"
3. Click "Familie verlassen"
4. Confirm action

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ User removed from memberIds
- ✅ User removed from adminIds
- ✅ familyId removed from user document
- ✅ Page reloads
- ✅ User no longer has access to family

### 10. Real-time Synchronization

**Steps:**
1. Open app in two browser windows with same user
2. In window 1: Create a child profile
3. Observe window 2

**Expected Result:**
- ✅ Child profile appears automatically in window 2
- ✅ Statistics update in window 2
- ✅ No page reload required

## Firestore Data Verification

After each test, verify in Firebase Console:

### Family Document Structure
```javascript
{
  name: "Test Familie",
  description: "...",
  createdAt: Timestamp,
  createdBy: "userId",
  memberIds: ["userId"],
  adminIds: ["userId"],
  pendingInvites: [],
  settings: {
    publicProfile: false,
    allowInvites: true,
    notifyNewMembers: true
  }
}
```

### Member Document Structure
```javascript
{
  name: "User Name",
  email: "user@example.com",
  photoURL: "...",
  birthday: Timestamp,
  isChildProfile: false,
  joinedAt: Timestamp
}
```

### Child Profile Structure
```javascript
{
  name: "Max Mustermann",
  birthday: Timestamp,
  parents: ["parentUserId"],
  isChildProfile: true,
  photoURL: "img/default_avatar.png",
  createdAt: Timestamp
}
```

## Performance Testing

1. **Load Time**: Family list should load < 1 second
2. **Real-time Updates**: Changes should appear < 500ms
3. **UI Responsiveness**: All modals should open instantly
4. **Memory**: No memory leaks after multiple navigations

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Edge Cases

1. **No Families**: Displays "create family" prompt
2. **Single Family**: No switcher shown
3. **No Members**: Displays empty state
4. **No Children**: Shows "create child" button
5. **Offline**: Graceful error handling
6. **Network Error**: Proper error messages

## Known Issues

1. Email invitations don't send actual emails (backend needed)
2. Family deletion requires confirmation but doesn't fully delete subcollections (needs Cloud Function)
3. Member editing UI not yet implemented

## Automated Testing (Future)

Potential test cases for Jest/Cypress:
- Unit tests for all modal functions
- Integration tests for Firebase operations
- E2E tests for complete workflows
- Real-time synchronization tests

## Reporting Bugs

When reporting issues, include:
1. Steps to reproduce
2. Expected vs actual behavior
3. Browser console errors
4. Firestore data state
5. Screenshots/videos if applicable

---

Last Updated: 2025-11-12
