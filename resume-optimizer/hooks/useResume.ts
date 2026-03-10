import { useState, useEffect } from 'react';
import { Resume } from '@/types/resume';

const STORAGE_KEY = 'resume-optimizer-data';

const defaultResume: Resume = {
  basics: {
    name: '',
    email: '',
    phone: '',
    summary: '',
    location: { city: '', country: '' },
    profiles: []
  },
  work: [],
  education: [],
  skills: [],
  projects: []
};

export function useResume() {
  const [resume, setResume] = useState<Resume>(defaultResume);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setResume({ ...defaultResume, ...parsed });
        } catch (e) {
          console.error("Failed to parse resume data", e);
        }
      }
    } catch (e) {
      console.error("Failed to load resume data", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      } catch (e) {
        console.error("Failed to save resume data", e);
      }
    }
  }, [resume, isLoaded]);

  return { resume, setResume, isLoaded };
}
