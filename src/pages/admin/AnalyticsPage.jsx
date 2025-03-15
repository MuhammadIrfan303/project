import { collection, doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
export const recordPageView = async (pageId) => {
    // Add a check to prevent duplicate counts within a short time period
    const sessionKey = `pageView_${pageId}_${new Date().toDateString()}`;
    if (sessionStorage.getItem(sessionKey)) {
        return; // Skip if already viewed in this session
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const viewRef = doc(db, 'PageViews', today.toISOString().split('T')[0]);

    try {
        await setDoc(viewRef, {
            date: serverTimestamp(),
            count: increment(1)
        }, { merge: true });

        // Mark this page as viewed in the current session
        sessionStorage.setItem(sessionKey, 'true');
    } catch (error) {
        console.error('Error recording page view:', error);
    }
};