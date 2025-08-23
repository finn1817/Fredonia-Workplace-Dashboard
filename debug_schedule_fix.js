// 🚨 EMERGENCY SCHEDULE FIX - Direct schedule restoration
// This function directly examines and fixes the current schedule data

window.emergencyScheduleFix = async function() {
    try {
        console.log('🚨 EMERGENCY FIX - Examining and fixing current schedule data...');
        
        // Import Firebase modules
        const { initializeApp, getApp } = await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js');
        const { getFirestore, collection, getDocs, doc, getDoc, updateDoc, query, where } = await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js');
        
        // Get Firebase instance
        let db;
        try {
            db = getFirestore(getApp());
        } catch (e) {
            const workspaceConfig = {
                apiKey: "AIzaSyAt_HJiP_uuWC7-AqMKlfLwjQFsESjB364",
                authDomain: "my-admin-dashboard-b9c89.firebaseapp.com",
                projectId: "my-admin-dashboard-b9c89",
                storageBucket: "my-admin-dashboard-b9c89.firebasestorage.app",
                messagingSenderId: "1001105953619",
                appId: "1:1001105953619:web:1e2cf52a9ff37aeb5207a6"
            };
            const app = initializeApp(workspaceConfig, 'emergency-fix-' + Date.now());
            db = getFirestore(app);
        }
        
        const workplaceId = 'eSports Lounge';
        console.log(`🚨 EMERGENCY FIX - Checking ${workplaceId} schedules...`);
        
        // Get current schedule
        const schedulesRef = collection(db, 'workplaces', workplaceId, 'schedules');
        const currentScheduleQuery = query(schedulesRef, where('isCurrent', '==', true));
        const currentScheduleSnapshot = await getDocs(currentScheduleQuery);
        
        if (currentScheduleSnapshot.empty) {
            console.log('❌ No current schedule found');
            return;
        }
        
        const scheduleDoc = currentScheduleSnapshot.docs[0];
        const scheduleData = scheduleDoc.data();
        const schedule = scheduleData.schedule;
        
        console.log('🚨 EMERGENCY FIX - Current schedule ID:', scheduleDoc.id);
        console.log('🚨 EMERGENCY FIX - Schedule data structure:', Object.keys(schedule || {}));
        
        // Look for Thursday shifts specifically
        if (schedule.Thursday) {
            console.log('🚨 EMERGENCY FIX - Thursday shifts found:', schedule.Thursday.length);
            
            schedule.Thursday.forEach((shift, index) => {
                console.log(`🚨 EMERGENCY FIX - Thursday shift ${index}:`, shift);
                
                // Look for the 8:00 PM shift that should be problematic
                if (shift.startTime === '20:00' || shift.start === '20:00' || 
                    shift.startTime === '8:00 PM' || shift.start === '8:00 PM') {
                    
                    console.log(`🎯 EMERGENCY FIX - Found 8PM Thursday shift [${index}]:`, shift);
                    console.log(`🎯 EMERGENCY FIX - Current assigned workers:`, shift.assigned);
                    console.log(`🎯 EMERGENCY FIX - Raw assigned:`, shift.raw_assigned);
                    
                    // Check if Test Cover is in the assignments
                    if (shift.assigned && shift.assigned.includes('Test Cover')) {
                        console.log('🚨 FOUND THE PROBLEM! "Test Cover" is still assigned to this shift!');
                        
                        // Remove Test Cover and restore original worker
                        const newAssigned = shift.assigned.filter(worker => worker !== 'Test Cover');
                        
                        // If we have coverage data, we should restore from that
                        // For now, let's try to find who was originally assigned
                        console.log('🔄 EMERGENCY FIX - Removing "Test Cover" from assignments');
                        console.log('🔄 EMERGENCY FIX - Current assignments:', shift.assigned);
                        console.log('🔄 EMERGENCY FIX - New assignments (after removing Test Cover):', newAssigned);
                        
                        // Update the shift
                        shift.assigned = newAssigned;
                        
                        // Also check raw_assigned
                        if (shift.raw_assigned && shift.raw_assigned.includes('Test Cover')) {
                            shift.raw_assigned = shift.raw_assigned.filter(worker => worker !== 'Test Cover');
                            console.log('🔄 EMERGENCY FIX - Also updated raw_assigned:', shift.raw_assigned);
                        }
                        
                        console.log('🔄 EMERGENCY FIX - Updated shift:', shift);
                    }
                }
            });
            
            // Update the schedule in the database
            console.log('💾 EMERGENCY FIX - Updating schedule in database...');
            await updateDoc(scheduleDoc.ref, {
                schedule: schedule,
                lastModified: new Date().toISOString(),
                emergencyFixApplied: new Date().toISOString()
            });
            
            console.log('✅ EMERGENCY FIX - Schedule updated successfully!');
            
        } else {
            console.log('❌ No Thursday shifts found in schedule');
        }
        
        // Now let's also check all shift_coverage records and flag them
        console.log('🚨 EMERGENCY FIX - Checking and flagging all coverage records...');
        const coverageRef = collection(db, 'workplaces', workplaceId, 'shift_coverage');
        const coverageSnapshot = await getDocs(coverageRef);
        
        console.log(`🚨 EMERGENCY FIX - Found ${coverageSnapshot.size} coverage records`);
        
        for (const coverageDoc of coverageSnapshot.docs) {
            const coverage = coverageDoc.data();
            console.log(`🚨 EMERGENCY FIX - Coverage record ${coverageDoc.id}:`, coverage);
            
            if (!coverage.datePassed) {
                console.log(`🔄 EMERGENCY FIX - Flagging coverage record ${coverageDoc.id} as datePassed=true`);
                
                await updateDoc(coverageDoc.ref, {
                    datePassed: true,
                    processedAt: new Date().toISOString(),
                    status: 'emergency_fix_applied',
                    fixedBy: 'emergencyScheduleFix'
                });
                
                console.log(`✅ EMERGENCY FIX - Flagged ${coverageDoc.id}`);
            }
        }
        
        console.log('🎉 EMERGENCY FIX COMPLETE! Please refresh the page to see changes.');
        alert('Emergency fix applied! Please refresh the page to see the corrected schedule.');
        
    } catch (error) {
        console.error('🚨 EMERGENCY FIX - Error:', error);
    }
};

console.log('🚨 EMERGENCY SCHEDULE FIX LOADED!');
console.log('Run: emergencyScheduleFix() to directly fix the schedule data');
