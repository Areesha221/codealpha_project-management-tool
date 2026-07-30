import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './MembersModal.css'

const MembersModal = ({ project, onClose, onAddMember, onRemoveMember }) => {
    const { user } = useAuth()
    const [availableUsers, setAvailableUsers] = useState([])
    const [loading, setLoading] = useState(false)

    // 🛡️ SAFETY CHECK: Agar user load nahi hua, toh kuch render mat karo
    if (!user) {
        return null 
    }

    useEffect(() => {
        loadUsers()
    }, [project.members, project.owner, user._id])

    const loadUsers = async () => {
        try {
            const response = await api.get('/auth/users')
            console.log('1. API Response:', response.data)

            const allUsers = response.data.users || []
            console.log('2. All users from DB:', allUsers)

            // 🛡️ SAFETY: Sabhi IDs ko String mein convert karo (ObjectId mismatch fix)
            const ownerId = String(project.owner?._id || '')
            const memberIds = (project.members || []).map(m => String(m._id))

            const existingIds = new Set([ownerId, ...memberIds])
            console.log('3. Already in project (Owner + Members):', Array.from(existingIds))
            console.log('4. Current Logged-in User ID:', String(user._id))

            const filtered = allUsers.filter(u => {
                const userId = String(u._id)
                const currentUserId = String(user._id)

                // Current user ko mat dikhao, aur jo pehle se members hain unko bhi mat dikhao
                return userId !== currentUserId && !existingIds.has(userId)
            })

            console.log('5. FINAL Filtered users to show:', filtered)
            setAvailableUsers(filtered)
        } catch (error) {
            console.error('Error loading users:', error)
            setAvailableUsers([])
        }
    }

    const currentMembers = project.members || []
    
    // 🛡️ SAFETY: Owner check ko string comparison se karo (100% reliable)
    const isOwner = String(project.owner?._id) === String(user._id)

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="members-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Team Members</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="members-section">
                    <h3>Current Members ({currentMembers.length + 1})</h3>

                    {/* Owner */}
                    <div className="member-item">
                        <div className="member-info">
                            <div className="member-avatar">{project.owner?.name?.[0] || 'U'}</div>
                            <div>
                                <div className="member-name">{project.owner?.name || 'Unknown'}</div>
                                <div className="member-role">Owner</div>
                            </div>
                        </div>
                    </div>

                    {/* Members */}
                    {currentMembers.map((member) => (
                        <div key={member._id} className="member-item">
                            <div className="member-info">
                                <div className="member-avatar">{member.name?.[0] || 'U'}</div>
                                <div>
                                    <div className="member-name">{member.name || 'Unknown'}</div>
                                    <div className="member-role">Member</div>
                                </div>
                            </div>
                            
                            {/* Remove button sirf Owner ko dikhega */}
                            {isOwner && (
                                <button
                                    className="remove-btn"
                                    onClick={() => onRemoveMember(member._id)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Members section sirf Owner ko dikhega */}
                {isOwner && (
                    <div className="add-member-section">
                        <h3>Add Members</h3>
                        {availableUsers.length > 0 ? (
                            availableUsers.map((u) => (
                                <div key={u._id} className="add-member-item">
                                    <div className="member-info">
                                        <div className="member-avatar">{u.name?.[0] || 'U'}</div>
                                        <div>
                                            <div className="member-name">{u.name}</div>
                                            <div className="member-email">{u.email}</div>
                                        </div>
                                    </div>
                                    <button
                                        className="add-btn"
                                        onClick={() => onAddMember(u._id)}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="no-users">No other users available to add</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MembersModal