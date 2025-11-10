// stammbaum.js - Modul für die Stammbaum-Visualisierung
import { getCurrentUser } from './auth.js';
import { db, collection, getDocs } from './firebase.js';

export async function renderStammbaum(listeners) {
    const { currentFamilyId } = getCurrentUser();
    if (!currentFamilyId) {
        console.error("Keine Familien-ID gefunden.");
        return;
    }

    const container = document.getElementById('stammbaum-container');
    if (!container) {
        console.error("Stammbaum-Container nicht gefunden.");
        return;
    }

    try {
        // Lade alle Familienmitglieder
        const membersRef = collection(db, 'families', currentFamilyId, 'membersData');
        const snapshot = await getDocs(membersRef);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (members.length === 0) {
            container.innerHTML = `
                <div class="text-center text-secondary p-8 border-2 border-dashed border-border-glass rounded-lg">
                    <i data-lucide="users" class="w-12 h-12 mx-auto mb-4"></i>
                    <h3 class="font-bold text-lg">Keine Familienmitglieder</h3>
                    <p class="text-sm">Füge Mitglieder in den Einstellungen hinzu.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }

        // Baue die Baumstruktur
        const tree = buildTree(members);
        
        // Rendere den Baum
        const treeHTML = renderTreeHTML(tree, members);
        container.innerHTML = treeHTML;

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

    } catch (error) {
        console.error("Fehler beim Laden des Stammbaums:", error);
        container.innerHTML = `<p class="text-red-500">Stammbaum konnte nicht geladen werden.</p>`;
    }
}

function buildTree(members) {
    // Erstelle eine Map für schnellen Zugriff
    const memberMap = {};
    members.forEach(member => {
        memberMap[member.id] = { ...member, children: [] };
    });

    // Finde Wurzel-Mitglieder (keine Eltern) und ordne Kinder zu
    const roots = [];

    members.forEach(member => {
        if (member.isChildProfile && member.parents && member.parents.length > 0) {
            // Dies ist ein Kind - füge es zu den Eltern hinzu
            member.parents.forEach(parentId => {
                if (memberMap[parentId]) {
                    // Prüfe, ob das Kind nicht bereits hinzugefügt wurde
                    if (!memberMap[parentId].children.find(c => c.id === member.id)) {
                        memberMap[parentId].children.push(memberMap[member.id]);
                    }
                }
            });
        } else if (!member.isChildProfile) {
            // Dies ist ein Erwachsener ohne Eltern-Info -> Wurzel
            roots.push(memberMap[member.id]);
        }
    });

    // Falls keine Wurzeln gefunden wurden, nimm alle Nicht-Kind-Profile
    if (roots.length === 0) {
        members.forEach(member => {
            if (!member.isChildProfile) {
                roots.push(memberMap[member.id]);
            }
        });
    }

    return roots;
}

function renderTreeHTML(tree, allMembers) {
    if (tree.length === 0) {
        return `
            <div class="text-center text-secondary p-8">
                <p>Keine Stammbaumdaten verfügbar.</p>
            </div>
        `;
    }

    return `
        <div class="tree-container">
            <ul class="tree-root">
                ${tree.map(node => renderNodeHTML(node)).join('')}
            </ul>
        </div>
    `;
}

function renderNodeHTML(node) {
    const hasChildren = node.children && node.children.length > 0;
    const isChild = node.isChildProfile === true;
    const birthday = node.birthday ? formatBirthday(node.birthday) : null;
    
    return `
        <li class="tree-node">
            <div class="tree-card ${isChild ? 'tree-card-child' : 'tree-card-adult'}">
                <img src="${node.photoURL || 'img/default_avatar.png'}" alt="${node.name}" class="tree-avatar">
                <div class="tree-info">
                    <p class="tree-name">${node.name}</p>
                    ${isChild && birthday ? `<p class="tree-meta">${birthday}</p>` : ''}
                    ${!isChild && node.email ? `<p class="tree-meta">${node.email}</p>` : ''}
                </div>
                ${isChild ? '<span class="tree-badge">Kind</span>' : ''}
            </div>
            ${hasChildren ? `
                <ul class="tree-children">
                    ${node.children.map(child => renderNodeHTML(child)).join('')}
                </ul>
            ` : ''}
        </li>
    `;
}

function formatBirthday(birthday) {
    if (!birthday) return '';
    const date = birthday.toDate ? birthday.toDate() : new Date(birthday);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
