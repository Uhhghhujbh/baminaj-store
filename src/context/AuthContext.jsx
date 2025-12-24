import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

// Custom hook to use auth easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null); // Stores extra data like 'isAdmin'
    const [loading, setLoading] = useState(true);

    // 1. Login Function (Robust: Saves user to DB if new)
    const login = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Check if user exists in our DB, if not, create them
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: 'customer', // Default role
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp()
                });
            } else {
                // Update last login
                await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
            }
            return user;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    // 2. Logout Function
    const logout = () => signOut(auth);

    // 3. Admin Checker (FIXED: Removed hardcoded email)
    const isAdmin = () => {
        return userData?.role === 'admin';
    };

    // 4. Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch the extra role data
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userData,
        login,
        logout,
        isAdmin,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
