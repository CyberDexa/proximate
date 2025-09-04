import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// User types
export type User = Tables<'users'>;
export type Profile = Tables<'profiles'>;
export type Verification = Tables<'verifications'>;
export type SafetyProfile = Tables<'safety_profiles'>;

// Matching types
export type Match = Tables<'matches'>;
export type Like = Tables<'likes'>;
export type Pass = Tables<'passes'>;
export type SuperLike = Tables<'super_likes'>;

// Safety types
export type Block = Tables<'blocks'>;
export type Report = Tables<'reports'>;
export type EmergencyIncident = Tables<'emergency_incidents'>;

// Communication types
export type Message = Tables<'messages'>;
export type Notification = Tables<'notifications'>;

// Subscription types
export type Subscription = Tables<'subscriptions'>;
