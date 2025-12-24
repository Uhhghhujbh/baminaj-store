import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    signInWithRedirect, 
    signOut, 
    getRedirectResult 
} from 'firebase/auth'; // Changed to signInWithRedirect
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Login Function (Now uses Redirect instead of Popup)
    const login = async () => {
        try {
            setLoading(true); // Show loading immediately
            await signInWithRedirect(auth, googleProvider);
            // The page will now reload and go to Google. 
            // When it comes back, the useEffect below handles the result.
        } catch (error) {
            console.error("Login Redirect Error:", error);
            setLoading(false);
        }
    };

    const logout = () => signOut(auth);

    const isAdmin = () => {
        return userData?.role === 'admin';
    };

    // 2. Auth Listener & Redirect Handler
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                // Fetch user data from Firestore
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        // Create new user if they don't exist
                        await setDoc(userRef, {
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            role: 'customer',
                            createdAt: serverTimestamp(),
                            lastLogin: serverTimestamp()
                        });
                        // Set local state after creation
                        setUserData({ role: 'customer' });
                    } else {
                        // Update last login
                        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
                        setUserData(userSnap.data());
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            } else {
                setCurrentUser(null);
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
