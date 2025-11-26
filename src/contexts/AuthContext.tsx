import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { googleAuth?: boolean; name?: string; email?: string; phone?: string; role?: string }) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('bloodbank_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data based on role
      const mockUser: User = {
        id: '1',
        name: role === 'admin' ? 'Admin User' :
              role === 'donor' ? 'John Donor' :
              role === 'hospital' ? 'City Hospital' : 'Blood Seeker',
        email,
        phone: '+1234567890',
        role: role as User['role'],
        verified: true,
        createdAt: new Date().toISOString(),
      };

      if (role === 'donor') {
        mockUser.profile = {
          bloodGroup: 'O+',
          dateOfBirth: '1990-01-01',
          weight: 70,
          totalDonations: 5,
          address: '123 Main St, City',
          emergencyContact: '+9876543210',
          eligibleNext: '2024-03-01'
        };
      }

      setUser(mockUser);
      localStorage.setItem('bloodbank_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { googleAuth?: boolean; name?: string; email?: string; phone?: string; role?: string }): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Handle Google authentication
      if (userData.googleAuth) {
        const mockUser: User = {
          id: '1',
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '+1234567890',
          role: (userData.role as User['role']) || 'seeker',
          verified: true,
          createdAt: new Date().toISOString(),
        };

        setUser(mockUser);
        localStorage.setItem('bloodbank_user', JSON.stringify(mockUser));
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bloodbank_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
