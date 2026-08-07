import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminUsers.tsx', 'utf8');

const oldHandleRole = `  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDocument('users', userId, { role: newRole });
      loadUsers(); // refresh
    } catch (e) {
      console.error("Failed to update role", e);
    }
  };`;

const newHandleRole = `  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDocument('users', userId, { role: newRole });
      loadUsers(); // refresh
    } catch (e) {
      console.error("Failed to update role", e);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
      await updateDocument('users', userId, { status: newStatus });
      loadUsers();
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };`;

content = content.replace(oldHandleRole, newHandleRole);

// Add Status Column
content = content.replace(
  `<th className="px-6 py-4 font-bold">Role</th>`,
  `<th className="px-6 py-4 font-bold">Role</th>\n                <th className="px-6 py-4 font-bold">Status</th>`
);

const oldRoleCell = `<td className="px-6 py-4">
                      <select`;

const newRoleCell = `<td className="px-6 py-4">
                      <select`;

// We need to add the status td after the role td.
const oldSelectEnd = `</select>
                    </td>`;

const newSelectEnd = `</select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={\`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase \${u.status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}\`}>
                        {u.status === 'inactive' ? 'Inactive' : 'Active'}
                      </span>
                    </td>`;

content = content.replace(oldSelectEnd, newSelectEnd);

// Add action to toggle status
const oldMoreActions = `<td className="px-6 py-4 text-right">
                      <button className="text-stone-400 hover:text-stone-600 p-1 rounded-md hover:bg-stone-100">
                        <MoreVertical size={18} />
                      </button>
                    </td>`;

const newMoreActions = `<td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleUserStatus(u.id, u.status)}
                          className={\`text-xs px-2 py-1 rounded font-bold uppercase \${u.status === 'inactive' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}\`}
                        >
                          {u.status === 'inactive' ? 'Activate' : 'Deactivate'}
                        </button>
                      </div>
                    </td>`;

content = content.replace(oldMoreActions, newMoreActions);

fs.writeFileSync('src/pages/admin/AdminUsers.tsx', content);
