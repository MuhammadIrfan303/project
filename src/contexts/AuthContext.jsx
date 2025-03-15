import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from './../firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user data including role and last login from Firestore
        const userDoc = await getDoc(doc(db, 'Users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ ...user, ...userData });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Update last login time in Firestore
    await setDoc(doc(db, 'Users', result.user.uid), {
      lastLogin: Timestamp.now(),
    }, { merge: true });

    // Get updated user data including last login
    const userDoc = await getDoc(doc(db, 'Users', result.user.uid));
    const userData = userDoc.data();
    setCurrentUser({ ...result.user, ...userData });

    return result.user;
  };
  const register = async (email, password, userData) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: `${userData.firstName} ${userData.lastName}` });
    await setDoc(doc(db, 'Users', result.user.uid), {
      email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      status: "save",
      role: 'user',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    setCurrentUser(result.user);
    return result.user;
  };

  const logout = () => {
    auth.signOut();
    setCurrentUser(null);
  };
  // logout

  const isAdmin = () => currentUser?.role === 'admin';

  const value = { currentUser, login, register, logout, isAdmin, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};