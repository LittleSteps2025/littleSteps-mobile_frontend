import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

/**
 * Simple hook to get child ID from session data
 * Automatically returns the first child's ID if available
 * 
 * @returns Object containing:
 * - childId: number | null - The child ID from session
 * - hasChild: boolean - Whether any child data exists
 * - childrenCount: number - Total number of children
 */
export const useChildId = () => {
  const { user } = useUser();
  const [childId, setChildId] = useState<number | null>(null);

  useEffect(() => {
    const children = user?.children || [];
    
    if (children.length > 0) {
      // Get first child's ID
      const firstChildId = children[0].child_id;
      setChildId(firstChildId);
    } else {
      setChildId(null);
    }
  }, [user?.children]);

  return {
    childId,
    hasChild: childId !== null,
    childrenCount: user?.children?.length || 0
  };
};

/**
 * Get all child IDs from session
 * 
 * @returns Array of child IDs
 */
export const useAllChildIds = () => {
  const { user } = useUser();
  
  return user?.children?.map(child => child.child_id) || [];
};

/**
 * Get specific child data by ID from session
 * 
 * @param targetId - The child ID to find
 * @returns Child data or undefined
 */
export const useChildById = (targetId: number) => {
  const { user } = useUser();
  
  return user?.children?.find(child => child.child_id === targetId);
};