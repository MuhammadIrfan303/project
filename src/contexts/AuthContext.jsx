import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
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
        // Use user.email instead of email
        const userDoc = await getDoc(doc(db, 'Users', user.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ ...user, ...userData });
          console.log(userData);
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

    // Get updated user data including role using the correct UID
    const userDoc = await getDoc(doc(db, 'Users', email));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setCurrentUser({ ...result.user, ...userData });
    }

    return result.user;
  };

  const register = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'Users', userCredential.user.uid), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        uid: userCredential.user.uid,
        role: 'user', // Default role is user
        status: 'active'
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    signOut(auth);
    setCurrentUser(null);
  };



  const value = {
    currentUser,
    login,
    register,
    logout,

    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};